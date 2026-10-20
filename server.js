import express from "express";
import { fal } from "@fal-ai/client";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

if (!process.env.FAL_KEY) {
  console.warn("AVISO: FAL_KEY não está definida. Configure-a nas variáveis de ambiente do servidor.");
} else {
  fal.config({ credentials: process.env.FAL_KEY });
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const IMAGE_MODEL = "fal-ai/flux/dev";
const VIDEO_MODEL = "fal-ai/bytedance/seedance/v1.5/pro/text-to-video";

app.post("/api/generate", async (req, res) => {
  try {
    if (!process.env.FAL_KEY) {
      return res.status(500).json({ error: "FAL_KEY não está configurada no servidor." });
    }
    const { mode, prompt, ratio } = req.body ?? {};
    if (!["image", "video"].includes(mode)) {
      return res.status(400).json({ error: "Escolha imagem ou vídeo." });
    }
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Escreva uma descrição para gerar." });
    }
    if (prompt.length > 4000) {
      return res.status(400).json({ error: "O prompt deve ter no máximo 4000 caracteres." });
    }

    let result;
    if (mode === "image") {
      const imageSize = ({
        "1:1": "square",
        "9:16": "portrait_16_9",
        "4:3": "landscape_4_3",
        "16:9": "landscape_16_9"
      })[ratio] || "landscape_16_9";
      result = await fal.subscribe(IMAGE_MODEL, {
        input: { prompt: prompt.trim(), image_size: imageSize, num_images: 1, enable_safety_checker: true }
      });
      const url = result?.data?.images?.[0]?.url;
      if (!url) return res.status(502).json({ error: "A fal.ai não retornou uma imagem." });
      return res.json({ type: "image", url, requestId: result.requestId });
    }

    result = await fal.subscribe(VIDEO_MODEL, {
      input: { prompt: prompt.trim() },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          for (const log of update.logs ?? []) console.log("[fal.ai]", log.message);
        }
      }
    });
    const url = result?.data?.video?.url;
    if (!url) return res.status(502).json({ error: "A fal.ai não retornou um vídeo." });
    return res.json({ type: "video", url, requestId: result.requestId });
  } catch (error) {
    console.error("fal.ai generation error:", error);
    const message = error?.message || "Erro inesperado na geração.";
    return res.status(502).json({
      error: message.includes("401") || message.toLowerCase().includes("unauthorized")
        ? "A fal.ai recusou a chave. Confira FAL_KEY nas variáveis de ambiente."
        : message
    });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Sora 3.1 API proxy" }));

app.listen(PORT, () => console.log(`Sora 3.1 disponível na porta ${PORT}`));
