'use client'

import AssistantChat from "@/components/assistants/assistant-chat"
import AssistantTraining from "@/components/assistants/assistant-training"
import { getAssistantById } from "@/services/assistants.service"
import { Assistant } from "@/types/assistant"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, BrainCircuitIcon, GlobeIcon, MicIcon, MicOffIcon, Volume2Icon } from "lucide-react"

export default function TrainingPage() {
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

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

  if (isLoading) return (
    <div className="flex items-center justify-center h-dvh">
      <p className="text-muted-foreground">Cargando información...</p>
    </div>
  )
  if (!assistant) return (
    <div className="flex items-center justify-center h-dvh">
      <p className="text-muted-foreground">Asistente no encontrado</p>
    </div>
  )

  return (
    <div className="flex flex-col h-dvh">
      <header>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <h1 className="text-2xl font-bold">{assistant.name}</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              <GlobeIcon className="size-4 text-primary mx-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Idioma</span>
                <span className="font-medium text-card-foreground">{assistant.language}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              <Volume2Icon className="size-4 text-primary mx-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Tono</span>
                <span className="font-medium text-card-foreground">{assistant.tone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              {assistant.audioEnabled ? (
                <MicIcon className="size-4 text-primary mx-2" />
              ) : (
                <MicOffIcon className="size-4 text-muted-foreground mx-2" />
              )}
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Audio</span>
                <span className="font-medium text-card-foreground">
                  {assistant.audioEnabled ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              <BrainCircuitIcon className="size-4 text-primary mx-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Respuestas</span>
                <span className="font-medium text-card-foreground">
                  {assistant.responseLength.short}% / {assistant.responseLength.medium}% / {assistant.responseLength.long}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 md:gap-1">
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
