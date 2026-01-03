'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { LANGUAGES, TONES } from "@/constants/assistant-options"
import { AssistantFormData, assistantSchema } from "@/schemas/assistant.schema"
import { Assistant } from "@/types/assistant"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

interface Props {
  defaultValues?: Assistant
  onSubmit: (assistant: AssistantFormData) => void
  onCancel: () => void
}

const initialValues = {
  language: LANGUAGES[0],
  responseLength: { short: 34, medium: 33, long: 33 },
  audioEnabled: false,
}

export default function AssistantForm({ defaultValues, onSubmit, onCancel }: Props) {

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? initialValues,
  })
  
  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nombre</label>
        <Input {...register('name')} />
        {errors.name && (
          <p className="error text-sm text-muted-foreground">{errors.name.message}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label>Idioma</label>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
          
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            
            {errors.language && (
              <p className="error text-sm text-muted-foreground">{errors.language.message}</p>
            )}
        </div>

        <div>
          <label>Tono</label>
            <Controller
              control={control}
              name="tone"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {TONES.map(tone => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            
            {errors.tone && (
              <p className="error text-sm text-muted-foreground">{errors.tone.message}</p>
            )}
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <div>
          <label>Corto</label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register('responseLength.short', {valueAsNumber: true})}
          />
        </div>
        <div>
          <label>Mediano</label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register('responseLength.medium', {valueAsNumber: true})}
          />
        </div>
        <div>
          <label>Largo</label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register('responseLength.long', {valueAsNumber: true})}
          />
        </div>
      </div>

      <Controller
        control={control}
        name="audioEnabled"
        render={({ field }) => (
          <label className="font-medium flex items-center gap-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            Habilitar respuestas de audio
          </label>
        )}
      />

      <div className="flex justify-between">
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
