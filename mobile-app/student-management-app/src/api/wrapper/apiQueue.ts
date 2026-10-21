import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from "../../../config/config";

let isFlushing = false;
const MAX_RETRIES = 3;
const QUEUE_KEY = "apiQueue";

export type QueuedRequest = {
  url: string;
  method: "POST";
  headers: Record<string, string>;
  body: any;
  timestamp: string;
  retryCount?: number;
};

export class ClientError extends Error {
  isClientError: boolean;
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ClientError";
    this.isClientError = true;
    this.statusCode = statusCode;
  }
}

// Auto-flush queue when device reconnects to network
NetInfo.addEventListener((state) => {
  if (state.isConnected && !isFlushing) {
    flushQueue().catch((err) => {
      console.warn("Auto-flush on reconnect failed:", err);
    });
  }
});

export const dispatchApiCall = async (
  req: Omit<QueuedRequest, "timestamp" | "retryCount">
) => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  const fullReq: QueuedRequest = {
    ...req,
    timestamp: new Date().toISOString(),
    retryCount: 0,
  };

  if (isConnected && !isFlushing) {
    // Flush existing queue first
    await flushQueue();
    // Send the request
    return await sendRequest(fullReq);
  } else {
    // Offline: store request in queue
    const current = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedRequest[] = current ? JSON.parse(current) : [];
    queue.push(fullReq);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log("Request queued for offline sync:", fullReq.url);
    return { success: true, queued: true, message: "Request queued for offline sync" };
  }
};

const sendRequest = async (req: QueuedRequest) => {
  try {
    const res = await fetch(`${BASE_URL}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
    });

    if (!res.ok) {
      const isClient = res.status >= 400 && res.status < 500;
      if (isClient) {
        throw new ClientError(res.status, `Client error ${res.status}, not retrying`);
      } else {
        throw new Error(`Server error: ${res.status}`);
      }
    }
    return await res.json();
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
};

export const flushQueue = async () => {
  if (isFlushing) return; // Prevent concurrent flushes
  isFlushing = true;

  try {
    const current = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedRequest[] = current ? JSON.parse(current) : [];
    if (queue.length === 0) {
      return;
    }

    const newQueue: QueuedRequest[] = [];

    for (const req of queue) {
      try {
        await sendRequest(req);
      } catch (error: any) {
        // Discard 4xx client errors (bad payloads, expired IDs, etc.)
        if (error instanceof ClientError || error?.isClientError) {
          console.warn("Discarding client error from retry queue:", req.url, error.message);
          continue;
        }

        const retries = (req.retryCount || 0) + 1;
        if (retries <= MAX_RETRIES) {
          newQueue.push({ ...req, retryCount: retries });
        } else {
          console.warn(`Max retries (${MAX_RETRIES}) reached for request, dropping:`, req.url);
        }
      }
    }
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  } catch (error) {
    console.error("Error flushing queue:", error);
  } finally {
    isFlushing = false;
  }
};
