# Azure OpenAI Provider Configuration (Frontend)

This module provides Azure OpenAI integration for the AI Chatbot frontend.

## Setup

### 1. Environment Variables

For the frontend to use Azure OpenAI, add the following environment variables to your `.env.local` file:

```bash
# Frontend Azure OpenAI Configuration (Vite requires VITE_ prefix)
VITE_AZURE_RESOURCE_NAME=your-resource-name
VITE_AZURE_API_KEY=your-api-key
VITE_AZURE_API_VERSION=2024-10-21
```

**Important**: 
- Vite requires all environment variables to have the `VITE_` prefix to be exposed to the client
- Be cautious with API keys in the frontend - consider using a backend proxy for production

### 2. Security Considerations

**⚠️ Warning**: Exposing API keys in the frontend is not recommended for production use.

For production deployments:
1. Use the backend API as a proxy to Azure OpenAI
2. Implement rate limiting and authentication in the backend
3. Never commit API keys to version control
4. Consider using Azure AD authentication instead of API keys

## Usage

### Available Providers

The frontend provides two main providers:

#### 1. Default Provider (`myProvider`)
```typescript
import { myProvider } from '@/lib/ai/providers';

// Uses xAI Grok models by default
const result = await generateText({
  model: myProvider.languageModel('chat-model'),
  prompt: 'Your prompt here',
});
```

#### 2. Azure Provider (`azureProvider`)
```typescript
import { azureProvider } from '@/lib/ai/providers';

// Uses Azure OpenAI models
const result = await generateText({
  model: azureProvider.languageModel('azure-gpt-4o'),
  prompt: 'Your prompt here',
});
```

### Available Azure Models

The following Azure models are available in the chat interface:

1. **Azure GPT-4o** (`azure-gpt-4o`)
   - Advanced reasoning and generation
   - Best for complex tasks

2. **Azure GPT-4o Mini** (`azure-gpt-4o-mini`)
   - Faster, more efficient version
   - Good for simpler tasks

3. **Azure GPT-3.5 Turbo** (`azure-gpt-35-turbo`)
   - Fast and cost-effective
   - Good for basic chat

### Using in Components

```tsx
import { azureProvider } from '@/lib/ai/providers';
import { useChat } from '@ai-sdk/react';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    provider: azureProvider,
    model: 'azure-gpt-4o',
  });

  return (
    // Your chat UI here
  );
}
```

## Model Selection

Users can select between different models in the chat interface:
- The model list is defined in `src/lib/ai/models.ts`
- Azure models appear alongside xAI Grok models
- Model selection is persisted in user preferences

## Customization

### Adding New Azure Models

To add more Azure models, update two files:

1. **`src/lib/ai/providers.ts`** - Add the model to the provider:
```typescript
export const azureProvider = customProvider({
  languageModels: {
    "azure-gpt-4o": azureInstance("gpt-4o"),
    "azure-gpt-4o-mini": azureInstance("gpt-4o-mini"),
    "azure-gpt-35-turbo": azureInstance("gpt-35-turbo"),
    // Add your new model here:
    "azure-new-model": azureInstance("your-deployment-name"),
  },
});
```

2. **`src/lib/ai/models.ts`** - Add the model to the UI list:
```typescript
export const chatModels: ChatModel[] = [
  // ... existing models
  {
    id: "azure-new-model",
    name: "Azure New Model",
    description: "Description of your new model",
  },
];
```

### Changing Default Model

To change the default model, update `DEFAULT_CHAT_MODEL` in `src/lib/ai/models.ts`:

```typescript
export const DEFAULT_CHAT_MODEL: string = "azure-gpt-4o";
```

## Testing

For testing, the frontend automatically uses mock models when `PLAYWRIGHT` environment variable is set:

```typescript
const isTestEnvironment = import.meta.env.PLAYWRIGHT === 'True';
```

Mock models are defined in `src/lib/ai/models.mock.ts`.

## Learn More

- [AI SDK React Documentation](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
