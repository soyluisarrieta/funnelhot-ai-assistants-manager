import { Assistant } from "@/types/assistant";

export const ASSISTANTS_MOCK: Assistant[] = [
  {
    id: "1",
    name: "Asistente de Ventas",
    language: "Español",
    tone: "Profesional",
    responseLength: {
      short: 30,
      medium: 50,
      long: 20,
    },
    audioEnabled: true,
    rules:
      "Eres un asistente especializado en ventas. Sé cordial y enfócate en identificar necesidades antes de ofrecer productos.",
  },
] as const;
