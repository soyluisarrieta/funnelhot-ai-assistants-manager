'use client'

import { useMemo, useState } from "react"
import AssistantModal from "@/components/assistants/assistant-modal"
import { Button } from "@/components/ui/button"
import { Assistant } from "@/types/assistant"
import { BrainCircuitIcon, LoaderIcon, PlusIcon } from "lucide-react"
import { useAssistants } from "@/hook/useAssistants"
import { Dialog, DialogFooter, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import AssistantsList from "@/components/assistants/assistants-list"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
      <header className="border-b border-border py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="size-6 text-primary" />
          <h1 className="text-2xl font-bold text-card-foreground">
            Asistentes IA de Funnelhot
          </h1>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary-app hover:bg-primary-app/70 text-primary"
        >
          <PlusIcon className="size-4" />
          Nuevo asistente
        </Button>
      </header>

      <main className="container mx-auto py-6">
        <AssistantsList
          assistants={reversedAssistants}
          onEdit={openEdit}
          onDelete={openDeleteDialog}
        />
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
