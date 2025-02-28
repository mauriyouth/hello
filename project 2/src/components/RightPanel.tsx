import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Star, ExternalLink, Paperclip, Send, Loader2, AlertCircle } from 'lucide-react';
import { useChat } from 'ai/react';
import type { Section } from '../types';
import { ErrorBoundary } from './ErrorBoundary';

interface RightPanelProps {
  section: Section;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const RightPanel: React.FC<RightPanelProps> = ({ section }) => {
  const [files, setFiles] = React.useState<FileList | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const lastMessageTime = useRef<number>(0);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error: chatError,
  } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onError: (err) => {
      setError(err.message);
      if (err.message.includes('rate limit')) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastMessageTime.current < 1000) {
      setError('Please wait a moment before sending another message');
      return;
    }
    
    if (!input.trim() && !files) {
      setError('Please enter a message or attach a file');
      return;
    }

    lastMessageTime.current = now;
    setError(null);
    
    try {
      await handleSubmit(e);
      setFiles(null);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn h-full flex flex-col" role="complementary">
      {/* Section Title */}
      <div className="border-b border-gray-200 pb-4 group transition-all duration-300 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-primary-300 rounded mr-3"></div>
          <h2 className="text-xl font-semibold text-primary-500 group-hover:text-primary-400 transition-colors">
            {section.title}
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-1 ml-4">
          Last modified by {section.modifiedBy} on {format(section.lastModified, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="transition-all duration-300 ease-in-out flex-shrink-0">
        <h3 className="text-lg font-medium text-primary-400 mb-4 flex items-center">
          <div className="w-1 h-6 bg-primary-200 rounded mr-3"></div>
          Reviews
        </h3>
        <div className="space-y-4">
          {section.reviews?.map((review) => (
            <div 
              key={review.id} 
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`transition-colors duration-300 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {format(review.timestamp, 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-primary-400 mt-2">{review.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources Section */}
      <div className="transition-all duration-300 ease-in-out flex-shrink-0">
        <h3 className="text-lg font-medium text-primary-400 mb-4 flex items-center">
          <div className="w-1 h-6 bg-primary-200 rounded mr-3"></div>
          Sources & References
        </h3>
        <div className="space-y-3">
          {section.sources.map((source, index) => (
            <div
              key={index}
              className="group hover:bg-primary-100/10 p-3 rounded-lg transition-all duration-300 hover:shadow-sm"
            >
              <div className="flex items-start">
                <ExternalLink 
                  size={18} 
                  className="text-primary-300 mt-1 mr-2 flex-shrink-0 group-hover:text-primary-400 transition-colors" 
                />
                <div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
                  >
                    {source.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
                    {source.citation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="flex-grow flex flex-col min-h-0">
        <h3 className="text-lg font-medium text-primary-400 mb-4 flex items-center flex-shrink-0">
          <div className="w-1 h-6 bg-primary-200 rounded mr-3"></div>
          AI Assistant
        </h3>
        
        <ErrorBoundary>
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary-300 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-300" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {(error || chatError) && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{error || 'An error occurred. Please try again.'}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex-shrink-0">
            <div className="relative flex items-end border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={isRateLimited ? 'Please wait before sending another message...' : 'Type your message...'}
                disabled={isRateLimited || isLoading}
                className="min-h-[60px] max-h-[200px] w-full resize-none px-4 py-3 pr-20 rounded-xl focus:outline-none focus:ring-0 focus:border-primary-300 text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ scrollbarWidth: 'none' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }
                }}
                aria-label="Message input"
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <label className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isRateLimited || isLoading}
                    aria-label="Attach files"
                  />
                  <Paperclip 
                    size={20} 
                    className={`${
                      isRateLimited || isLoading 
                        ? 'text-gray-300' 
                        : 'text-gray-400 hover:text-primary-400'
                    }`} 
                  />
                </label>
                <button
                  type="submit"
                  className={`p-2 rounded-lg transition-colors ${
                    isRateLimited || isLoading || (!input.trim() && !files)
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-primary-300 hover:bg-primary-400'
                  }`}
                  disabled={isRateLimited || isLoading || (!input.trim() && !files)}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <Send size={20} className="text-white" />
                  )}
                </button>
              </div>
            </div>
            
            {files && files.length > 0 && (
              <div className="mt-2 space-y-2">
                {Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"
                  >
                    <Paperclip size={16} className="text-primary-300" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </ErrorBoundary>
      </div>
    </div>
  );
};