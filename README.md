# Agentic Cursor Clone

Modern web-based workspace inspired by the Cursor editor. The experience includes a Monaco-powered code editor, AI-flavoured chat, command palette, and live file explorer – all ready to deploy on Vercel.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the interface.

## 🧱 Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS for styling
- Monaco Editor for code editing
- Zustand for state management

## ✨ Core Features

- Multi-pane layout mirroring the Cursor UI
- Persistent file explorer with search and new-file workflow
- Monaco editor with automatic language detection
- AI-styled chat assistant with contextual responses
- Command palette triggered via `Cmd/Ctrl + K`
- Responsive design optimised for desktop viewports

## 📂 Project Structure

```
app/                Next.js app router pages and layout
components/         Shared UI building blocks
lib/                Workspace seeds and assistant helpers
store/              Zustand store for workspace state
types/              Shared TypeScript definitions
```

## 🧪 Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – run the production server
- `npm run lint` – lint with ESLint + Next.js config
- `npm run test` – execute Vitest in JSDOM

## 📦 Deployment

The project is optimised for Vercel. Build and deploy with:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-9efed365
```

Once deployed, confirm at `https://agentic-9efed365.vercel.app`.

Enjoy building in an AI-first developer cockpit!
