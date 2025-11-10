import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { convertToUIMessages, fetcher, generateUUID } from '@/lib/utils';
import type { Chat as ChatType } from '@/lib/types';

const ChatPage = () => {
  const { id } = useParams<{ id?: string }>();
  const [chatId, setChatId] = useState<string>(id || '');

  // Generate a new chat ID if one doesn't exist
  useEffect(() => {
    if (!id) {
      setChatId(generateUUID());
    }
  }, [id]);

  // Fetch existing chat data if we have an ID
  const { data: chatData, isLoading } = useSWR<ChatType>(
    id ? `/api/chat/${id}` : null,
    fetcher,
    {
      onError: (error) => {
        console.error('Failed to fetch chat:', error);
      },
    }
  );

  // Show loading state while fetching data
  if (id && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  // Prepare chat data
  const initialMessages = chatData?.messages ? convertToUIMessages(chatData.messages) : [];
  const initialChatModel = chatData?.model || DEFAULT_CHAT_MODEL;
  const initialVisibilityType = (chatData?.visibility as 'private' | 'public') || 'private';
  const isReadonly = false;
  const autoResume = false;
  const initialLastContext = chatData?.lastContext || undefined;

  return (
    <>
      <Chat
        key={chatId}
        id={chatId}
        initialMessages={initialMessages}
        initialChatModel={initialChatModel}
        initialVisibilityType={initialVisibilityType}
        isReadonly={isReadonly}
        autoResume={autoResume}
        initialLastContext={initialLastContext}
      />
      <DataStreamHandler id={chatId} />
    </>
  );
};

export default ChatPage;
