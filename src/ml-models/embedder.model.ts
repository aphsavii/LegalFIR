import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { OpenAIEmbeddings } from "@langchain/openai";

const embedderModel = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

const openAiEmbedder = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model:"text-embedding-3-small"
});


export {embedderModel, openAiEmbedder};