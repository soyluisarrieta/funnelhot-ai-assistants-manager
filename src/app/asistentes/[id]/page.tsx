'use client'

import AssistantChat from "@/components/assistants/assistant-chat"
import AssistantTraining from "@/components/assistants/assistant-training"
import { getAssistantById } from "@/services/assistants.service"
import { Assistant } from "@/types/assistant"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TrainingPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const loadAssistant = async () => {
      const data = await getAssistantById(id)
      if (!data) return
      setAssistant(data)
      setIsLoading(false)
    }
    loadAssistant()
  }, [id])

  if (isLoading) return <p>Cargando información...</p>
  if (!assistant) return <p>Asistente no encontrado</p>

  return (
    <div className="flex flex-col h-dvh">
      <header className="text-xl mb-4">
        Asistente: {assistant?.name}
      </header>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="w-full min-h-96 flex flex-col p-1 md:px-0">
          <AssistantTraining assistant={assistant} />
        </div>

        <div className="w-full md:max-w-md lg:max-w-lg h-dvh min-h-96 md:h-full flex flex-col p-1 pb-0 md:pr-0">
           <AssistantChat assistantId={assistant.id} /> 
        </div>
      </div>
    </div>
  )
}
