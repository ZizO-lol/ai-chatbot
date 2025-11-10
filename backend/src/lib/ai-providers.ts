import { createAzure } from "@ai-sdk/azure";
import { gateway } from "@ai-sdk/gateway";
import { customProvider } from "ai";

// Check if Azure credentials are provided
const hasAzureCredentials =
  process.env.AZURE_RESOURCE_NAME &&
  process.env.AZURE_API_KEY &&
  process.env.AZURE_API_VERSION;

// Create Azure provider instance if credentials are available
const azureInstance = hasAzureCredentials
  ? createAzure({
      resourceName: process.env.AZURE_RESOURCE_NAME!,
      apiKey: process.env.AZURE_API_KEY!,
      apiVersion: process.env.AZURE_API_VERSION!,
    })
  : null;

// Main provider with xAI models via gateway (default)
export const myProvider = customProvider({
  languageModels: {
    "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
    "title-model": gateway.languageModel("xai/grok-2-1212"),
    "artifact-model": gateway.languageModel("xai/grok-2-1212"),
  },
});

// Azure provider (optional, if Azure credentials are available)
export const azureProvider = azureInstance
  ? customProvider({
      languageModels: {
        "azure-gpt-4o": azureInstance("gpt-4o"),
        "azure-gpt-4o-mini": azureInstance("gpt-4o-mini"),
        "azure-gpt-35-turbo": azureInstance("gpt-35-turbo"),
      },
    })
  : null;

// Helper to get the appropriate model based on selection
export function getModel(selectedModel?: string) {
  // If Azure model is selected and available, use it
  if (selectedModel?.startsWith("azure-") && azureProvider) {
    return azureProvider.languageModel(selectedModel);
  }

  // Default to gateway models
  return myProvider.languageModel(selectedModel || "chat-model");
}
