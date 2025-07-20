
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, User, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { format } from 'date-fns';

export function ChatInterface() {
    const searchParams = useSearchParams();
    const mechanicName = searchParams.get('name') || 'Mechanic';
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: `Hello! I see you're having some trouble. How can I help you today? Please describe the issue in detail.`,
                sender: 'mechanic',
                timestamp: format(new Date(), 'p'),
            }
        ]);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: format(new Date(), 'p'),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate mechanic's reply
        setTimeout(() => {
            const mechanicReply: ChatMessage = {
                id: Date.now() + 1,
                text: "Thank you for the information. I am reviewing the details. Please give me a moment. I will dispatch a team to your location shortly.",
                sender: 'mechanic',
                timestamp: format(new Date(), 'p'),
            };
            setMessages(prev => [...prev, mechanicReply]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-muted/40">
            <header className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback><Wrench className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-lg">{mechanicName}</h2>
                        <p className="text-sm text-green-500 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Online
                        </p>
                    </div>
                </div>
            </header>
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef as any}>
                 <div className="space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex items-end gap-3',
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.sender === 'mechanic' && (
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback><Wrench className="w-4 h-4" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm shadow',
                                    message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-background text-foreground rounded-bl-none'
                                )}
                            >
                                <p>{message.text}</p>
                                <p className={cn(
                                    'text-xs mt-2',
                                     message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                     )}>
                                    {message.timestamp}
                                </p>
                            </div>
                             {message.sender === 'user' && (
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
             <footer className="p-4 border-t bg-background">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button">
                        <Paperclip className="w-5 h-5" />
                         <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon">
                        <Send className="w-5 h-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </footer>
        </div>
    );
}
