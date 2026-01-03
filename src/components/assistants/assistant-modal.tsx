'use client'

import { useState } from "react"
import AssistantForm from "@/components/assistants/assistant-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AssistantFormData } from "@/schemas/assistant.schema"
import { Assistant } from "@/types/assistant"
import { CheckIcon } from "lucide-react"

interface Props {
  assistant?: Assistant
  open: boolean
  onClose: () => void
  onCreate: (assistant: Assistant) => Promise<void>
  onUpdate: (assistant: Assistant) => Promise<void>
}

export default function AssistantModal({ assistant, open, onClose, onCreate, onUpdate }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  
  const handleCloseDialog = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
    }, 200);
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

        {/* Step indicators */}
        <div className="flex items-center gap-4 pb-4">
          <div 
            className={cn(
              "grow flex flex-1 flex-col sm:flex-row items-center gap-3 text-center sm:text-left cursor-pointer",
              step > 1 && 'opacity-60 hover:opacity-100 transition-opacity'
            )}
            onClick={() => step > 1 && setStep(1)}
          >
            <div
              className={cn(
                "flex size-9 aspect-square items-center justify-center rounded-full border-2 font-semibold transition-colors",
                step === 1
                  ? "border-primary-app bg-primary-app text-primary"
                  : "border-muted bg-muted text-muted-foreground",
              )}
            >
              {step > 1 ? <CheckIcon className="size-5" /> : "1"}
            </div>
            <div className="min-w-fit flex flex-col whitespace-nowrap">
              <span className="text-sm font-medium">Datos básicos</span>
              <span className="text-xs text-muted-foreground">Identidad y personalidad</span>
            </div>
          </div>

          <div className={cn("h-px grow bg-border mx-2")} />

          <div 
            className={cn(
              "flex flex-1 flex-col sm:flex-row items-center gap-3 text-center sm:text-left cursor-pointer",
              step === 1 && 'opacity-60',

            )}
          >
            <div
              className={cn(
                "flex size-9 aspect-square items-center justify-center rounded-full border-2 font-semibold transition-colors",
                step === 2
                  ? "border-primary-app bg-primary-app text-primary"
                  : "border-muted bg-muted text-muted-foreground",
              )}
            >
              2
            </div>
            <div className="min-w-fit flex flex-col whitespace-nowrap">
              <span className="text-sm font-medium">Configuración de respuesta</span>
              <span className="text-xs text-muted-foreground">Longitud y preferencias</span>
            </div>
          </div>
        </div>

        <AssistantForm
          defaultValues={assistant}
          step={step}
          onStepValue={setStep}
          onSubmit={handleOnSubmit}
          onCancel={handleCloseDialog}
        />
        
      </DialogContent>
    </Dialog>
  )
}
