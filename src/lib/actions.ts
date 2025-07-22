export const predefinedActions = ['Explain', 'Question', 'Analogy', 'Activity', 'Revision'] as const;
export type PredefinedAction = (typeof predefinedActions)[number];
