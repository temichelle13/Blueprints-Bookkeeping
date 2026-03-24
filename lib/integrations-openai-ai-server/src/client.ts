import OpenAI from "openai";

const apiKey =
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

export const isOpenAiConfigured = Boolean(apiKey);

export const openai = isOpenAiConfigured
  ? new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    })
  : null;
