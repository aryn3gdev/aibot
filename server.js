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
          "Authorization": `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: req.body.prompt
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ error: "request failed" });
  }
});

app.listen(3000);
