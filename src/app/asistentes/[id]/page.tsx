'use client'

import { getAssistantById } from "@/services/assistants.service";
import { Assistant } from "@/types/assistant";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function TrainingPage() {
  const { id } = useParams<{ id: string }>()
  const [assistant, setAssistant] = useState<Assistant | null>(null)

  useEffect(() => {
    const loadAssistant = async () => {
      const data = await getAssistantById(id)
      setAssistant(data)
    }
    loadAssistant()
  }, [id])

  return (
    <>
      <code>{JSON.stringify(assistant)}</code>
    </>
  )
}
