import { gateway } from "@ai-sdk/gateway";
import { createAzure } from "@ai-sdk/azure";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Create Azure provider instance (will use env vars at runtime)
const azureInstance = createAzure({
  resourceName: import.meta.env.VITE_AZURE_RESOURCE_NAME,
  apiKey: import.meta.env.VITE_AZURE_API_KEY,
  apiVersion: import.meta.env.VITE_AZURE_API_VERSION,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
        "chat-model-reasoning": wrapLanguageModel({
          model: gateway.languageModel("xai/grok-3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": gateway.languageModel("xai/grok-2-1212"),
        "artifact-model": gateway.languageModel("xai/grok-2-1212"),
      },
    });

// Azure provider for Azure OpenAI models
export const azureProvider = customProvider({
  languageModels: {
    "azure-gpt-4o": azureInstance("gpt-4o"),
    "azure-gpt-4o-mini": azureInstance("gpt-4o-mini"),
    "azure-gpt-35-turbo": azureInstance("gpt-35-turbo"),
  },
});
