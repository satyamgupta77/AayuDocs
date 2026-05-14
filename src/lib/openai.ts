import OpenAI from 'openai';

// Initialize the OpenAI client singleton
// This will automatically use process.env.OPENAI_API_KEY
export const openai = new OpenAI();

/**
 * Summarizes a given text extracted from a PDF.
 */
export async function summarizePdfContent(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an expert document analyzer. Summarize the following text clearly and concisely, highlighting the main points and key takeaways." },
      { role: "user", content: text }
    ],
    temperature: 0.5,
  });

  return completion.choices[0]?.message?.content || "Failed to summarize document.";
}

/**
 * Formats and corrects OCR output
 */
export async function enhanceOcrText(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an expert OCR corrector. The following text was extracted from an image via OCR. Please fix any obvious typos, formatting errors, and line breaks while strictly preserving the original meaning." },
      { role: "user", content: text }
    ],
    temperature: 0.2,
  });

  return completion.choices[0]?.message?.content || text;
}
