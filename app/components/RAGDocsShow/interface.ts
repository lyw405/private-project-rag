interface RAGDocument {
  id: string;
  content: string;
  similarity?: number;
}

interface RAGDocsShowProps {
  documents: RAGDocument[];
  trigger?: React.ReactNode;
}

export type { RAGDocsShowProps, RAGDocument };
