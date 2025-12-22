'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Sparkles,
    Send,
    X,
    Loader2,
    MessageSquare,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    ChevronUp
} from 'lucide-react';
import { getSmartInsights, isGeminiConfigured } from '@/lib/gemini/client';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickPrompts = [
    "How can I reduce my electricity bill?",
    "What is power factor and why is it important?",
    "Explain peak and off-peak tariffs",
    "Tips for managing demand charges",
];

export function AIInsightsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm BillOS AI, your smart electricity bill assistant. I can help you understand your bills, find savings opportunities, and optimize your energy consumption. How can I help you today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getSmartInsights(input.trim());
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I apologize, but I encountered an error. Please make sure your Gemini API key is configured correctly.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        inputRef.current?.focus();
    };

    if (!isGeminiConfigured()) {
        return (
            <>
                <button
                    className="ai-fab disabled"
                    title="Configure Gemini API key to enable AI insights"
                >
                    <Sparkles size={24} />
                </button>
                <style jsx>{`
                    .ai-fab {
                        position: fixed;
                        bottom: var(--space-6);
                        right: var(--space-6);
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 20px rgba(52, 114, 255, 0.4);
                        z-index: 1000;
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                `}</style>
            </>
        );
    }

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    className="ai-fab"
                    onClick={() => setIsOpen(true)}
                    title="AI Insights"
                >
                    <Sparkles size={24} />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="ai-panel">
                    {/* Header */}
                    <div className="panel-header">
                        <div className="header-title">
                            <Sparkles size={20} />
                            <span>BillOS AI</span>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="messages-container">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.role}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="message-avatar">
                                        <Sparkles size={14} />
                                    </div>
                                )}
                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-avatar">
                                    <Sparkles size={14} />
                                </div>
                                <div className="message-content loading">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 2 && (
                        <div className="quick-prompts">
                            {quickPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    className="quick-prompt"
                                    onClick={() => handleQuickPrompt(prompt)}
                                >
                                    <Lightbulb size={14} />
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form className="input-container" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            className="chat-input"
                            placeholder="Ask about your electricity bills..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!input.trim() || isLoading}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .ai-fab {
                    position: fixed;
                    bottom: var(--space-6);
                    right: var(--space-6);
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 20px rgba(52, 114, 255, 0.4);
                    z-index: 1000;
                    cursor: pointer;
                    transition: all var(--transition-base);
                    animation: pulse-glow 2s ease infinite;
                }

                .ai-fab:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 30px rgba(52, 114, 255, 0.6);
                }

                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 4px 20px rgba(52, 114, 255, 0.4); }
                    50% { box-shadow: 0 4px 30px rgba(52, 114, 255, 0.6); }
                }

                .ai-panel {
                    position: fixed;
                    bottom: var(--space-6);
                    right: var(--space-6);
                    width: 400px;
                    max-height: 600px;
                    background: var(--bg-secondary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    z-index: 1001;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.3s ease;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-4) var(--space-5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    background: linear-gradient(135deg, rgba(52, 114, 255, 0.1), rgba(139, 92, 246, 0.1));
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-weight: 600;
                    color: var(--color-neutral-50);
                }

                .header-title :global(svg) {
                    color: var(--color-primary-400);
                }

                .close-btn {
                    padding: var(--space-2);
                    color: var(--color-neutral-400);
                    border-radius: var(--radius-md);
                    transition: all var(--transition-base);
                }

                .close-btn:hover {
                    color: var(--color-neutral-100);
                    background: rgba(255, 255, 255, 0.05);
                }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--space-4);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    max-height: 350px;
                }

                .message {
                    display: flex;
                    gap: var(--space-3);
                }

                .message.user {
                    justify-content: flex-end;
                }

                .message-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .message-content {
                    max-width: 80%;
                    padding: var(--space-3) var(--space-4);
                    border-radius: var(--radius-lg);
                    font-size: var(--text-sm);
                    line-height: 1.5;
                }

                .message.assistant .message-content {
                    background: var(--bg-elevated);
                    color: var(--color-neutral-200);
                }

                .message.user .message-content {
                    background: var(--color-primary-500);
                    color: white;
                }

                .message-content.loading {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--color-neutral-400);
                }

                .quick-prompts {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                    padding: 0 var(--space-4) var(--space-4);
                }

                .quick-prompt {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-3);
                    background: rgba(52, 114, 255, 0.1);
                    border: 1px solid rgba(52, 114, 255, 0.2);
                    border-radius: var(--radius-full);
                    font-size: var(--text-xs);
                    color: var(--color-primary-300);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .quick-prompt:hover {
                    background: rgba(52, 114, 255, 0.2);
                    border-color: rgba(52, 114, 255, 0.4);
                }

                .input-container {
                    display: flex;
                    gap: var(--space-3);
                    padding: var(--space-4);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .chat-input {
                    flex: 1;
                    padding: var(--space-3) var(--space-4);
                    background: var(--bg-elevated);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    color: var(--color-neutral-100);
                    font-size: var(--text-sm);
                    outline: none;
                    transition: all var(--transition-base);
                }

                .chat-input:focus {
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px rgba(52, 114, 255, 0.2);
                }

                .chat-input::placeholder {
                    color: var(--color-neutral-500);
                }

                .send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-lg);
                    background: var(--color-primary-500);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-base);
                }

                .send-btn:hover:not(:disabled) {
                    background: var(--color-primary-600);
                }

                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 480px) {
                    .ai-panel {
                        width: calc(100% - var(--space-8));
                        right: var(--space-4);
                        bottom: var(--space-4);
                    }
                }
            `}</style>
        </>
    );
}
