import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            {id ? `Chat ${id}` : 'New Chat'}
          </h1>
          <p className="text-muted-foreground">
            Chat interface - to be fully implemented
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
