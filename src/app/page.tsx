'use client'

import AssistantModal from "@/components/assistants/assistant-modal"
import { Button } from "@/components/ui/button"
import { ASSISTANTS_MOCK } from "@/mocks/assistants.mock"
import { Assistant } from "@/types/assistant"
import { BrainCircuitIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | undefined>()

  const openCreate = () => {
    setSelectedAssistant(undefined)
    setModalOpen(true)
  }
  
  return (
    <>
      <header className="border-b py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Asistentes IA de Funnelhot
        </h1>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Nuevo asistente
        </Button>
      </header>

      <main className="container mx-auto py-4">
        <div className="grid grid-cols-4 gap-4">
          {ASSISTANTS_MOCK.map((assistant) => (
            <div key={assistant.id} className="border p-4 rounded-md">
              <h2 className="font-medium">{assistant.name}</h2>
              <div className="flex gap-1">
                <Button
                  variant='outline'
                  size='sm'
                >
                  <BrainCircuitIcon /> Entrenar
                </Button>

                <Button 
                  variant='outline'
                  size='icon-sm'
                >
                  <PencilIcon />
                </Button>

                <Button 
                  className="hover:bg-destructive/80!"
                  variant='outline'
                  size='icon-sm'
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AssistantModal
        assistant={selectedAssistant}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
