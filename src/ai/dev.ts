'use server';
/**
 * @fileOverview This file imports all the Genkit flows that are used in the application.
 *
 * - questions-about-image-areas: Flow for answering questions about specific regions of an image.
 * - follow-up-questions-on-text: Flow for answering follow-up questions on selected text.
 * - predefined-questions-on-selection: Flow for handling predefined questions on a text or image selection.
 * - generate-image: Flow for generating an image from a text prompt.
 */

import '@/ai/flows/questions-about-image-areas.ts';
import '@/ai/flows/follow-up-questions-on-text.ts';
import '@/ai/flows/predefined-questions-on-selection.ts';
import '@/ai/flows/generate-image.ts';
