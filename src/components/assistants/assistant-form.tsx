'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  onSubmit: (data: Record<string, string | boolean>) => void
  onCancel: () => void
}

export default function AssistantForm({ onSubmit, onCancel }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string | boolean>
    data.audioEnabled = formData.has('audioEnabled')
    onSubmit(data)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        <Input name="name" />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label>Idioma</label>
          <Input name="language" />
        </div>

        <div>
          <label>Tono</label>
          <Input name="tone" />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <div>
          <label>Corto</label>
          <Input name="short" />
        </div>
        <div>
          <label>Mediano</label>
          <Input name="medium" />
        </div>
        <div>
          <label>Largo</label>
          <Input name="large" />
        </div>
      </div>

      <label>
        <input name="audioEnabled" type="checkbox"/>
        Habilitar respuestas de audio
      </label>

      <div className="flex justify-between">
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
