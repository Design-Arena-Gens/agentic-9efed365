import { describe, expect, it } from "vitest";
import { generateAssistantReply } from "@/lib/assistant";

describe("generateAssistantReply", () => {
  it("prioritises testing prompts", () => {
    expect(generateAssistantReply("Please add tests"))
      .toContain("Vitest");
  });

  it("falls back to canned responses", () => {
    const reply = generateAssistantReply("Say something creative");
    expect(reply.length).toBeGreaterThan(0);
  });
});
