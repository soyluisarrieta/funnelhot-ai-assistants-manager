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
  saveToStorage(STORAGE_KEYS.ASSISTANTS, [...assistants, assistant])
}

export const updateAssistant = async (assistant: Assistant): Promise<void> => {
  await delay()
  const assistants = await getAssistants()
  const updated = assistants.map(a =>
    a.id === assistant.id ? assistant : a
  )
  saveToStorage(STORAGE_KEYS.ASSISTANTS, updated)
}

export const deleteAssistant = async (id: string): Promise<void> => {
  await delay()
  const assistants = await getAssistants()
  saveToStorage(
    STORAGE_KEYS.ASSISTANTS,
    assistants.filter(a => a.id !== id)
  )
}