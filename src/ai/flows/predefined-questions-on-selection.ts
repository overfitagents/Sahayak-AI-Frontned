'use server';
/**
 * @fileOverview A Genkit flow for handling predefined questions on a selection (text or image).
 *
 * - askPredefinedQuestion - A function that handles the predefined question process.
 * - AskPredefinedQuestionInput - The input type for the askPredefinedQuestion function.
 * - AskPredefinedQuestionOutput - The return type for the askPredefinedQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { predefinedActions } from '@/lib/actions';

const AskPredefinedQuestionInputSchema = z.object({
  contextText: z.string().optional().describe('The original text from which a snippet was selected.'),
  selectedText: z.string().optional().describe('The portion of text selected by the user.'),
  imageDataUri: z.string().optional().describe("A data URI of the image or image region selected by the user. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  action: z.enum(predefinedActions).describe('The predefined action selected by the user.'),
});
export type AskPredefinedQuestionInput = z.infer<typeof AskPredefinedQuestionInputSchema>;

const AskPredefinedQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI’s answer based on the selected content and action.'),
});
export type AskPredefinedQuestionOutput = z.infer<typeof AskPredefinedQuestionOutputSchema>;

export async function askPredefinedQuestion(input: AskPredefinedQuestionInput): Promise<AskPredefinedQuestionOutput> {
  return askPredefinedQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askPredefinedQuestionPrompt',
  input: {schema: AskPredefinedQuestionInputSchema},
  output: {schema: AskPredefinedQuestionOutputSchema},
  prompt: `You are a helpful AI assistant. A user has selected content (either text or a part of an image) and chosen an action. Provide a response based on the selection and the action.

{{#if selectedText}}
The user selected the following text: "{{selectedText}}"
{{/if}}

{{#if contextText}}
This text was part of the larger context: "{{contextText}}"
{{/if}}

{{#if imageDataUri}}
The user selected an area of an image.
Image: {{media url=imageDataUri}}
{{/if}}

The user wants you to perform the following action: {{action}}.

Please provide a concise and helpful response.`,
});

const askPredefinedQuestionFlow = ai.defineFlow(
  {
    name: 'askPredefinedQuestionFlow',
    inputSchema: AskPredefinedQuestionInputSchema,
    outputSchema: AskPredefinedQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
