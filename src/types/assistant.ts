import { LANGUAGES, TONES } from "@/constants/assistant-options";

export type Language = (typeof LANGUAGES)[number];
export type Tone = (typeof TONES)[number];

export interface ResponseLength {
  short: number;
  medium: number;
  long: number;
}

export interface Assistant {
  id: string;
  name: string;
  language: Language;
  tone: Tone;
  responseLength: ResponseLength;
  audioEnabled: boolean;
  rules: string;
}
