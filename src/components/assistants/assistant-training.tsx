"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SaveIcon, CheckCircle2Icon } from "lucide-react"
import { useAssistants } from "@/hook/useAssistants"
import { Assistant } from "@/types/assistant"

interface Props {
  assistant: Assistant
}

export default function AssistantTraining({ assistant }: Props) {
  const [rules, setRules] = useState<Assistant['rules']>(assistant.rules)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { actions } = useAssistants()
  
  const onUpdate = () => {
    if (!assistant) return
    actions.update({ ...assistant, rules: rules || '' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="h-full flex flex-col border rounded-lg bg-card shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Entrenamiento</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa prompts e instrucciones para entrenar al asistente
        </p>
      </div>

      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full rounded-md border px-3 py-2 text-sm resize-none"
          placeholder="Escribe aquí los prompts e instrucciones para entrenar al asistente..."
          value={rules}
          onChange={(e) => setRules(e.target.value)}
        />
      </div>

      <div className="p-4 border-t flex items-center justify-between gap-4">
        <div className="flex-1">
          {showSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2Icon className="size-4" />
              <span>Entrenamiento guardado exitosamente</span>
            </div>
          )}
        </div>
        <Button size="sm" onClick={onUpdate}>
          <SaveIcon className="size-4" />
          Guardar
        </Button>
      </div>
    </div>
  )
}
