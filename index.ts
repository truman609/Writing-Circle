import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { WritingCircleChatBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/writing-circle/chat", async (req, res) => {
  const parsed = WritingCircleChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { systemPrompt, messages } = parsed.data;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const block = message.content[0];
    const reply = block.type === "text" ? block.text : "";
    res.json({ reply });
  } catch (err) {
    console.error("Error calling Anthropic:", err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

export default router;
