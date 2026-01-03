'use client'

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

  return (
    <>
      <header className="text-xl mb-4">
        Asistente: {assistant?.name}
      </header>

      <textarea
        className="w-full h-40 p-4 bg-card rounded-xl"
        placeholder="Escribe aquí las reglas e instrucciones para entrenar al asistente..."
        value={rules}
        onChange={(e) => setRules(e.target.value)}
      />
      <Button onClick={handleTrainingUpdate}>
        Guardar
      </Button>
    </>
  )
}
