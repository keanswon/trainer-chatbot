'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import TextBox from './TextBox'

export default function ChatBot() {
  const [messages, setMessages] = useState<{role:string,content:string}[]>([
    { role: 'system', content: 'You are a helpful assistant.' }
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [messages])  

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages([...messages, userMsg])
    setInput('')
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg] })
    })
    const { completion } = await res.json()
    setMessages(ms => [...ms, { role: 'assistant', content: completion }])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6 max-h-100 overflow-auto scollbar-hide">
        <AnimatePresence>
          {messages.length === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-2 mb-10"
            >
              <div className="text-center space-y-2 mb-10">
                <h1>hey there</h1>
                <div className='text-gray-500 text-sm'>
                  <p>ask me anything about strength training or nutrition!</p>
                  <p>start chatting below to get started</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.slice(1).map((m, i) => (
          <div key={i} className={m.role==='user'?'text-right':'text-left'}>
            <div className={`inline-block px-3 py-1 rounded-lg max-w-lg ${m.role === 'user' ? 'bg-blue-500 text-white text-left' : 'bg-gray-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {/* This is what was missing - the actual element to scroll to */}
        <div ref={endRef} />
      </div>
      <div className="flex space-x-2 flex items-center max-w-lg mx-auto p-2">
        <TextBox
          className="w-full h-12 flex-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  )
}