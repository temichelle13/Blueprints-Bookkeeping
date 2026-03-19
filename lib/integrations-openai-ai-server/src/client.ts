import OpenAI from "openai";

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

export const isOpenAiConfigured = Boolean(apiKey && baseURL);

export const openai = isOpenAiConfigured
  ? new OpenAI({
      apiKey,
      baseURL,
    })
  : null;
