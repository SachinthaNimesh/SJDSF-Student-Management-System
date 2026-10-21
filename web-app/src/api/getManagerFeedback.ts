import apiClient from "../lib/axios";

export type FeedbackResponse = {
  [key: string]: string;
};

export async function getManagerFeedback(): Promise<FeedbackResponse[]> {
  try {
    const res = await apiClient.get<FeedbackResponse[]>("/manager-feedback");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Failed to fetch manager feedback:", error);
    throw error;
  }
}
