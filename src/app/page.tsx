'use client'

import { useMemo, useState } from "react"
import AssistantModal from "@/components/assistants/assistant-modal"
import { Button } from "@/components/ui/button"
import { Assistant } from "@/types/assistant"
import { BrainCircuitIcon, GlobeIcon, LoaderIcon, PencilIcon, PlusIcon, TrashIcon, Volume2Icon } from "lucide-react"
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
      <header className="border-b border-border py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="size-6 text-primary" />
          <h1 className="text-2xl font-bold text-card-foreground">
            Asistentes IA de Funnelhot
          </h1>
        </div>
        <Button size="sm" onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <PlusIcon className="size-4" />
          Nuevo asistente
        </Button>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reversedAssistants.map((assistant) => (
            <div 
              key={assistant.id} 
              className="group border border-border rounded-lg bg-card p-5 hover:shadow-sm hover:scale-[1.03] transition-all"
            >
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-lg text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {assistant.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GlobeIcon className="size-3.5 text-primary/70 shrink-0" />
                      <span className="text-muted-foreground">{assistant.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Volume2Icon className="size-3.5 text-primary/70 shrink-0" />
                      <span className="text-muted-foreground">{assistant.tone}</span>
                    </div>
                    {assistant.audioEnabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="size-3.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <div className="size-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-primary">Audio habilitado</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    variant='default'
                    size='sm'
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/asistentes/${assistant.id}`)
                    }}
                  >
                    <BrainCircuitIcon className="size-4" />
                    Entrenar
                  </Button>

                  <Button 
                    variant='ghost'
                    size='icon-sm'
                    onClick={(e) => {
                      e.stopPropagation()
                      openEdit(assistant)
                    }}
                  >
                    <PencilIcon />
                  </Button>

                  <Button 
                    variant='ghost'
                    size='icon-sm'
                    className="hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteDialog(assistant)
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
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
