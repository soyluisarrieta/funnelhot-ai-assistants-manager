'use client'

import AssistantForm from "@/components/assistants/assistant-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AssistantFormData } from "@/schemas/assistant.schema"
import { Assistant } from "@/types/assistant"

interface Props {
  assistant?: Assistant
  open: boolean
  onClose: () => void
  onCreate: (assistant: Assistant) => Promise<void>
  onUpdate: (assistant: Assistant) => Promise<void>
}

export default function AssistantModal({ assistant, open, onClose, onCreate, onUpdate }: Props) {
  
  const handleCloseDialog = () => {
    onClose()
  }

  const handleOnSubmit = async (formData: AssistantFormData) => {
    const assistantData: Assistant = {
      ...formData,
      id: assistant?.id ?? crypto.randomUUID(),
      rules: assistant?.rules ?? '',
    }
    
    if (assistant) { 
      await onUpdate(assistantData) 
    } else { 
      await onCreate(assistantData)
    }

    handleCloseDialog()
  }
  
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className={cn("sm:max-w-[600px]", !open && 'pointer-events-auto select-none')}>
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle className="text-2xl">
            {!assistant ? 'Crear' : 'Editar'} asistente IA
          </DialogTitle>
          <DialogDescription>
            Completa los pasos para crear el asistente.
          </DialogDescription>
        </DialogHeader>

        <AssistantForm
          defaultValues={assistant}
          onSubmit={handleOnSubmit}
          onCancel={handleCloseDialog}
        />
        
      </DialogContent>
    </Dialog>
  )
}
