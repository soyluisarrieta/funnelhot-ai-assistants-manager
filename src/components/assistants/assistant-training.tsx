"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SaveIcon, CheckCircle2Icon, BrainCircuitIcon } from "lucide-react"
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
    <div className="h-full flex flex-col border border-border rounded-lg bg-card shadow-sm">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <BrainCircuitIcon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Entrenamiento</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Ingresa prompts e instrucciones para entrenar al asistente
        </p>
      </div>

      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full rounded-md border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="Escribe aquí los prompts e instrucciones para entrenar al asistente..."
          value={rules}
          onChange={(e) => setRules(e.target.value)}
        />
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between gap-4 bg-muted/30">
        <div className="flex-1">
          {showSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2Icon className="size-4" />
              <span>Entrenamiento guardado exitosamente</span>
            </div>
          )}
        </div>
        <Button size="sm" onClick={onUpdate} className="bg-primary hover:bg-primary/90">
          <SaveIcon className="size-4" />
          Guardar
        </Button>
      </div>
    </div>
  )
}
