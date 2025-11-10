import type { Suggestion } from "@/lib/types";

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}): Promise<Suggestion[]> {
  // This should fetch suggestions from the backend API
  const response = await fetch(`/api/suggestions?documentId=${documentId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.suggestions || [];
}
