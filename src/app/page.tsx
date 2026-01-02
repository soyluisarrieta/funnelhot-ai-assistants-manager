'use client'

import { useMemo, useState } from "react"
import AssistantModal from "@/components/assistants/assistant-modal"
import { Button } from "@/components/ui/button"
import { Assistant } from "@/types/assistant"
import { BrainCircuitIcon, LoaderIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { useAssistants } from "@/hook/useAssistants"
import { Dialog, DialogFooter, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const router = useRouter();

  const {
    assistants,
    actions
  } = useAssistants()

  const reversedAssistants = useMemo(() => {
    return [...assistants].reverse()
  }, [assistants])

  const openCreate = () => {
    setSelectedAssistant(undefined)
    setModalOpen(true)
  }

  const openEdit = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setModalOpen(true);
  }

  const openDeleteDialog = (assistant: Assistant) => {
    setSelectedAssistant(assistant)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedAssistant) return
    
    try {
      setIsDeleting(true)
      await actions.remove(selectedAssistant.id)
      setDeleteDialogOpen(false)
      setSelectedAssistant(undefined)
    } catch (error) {
      console.error('Error al eliminar asistente:', error)
    } finally {
      setIsDeleting(false)
    }
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
          {reversedAssistants.map((assistant) => (
            <div key={assistant.id} className="border p-4 rounded-md">
              <h2 className="font-medium">{assistant.name}</h2>
              <div className="flex gap-1">
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push(`/asistentes/${assistant.id}`)}
                >
                  <BrainCircuitIcon /> Entrenar
                </Button>

                <Button 
                  variant='outline'
                  size='icon-sm'
                  onClick={() => openEdit(assistant)}
                >
                  <PencilIcon />
                </Button>

                <Button 
                  className="hover:bg-destructive/80!"
                  variant='outline'
                  size='icon-sm'
                  onClick={() => openDeleteDialog(assistant)}
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
        onCreate={actions.create}
        onUpdate={actions.update}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>¿Estás seguro de que deseas eliminar este asistente?</DialogTitle>
          <DialogDescription>Esta acción es permanente y no se puede deshacer.</DialogDescription>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isDeleting}>
                Cancelar
              </Button>
            </DialogClose>

            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar asistente'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
