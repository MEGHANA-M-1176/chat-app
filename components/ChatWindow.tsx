
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role } from '../types';
import MessageInput from './MessageInput';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: Role.MODEL, text: "Hello! I'm Gemini. How can I assist you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'You are a friendly and helpful AI assistant named Gemini.',
          },
        });
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
        setMessages((prev) => [
          ...prev,
          { role: Role.MODEL, text: 'Error: Could not initialize AI. Please check your API key and refresh.' },
        ]);
      }
    };
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (isLoading || !inputText.trim() || !chatRef.current) return;

    const userMessage: Message = { role: Role.USER, text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: inputText });
      let modelResponse = '';
      setMessages((prev) => [...prev, { role: Role.MODEL, text: '' }]);
      
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === Role.MODEL) {
            lastMessage.text = modelResponse;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Sorry, something went wrong. Please try again.';
       setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === Role.MODEL && lastMessage.text === '') {
            lastMessage.text = errorMessage;
          } else {
             newMessages.push({ role: Role.MODEL, text: errorMessage });
          }
          return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === Role.USER && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gemini-model rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14.05 5.02 16 7.24 16 10c0 .333 0 .667-.02 1-.393 4.28-4.5 4.5-4.5 4.5s.22 4.107 4.5 4.5c.013.333.02.667.02 1 .001 2.76-1.95 4.98-4.014 6.986C12.5 21.5 12 19 12 17c2-1 2.657-1.343 2.657-1.343a8 8 0 013 3z" /></svg>
                </div>
                <div className="bg-gemini-model rounded-2xl p-4 max-w-lg shadow-md">
                   <LoadingSpinner />
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 bg-gemini-dark border-t border-gemini-grey">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
