import OpenAI from 'openai';

import { env } from '../utils/env.js';

const openai = new OpenAI({
  apiKey: env('OPENAI_API_KEY'),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const askChat = async (word, targetLanguage) => {
  await sleep(1000);

  const prompts = `Translate the word "${word}" into ${targetLanguage}. Provide only the translation, no additional text.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    prompts,
    max_tokens: 10,
  });

  const translation = res.data.choices[0].text.trim();

  return translation;
};
