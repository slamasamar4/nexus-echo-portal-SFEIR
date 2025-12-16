import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const HF_MODEL_URL =
  "https://router.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct";

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const hfResponse = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: messages,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        },
      }),
    });

    const data = await hfResponse.json();
    res.json(data);

  } catch (error) {
    console.error("HF error:", error);
    res.status(500).json({ error: "AI service error" });
  }
});

export default router;
