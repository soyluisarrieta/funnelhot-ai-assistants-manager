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
import { Controller, useForm, useWatch } from "react-hook-form"
import { cn } from "@/lib/utils"

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
    colorClass: 'bg-blue-500',
  },
  medium: {
    title: 'Media',
    description: 'Equilibradas (3–5 frases)',
    colorClass: 'bg-green-500',
  },
  long: {
    title: 'Larga',
    description: 'Detalladas y explicativas',
    colorClass: 'bg-purple-500',
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

  const responseLength = useWatch({
    control,
    name: 'responseLength',
  });
  
  const total =
    (responseLength?.short ?? 0) +
    (responseLength?.medium ?? 0) +
    (responseLength?.long ?? 0);

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
                        <span 
                          className={cn(
                            'size-1.5 inline-block rounded-full mb-0.5 mr-1.5',
                            RESPONSE_LENGTH_PRESETS[key].colorClass
                          )}
                        />
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
            
            <div className='space-y-1'>
              <div className="flex h-2 rounded overflow-hidden bg-muted">
                <div style={{ width: `${(responseLength?.short ?? 0)}%` }} className={RESPONSE_LENGTH_PRESETS.short.colorClass} />
                <div style={{ width: `${(responseLength?.medium ?? 0)}%` }} className={RESPONSE_LENGTH_PRESETS.medium.colorClass} />
                <div style={{ width: `${(responseLength?.long ?? 0)}%` }} className={RESPONSE_LENGTH_PRESETS.long.colorClass} />
              </div>
              
              <div className='flex justify-between text-muted-foreground text-xs'>
                <span>Ajusta cómo se distribuyen las respuestas según su longitud.</span>
                <span className={cn('', total !== 100 && 'text-red-500')}>
                  Total: {total}%
                </span>
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
