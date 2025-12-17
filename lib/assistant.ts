const cannedResponses = [
  "Let's explore how we can simplify this file and remove unnecessary state.",
  "I can scaffold unit tests targeting the core hooks and flows.",
  "Consider extracting shared logic into a utility to keep components lean.",
  "We should annotate the API surface with JSDoc to improve discoverability.",
];

export function generateAssistantReply(prompt: string, contextSnippet?: string): string {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("test")) {
    return "I'll outline a Vitest suite that covers the critical render and interaction paths.";
  }

  if (normalized.includes("refactor")) {
    return "Let's refactor this by splitting the component and introducing composable primitives.";
  }

  if (normalized.includes("bug") || normalized.includes("fix")) {
    return "I'll craft a focused patch that resolves the bug and adds regression coverage.";
  }

  if (normalized.includes("explain")) {
    return contextSnippet
      ? `Here's a walkthrough based on the current file: ${contextSnippet}`
      : "Let me break down the important pieces of this file for you.";
  }

  return cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
}
