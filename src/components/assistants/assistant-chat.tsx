"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, BotIcon, UserIcon, Trash2Icon } from "lucide-react"
import { CHAT_RESPONSES_MOCK } from "@/mocks/chat-responses.mock"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

const getSimulatedResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * CHAT_RESPONSES_MOCK.length)
  return CHAT_RESPONSES_MOCK[randomIndex]
}

const INITIAL_MESSAGE: Message = {
  id: "initial",
  text: "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
  sender: "bot",
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const reversedMessages = useMemo(() => {
    return [...messages].reverse()
  }, [messages])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    const delay = Math.floor(Math.random() * 1000) + 1000

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getSimulatedResponse(),
        sender: "bot",
      }
      setMessages((prev) => [...prev, botResponse])
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="w-full h-full flex flex-col shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BotIcon className="size-6" />
          </div>
          <h1 className="font-semibold text-lg">Prueba el asistente</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <Trash2Icon className="size-5" />
        </Button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 bg-secondary/20">
        {reversedMessages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-3", message.sender === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0",
                message.sender === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.sender === "user" ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-5 h-5" />}
            </div>
            <div
              className={cn(
                "max-w-1/2 rounded-2xl px-4 py-2",
                message.sender === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-card-foreground border"
              )}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            type="text"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="shrink-0"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <SendIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
