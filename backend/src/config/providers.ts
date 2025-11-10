import { createAzure } from '@ai-sdk/azure';
import { gateway } from '@ai-sdk/gateway';

/**
 * Azure OpenAI Provider Configuration
 * Requires environment variables:
 * - AZURE_RESOURCE_NAME: Your Azure OpenAI resource name
 * - AZURE_API_KEY: Your Azure OpenAI API key
 * - AZURE_API_VERSION: API version (optional, defaults to latest)
 */
export const azureProvider = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME,
  apiKey: process.env.AZURE_API_KEY,
  apiVersion: process.env.AZURE_API_VERSION,
});

/**
 * Gateway Provider Configuration
 * Uses Vercel AI Gateway for routing
 */
export const gatewayProvider = gateway;

/**
 * Available Azure Models
 * These should match your Azure OpenAI deployment names
 */
export const azureModels = {
  gpt4o: azureProvider('gpt-4o'),
  gpt4oMini: azureProvider('gpt-4o-mini'),
  gpt35Turbo: azureProvider('gpt-35-turbo'),
};

/**
 * Available Gateway Models (xAI via Gateway)
 */
export const gatewayModels = {
  grokVision: gateway.languageModel('xai/grok-2-vision-1212'),
  grokMini: gateway.languageModel('xai/grok-3-mini'),
  grokStandard: gateway.languageModel('xai/grok-2-1212'),
};

/**
 * Get the appropriate model based on configuration
 * Defaults to gateway models for backward compatibility
 */
export function getModel(modelId: string) {
  // Check if Azure is configured
  const useAzure = process.env.AZURE_RESOURCE_NAME && process.env.AZURE_API_KEY;
  
  if (useAzure) {
    // Map to Azure models if available
    switch (modelId) {
      case 'chat-model':
      case 'azure-gpt-4o':
        return azureModels.gpt4o;
      case 'azure-gpt-4o-mini':
        return azureModels.gpt4oMini;
      case 'azure-gpt-35-turbo':
        return azureModels.gpt35Turbo;
      default:
        // Fall back to gateway for unknown models
        return gatewayModels.grokStandard;
    }
  }
  
  // Default to gateway models
  switch (modelId) {
    case 'chat-model':
      return gatewayModels.grokVision;
    case 'chat-model-reasoning':
      return gatewayModels.grokMini;
    default:
      return gatewayModels.grokStandard;
  }
}
