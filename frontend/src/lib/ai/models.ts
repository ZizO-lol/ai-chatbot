export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Grok Vision",
    description: "Advanced multimodal model with vision and text capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "Grok Reasoning",
    description:
      "Uses advanced chain-of-thought reasoning for complex problems",
  },
  {
    id: "azure-gpt-4o",
    name: "Azure GPT-4o",
    description:
      "Azure OpenAI's GPT-4o model for advanced reasoning and generation",
  },
  {
    id: "azure-gpt-4o-mini",
    name: "Azure GPT-4o Mini",
    description: "Smaller, faster version of GPT-4o via Azure OpenAI",
  },
  {
    id: "azure-gpt-35-turbo",
    name: "Azure GPT-3.5 Turbo",
    description: "Fast and efficient model via Azure OpenAI",
  },
];
