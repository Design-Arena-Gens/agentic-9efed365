import type { WorkspaceNode } from "@/types/workspace";

export const initialWorkspace: WorkspaceNode[] = [
  {
    id: "src",
    name: "src",
    kind: "folder",
    children: [
      {
        id: "src/app.tsx",
        name: "app.tsx",
        kind: "file",
        language: "typescript",
        content: `import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="h-screen bg-[#0f111a] text-white">
      <section className="mx-auto flex max-w-3xl flex-col gap-4 py-16">
        <header className="flex flex-col gap-2">
          <span className="text-sm text-white/60">src/app.tsx</span>
          <h1 className="text-3xl font-semibold">Welcome to the Agentic Workspace</h1>
          <p className="text-white/70">
            This page mirrors the experience of working inside Cursor. Edit files, talk to the agent, and iterate quickly.
          </p>
        </header>

        <div className="rounded-lg border border-white/10 bg-[#161a2b] p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">Interactive State</p>
          <div className="mt-6 flex items-center gap-4">
            <button
              className="rounded-full bg-[#3a7bff] px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-[#346de0]"
              onClick={() => setCount((value) => value + 1)}
            >
              Run Agent ({count})
            </button>
            <code className="rounded bg-black/40 px-3 py-1 text-sm text-white/80">count =&gt; count + 1</code>
          </div>
        </div>
      </section>
    </main>
  );
}
`,
      },
      {
        id: "src/utils/ai.ts",
        name: "ai.ts",
        kind: "file",
        language: "typescript",
        content: `const cannedResponses = [
  "Consider extracting this logic into a custom hook for reusability.",
  "We can optimize this data fetch with React Query or SWR.",
  "How about wiring this button to trigger the agent's code action?",
];

export function generateAssistantReply(prompt: string): string {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("test") || normalized.includes("unit")) {
    return "Let's scaffold a Vitest suite that focuses on the critical user flows.";
  }

  if (normalized.includes("refactor")) {
    return "We can refactor by splitting the component and introducing smaller primitives.";
  }

  if (normalized.includes("bug") || normalized.includes("error")) {
    return "I'll create a patch that resolves the bug and adds a regression test.";
  }

  return cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
}
`,
      },
      {
        id: "src/components/prompt.tsx",
        name: "prompt.tsx",
        kind: "file",
        language: "typescript",
        content: `interface PromptProps {
  onSubmit: (value: string) => void;
}

export function Prompt({ onSubmit }: PromptProps) {
  return (
    <form
      className="rounded-lg border border-white/10 bg-[#101320] p-3 text-sm text-white/80"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const fd = new FormData(form);
        const value = (fd.get("prompt") as string)?.trim();

        if (!value) return;

        onSubmit(value);
        form.reset();
      }}
    >
      <label className="text-xs uppercase tracking-[0.35em] text-white/45">Prompt</label>
      <div className="mt-2 flex items-center gap-2">
        <input
          name="prompt"
          placeholder="Ask the agent to refactor, generate tests, or explain this file"
          autoFocus
          className="h-9 flex-1 rounded bg-black/30 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#3a7bff]"
        />
        <button
          type="submit"
          className="rounded bg-[#3a7bff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#346de0]"
        >
          Send
        </button>
      </div>
    </form>
  );
}
`,
      },
    ],
  },
  {
    id: "README.md",
    name: "README.md",
    kind: "file",
    language: "markdown",
    content: `# Agentic Workspace\n\nThis is a simulated developer environment inspired by Cursor.\n\n## Features\n- File tree with instant navigation\n- Monaco-powered editor\n- AI-inspired chat assistant\n- Command palette for quick actions\n`,
  },
];
