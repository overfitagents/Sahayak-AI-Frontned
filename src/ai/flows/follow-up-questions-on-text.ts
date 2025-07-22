'use server';
/**
 * @fileOverview A Genkit flow for handling follow-up questions on selected text.
 *
 * - askFollowUpQuestion - A function that handles the follow-up question process.
 * - AskFollowUpQuestionInput - The input type for the askFollowUpQuestion function.
 * - AskFollowUpQuestionOutput - The return type for the askFollowUpQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFollowUpQuestionInputSchema = z.object({
  originalText: z.string().describe('The original text from the AI response.'),
  selectedText: z.string().describe('The portion of text selected by the user.'),
  followUpQuestion: z.string().describe('The user-provided follow-up question.'),
});
export type AskFollowUpQuestionInput = z.infer<typeof AskFollowUpQuestionInputSchema>;

const AskFollowUpQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI’s answer to the follow-up question.'),
});
export type AskFollowUpQuestionOutput = z.infer<typeof AskFollowUpQuestionOutputSchema>;

export async function askFollowUpQuestion(input: AskFollowUpQuestionInput): Promise<AskFollowUpQuestionOutput> {
  return askFollowUpQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFollowUpQuestionPrompt',
  input: {schema: AskFollowUpQuestionInputSchema},
  output: {schema: AskFollowUpQuestionOutputSchema},
  prompt: `You are a helpful AI assistant. A user has selected a portion of text from a previous AI response and asked a follow-up question. Use the selected text and the follow-up question to provide a concise and informative answer.

Original Text: {{{originalText}}}
Selected Text: {{{selectedText}}}
Follow-up Question: {{{followUpQuestion}}}

Answer:`, // Keep the prompt simple and direct.
});

const askFollowUpQuestionFlow = ai.defineFlow(
  {
    name: 'askFollowUpQuestionFlow',
    inputSchema: AskFollowUpQuestionInputSchema,
    outputSchema: AskFollowUpQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

