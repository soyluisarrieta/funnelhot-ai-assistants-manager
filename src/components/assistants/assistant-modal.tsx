'use client'

import AssistantForm from "@/components/assistants/assistant-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Assistant } from "@/types/assistant"

interface Props {
  assistant?: Assistant
  open: boolean
  onClose: () => void
}

export default function AssistantModal({ assistant, open, onClose }: Props) {
  
  const handleCloseDialog = () => {
    onClose()
  }

  const handleOnSubmit = (formData: Record<string, string | boolean>) => {
    console.log(formData);
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
          onSubmit={handleOnSubmit}
          onCancel={handleCloseDialog}
        />
        
      </DialogContent>
    </Dialog>
  )
}
