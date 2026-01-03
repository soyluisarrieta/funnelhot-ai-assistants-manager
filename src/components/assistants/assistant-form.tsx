'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { LANGUAGES, TONES } from "@/constants/assistant-options"
import { AssistantFormData, assistantSchema } from "@/schemas/assistant.schema"
import { Assistant } from "@/types/assistant"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, ArrowRight, CheckIcon, LoaderIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

interface Props {
  defaultValues?: Assistant
  step: 1 | 2;
  onStepValue: (step: 1 | 2) => void
  onSubmit: (assistant: AssistantFormData) => void
  onCancel: () => void
}

const initialValues = {
  language: LANGUAGES[0],
  responseLength: { short: 34, medium: 33, long: 33 },
  audioEnabled: false,
}

const RESPONSE_LENGTH_PRESETS = {
  short: {
    title: 'Corta',
    description: 'Breves (1–2 frases)',
  },
  medium: {
    title: 'Media',
    description: 'Equilibradas (3–5 frases)',
  },
  long: {
    title: 'Larga',
    description: 'Detalladas y explicativas',
  },
}

export default function AssistantForm({ defaultValues, step, onStepValue, onSubmit, onCancel }: Props) {
  const [canShowErrors, setCanShowErrors] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? initialValues,
  })

  const nextStep = async () => {
    setCanShowErrors(true)

    const valid = await trigger(['name', 'language', 'tone'])
    if (valid) {
      onStepValue(2)
      setCanShowErrors(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

      {step === 1 && (
        <section className="space-y-4">
          <div>
            <label>Nombre</label>
            <Input {...register('name')} className="input" />
            {canShowErrors && errors.name && (
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
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <div className='space-y-4'>
            <div className='flex'>
              <div className='w-1/2 font-medium'>
                Logitudes de respuestas
              </div>

              <div className='grow space-y-1'>
                {(['short', 'medium', 'long'] as const).map(key => (
                  <div key={key} className="space-y-2 flex items-center justify-between">
                    <div>
                      <label className="font-medium">
                        {RESPONSE_LENGTH_PRESETS[key].title}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {RESPONSE_LENGTH_PRESETS[key].description}
                      </p>
                    </div>

                    <div className="relative flex items-center gap-2">
                      <Input
                        className='w-16'
                        type="number"
                        min={0}
                        max={100}
                        {...register(`responseLength.${key}`, {
                          valueAsNumber: true,
                        })}
                      />
                      <span className="text-xs text-muted-foreground pointer-events-none select-none">
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
        </section>
      )}

      {/* Footer */}
      <div className="flex justify-between">
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        {step === 1 && (
          <Button
            type="button"
            onClick={nextStep}
          >
            Siguiente
            <ArrowRight />
          </Button>
        )}

        {step === 2 && (
          <div className="flex gap-1">
            <Button
              variant='ghost'
              type="button"
              onClick={() => onStepValue(1)}
              disabled={isSubmitting}
            >
              <ArrowLeftIcon />
              Atrás
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? <LoaderIcon className='animate-spin' /> : <CheckIcon />}
              Guardar
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}
