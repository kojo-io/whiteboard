export type FormTemplate = {
  name: string;
  questions: QuestionTemplate[],
}

export type QuestionTemplate = {
  id: string;
  question: string;
  description: string;
  required: boolean;
  responseType: 'SHORT TEXT' | 'LONG TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN'
}
