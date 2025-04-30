'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from './button';
import { Input } from './input';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">FAQ Assistant</h2>
      
      <div className="h-[400px] overflow-y-auto mb-4 p-4 border rounded-md">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Ask me anything about our services!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg ${
                  m.role === 'user' 
                    ? 'bg-blue-100 ml-auto max-w-[80%]' 
                    : 'bg-gray-100 max-w-[80%]'
                }`}
              >
                <p className="text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
    </div>
  );
} 