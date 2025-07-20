
'use client';

import { Suspense } from 'react';
import { ChatInterface } from '@/components/ChatInterface';

function ChatPage() {
    return (
       <div className="flex flex-col h-[calc(100vh-4rem)]">
         <Suspense fallback={<div className="flex-grow flex items-center justify-center">Loading chat...</div>}>
            <ChatInterface />
        </Suspense>
       </div>
    );
}

export default ChatPage;
