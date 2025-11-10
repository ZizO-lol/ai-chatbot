# Azure OpenAI Provider Configuration

This module provides Azure OpenAI integration for the AI Chatbot backend.

## Setup

### 1. Azure OpenAI Service Setup

First, you need to set up Azure OpenAI:

1. Create an Azure OpenAI resource in the [Azure Portal](https://portal.azure.com)
2. Deploy your models (e.g., gpt-4o, gpt-4o-mini, gpt-35-turbo)
3. Get your resource name and API key from the Azure Portal

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Azure OpenAI Configuration
AZURE_RESOURCE_NAME=your-resource-name
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-10-21
```

**Note**: The `AZURE_RESOURCE_NAME` is the name you gave your Azure OpenAI resource (not the full URL).

### 3. Model Deployment Names

Make sure your Azure OpenAI deployment names match those used in the code:
- `gpt-4o` - GPT-4o model
- `gpt-4o-mini` - GPT-4o Mini model
- `gpt-35-turbo` - GPT-3.5 Turbo model

If your deployment names differ, update the model IDs in `providers.ts`.

## Usage

### In Backend Routes

```typescript
import { getModel } from '../config/providers';

// Get a model based on the model ID
const model = getModel('azure-gpt-4o');

// Use with AI SDK
import { generateText } from 'ai';

const { text } = await generateText({
  model: model,
  prompt: 'Your prompt here',
});
```

### Direct Model Access

```typescript
import { azureModels, gatewayModels } from '../config/providers';

// Use Azure models directly
const response = await generateText({
  model: azureModels.gpt4o,
  prompt: 'Your prompt here',
});

// Or use gateway models (xAI)
const response = await generateText({
  model: gatewayModels.grokVision,
  prompt: 'Your prompt here',
});
```

## Automatic Fallback

The `getModel()` function automatically:
1. Uses Azure models if `AZURE_RESOURCE_NAME` and `AZURE_API_KEY` are configured
2. Falls back to gateway models (xAI) if Azure is not configured
3. This ensures backward compatibility

## Available Models

### Azure Models (when configured)
- `azure-gpt-4o` - Latest GPT-4o model
- `azure-gpt-4o-mini` - Smaller, faster GPT-4o variant
- `azure-gpt-35-turbo` - GPT-3.5 Turbo model

### Gateway Models (default)
- `chat-model` - Grok Vision (multimodal)
- `chat-model-reasoning` - Grok Mini (reasoning)
- Default fallback models for unknown IDs

## Troubleshooting

### "Resource not found" errors
- Verify your `AZURE_RESOURCE_NAME` is correct
- Check that your Azure OpenAI resource is active in Azure Portal

### "Model deployment not found" errors
- Ensure your deployment names match the ones in the code
- You can customize deployment names in `providers.ts`

### API Key issues
- Verify your `AZURE_API_KEY` is correct
- Check that the key has not expired in Azure Portal
- Ensure the key has appropriate permissions

## Learn More

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [AI SDK Azure Provider](https://ai-sdk.dev/providers/ai-sdk-providers/azure)
- [AI SDK Documentation](https://ai-sdk.dev/docs)
