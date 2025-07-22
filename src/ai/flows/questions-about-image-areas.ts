'use server';
/**
 * @fileOverview An AI agent that allows users to ask questions about specific areas of an image.
 *
 * - questionsAboutImageAreas - A function that handles the image question answering process.
 * - QuestionsAboutImageAreasInput - The input type for the questionsAboutImageAreas function.
 * - QuestionsAboutImageAreasOutput - The return type for the questionsAboutImageAreas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionsAboutImageAreasInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo with a marked region, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the marked area.'),
});
export type QuestionsAboutImageAreasInput = z.infer<typeof QuestionsAboutImageAreasInputSchema>;

const QuestionsAboutImageAreasOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the marked area.'),
});
export type QuestionsAboutImageAreasOutput = z.infer<typeof QuestionsAboutImageAreasOutputSchema>;

export async function questionsAboutImageAreas(input: QuestionsAboutImageAreasInput): Promise<QuestionsAboutImageAreasOutput> {
  return questionsAboutImageAreasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionsAboutImageAreasPrompt',
  input: {schema: QuestionsAboutImageAreasInputSchema},
  output: {schema: QuestionsAboutImageAreasOutputSchema},
  prompt: `You are an expert AI that answers question about images.

  You will use this information to answer the user's question about a specific region of the image.

  Use the following as the primary source of information about the image.

  Question: {{{question}}}
  Image: {{media url=photoDataUri}}`,
});

const questionsAboutImageAreasFlow = ai.defineFlow(
  {
    name: 'questionsAboutImageAreasFlow',
    inputSchema: QuestionsAboutImageAreasInputSchema,
    outputSchema: QuestionsAboutImageAreasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
