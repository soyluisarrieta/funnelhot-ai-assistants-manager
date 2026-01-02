'use client'

import { useEffect, useState } from 'react'
import { Assistant } from '@/types/assistant'
import {
  getAssistants,
  createAssistant,
} from '@/services/assistants.service'


interface AssistantsActions {
  create: (assistant: Assistant) => Promise<void>;
}

interface UseAssistants {
  assistants: Assistant[]
  actions: AssistantsActions 
}

export function useAssistants(): UseAssistants {
  const [assistants, setAssistants] = useState<Assistant[]>([])

  useEffect(() => {
    const loadAssistants = async () => {
      const data = await getAssistants()
      setAssistants(data)
    }
    loadAssistants()
  }, [])
  
  const create = async (assistant: Assistant) => {
    await createAssistant(assistant)
    setAssistants(prev => [...prev, assistant])
  }

  return {
    assistants,
    actions: {
      create,
    }
  }
}
