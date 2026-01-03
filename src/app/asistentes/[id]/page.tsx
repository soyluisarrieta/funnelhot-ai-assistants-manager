'use client'

import AssistantChat from "@/components/assistants/assistant-chat"
import { Button } from "@/components/ui/button"
import { useAssistants } from "@/hook/useAssistants"
import { getAssistantById } from "@/services/assistants.service"
import { Assistant } from "@/types/assistant"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TrainingPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [rules, setRules] = useState<Assistant['rules']>()

  const { id } = useParams<{ id: string }>()
  const { actions } = useAssistants()

  useEffect(() => {
    const loadAssistant = async () => {
      const data = await getAssistantById(id)
      if (!data) return
      setAssistant(data)
      setRules(data.rules)
    }
    loadAssistant()
  }, [id])

  const handleTrainingUpdate = () => {
    if (!assistant) return
    actions.update({ ...assistant, rules: rules || '' })
  }

  if (!assistant) return <p>Asistente no encontrado</p>

  return (
    <div className="flex flex-col h-dvh">
      <header className="text-xl mb-4">
        Asistente: {assistant?.name}
      </header>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Training Area */}
        <div>
          <textarea
            className="w-full h-40 p-4 bg-card rounded-xl"
            placeholder="Escribe aquí las reglas e instrucciones para entrenar al asistente..."
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />
          <Button onClick={handleTrainingUpdate}>
            Guardar
          </Button>
        </div>

        {/* Chat */}
        <div className="w-full md:max-w-md lg:max-w-lg h-dvh min-h-96 md:h-full flex flex-col p-1 pb-0 md:pr-0">
           <AssistantChat assistantId={assistant.id} /> 
        </div>
      </div>
    </div>
  )
}
