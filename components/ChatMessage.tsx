
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ModelIcon: React.FC = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14.05 5.02 16 7.24 16 10c0 .333 0 .667-.02 1-.393 4.28-4.5 4.5-4.5 4.5s.22 4.107 4.5 4.5c.013.333.02.667.02 1 .001 2.76-1.95 4.98-4.014 6.986C12.5 21.5 12 19 12 17c2-1 2.657-1.343 2.657-1.343a8 8 0 013 3z" />
  </svg>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-gemini-user text-white rounded-2xl rounded-tr-none'
    : 'bg-gemini-model text-gray-200 rounded-2xl rounded-tl-none';
  
  const iconBg = isUser ? 'bg-gemini-user' : 'bg-gemini-model';
  
  return (
    <div className={`${wrapperClasses} animate-fade-in`}>
      <div className={`flex items-start space-x-3 max-w-xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          {isUser ? <UserIcon /> : <ModelIcon />}
        </div>
        <div className={`${bubbleClasses} p-4 shadow-md`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
