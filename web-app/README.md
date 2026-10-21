# SJDSF Student Management System - Web App

Web dashboard built with React 18, Vite, TypeScript, Tailwind CSS, and Shadcn UI.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd web-app
npm install
```

### Local Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port specified by Vite).

### Build for Production

Build the production bundle into the `dist/` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Configuration

Configuration is managed via `src/config/configs.ts`.

1. **Development (`.env`)**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=/choreo-apis/student-management-system/backend/v1
   VITE_API_KEY=your_api_key
   VITE_GOOGLE_SHEET_API_KEY=your_google_sheets_key
   ```

2. **Runtime Deployment (Choreo / Production)**:
   A `config.js` script can be served in the `public/` directory to inject `window.config` dynamically at container startup without rebuilding the frontend bundle.
