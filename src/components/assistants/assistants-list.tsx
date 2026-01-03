import { Button } from "@/components/ui/button"
import { Assistant } from "@/types/assistant"
import { BrainCircuitIcon, GlobeIcon, PencilIcon, TrashIcon, Volume2Icon } from "lucide-react"
import { useRouter } from "next/navigation";

interface Props {
  assistants: Assistant[]
  onEdit: (assistant: Assistant) => void
  onDelete: (assistant: Assistant) => void
}

export default function AssistantsList({ assistants, onEdit, onDelete }: Props) {
  const router = useRouter();

  if (!assistants.length) return <p>No hay asistentes todavía. Crea el primero para comenzar.</p>
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assistants.map((assistant) => (
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
                  onEdit(assistant)
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
                  onDelete(assistant)
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
