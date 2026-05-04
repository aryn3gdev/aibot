import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: req.body.prompt
        })
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({
        reply: "HF returned invalid response",
        raw: text
      });
    }

    const reply = data?.[0]?.generated_text || data?.generated_text || "No response";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "request failed" });
  }
});

app.listen(process.env.PORT || 3000);
