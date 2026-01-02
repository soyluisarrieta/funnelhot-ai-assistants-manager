import { STORAGE_KEYS } from "@/constants/storage"
import { delay, getFromStorage, saveToStorage } from "@/lib/storage"
import { Assistant } from "@/types/assistant"

export const getAssistants = async (): Promise<Assistant[]> => {
  await delay()
  return getFromStorage<Assistant[]>(STORAGE_KEYS.ASSISTANTS) ?? []
}

export const createAssistant = async (assistant: Assistant): Promise<void> => {
  await delay()
  const assistants = await getAssistants()
  console.log([...assistants, assistant]);
  
  saveToStorage(STORAGE_KEYS.ASSISTANTS, [...assistants, assistant])
}