import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
    separators: ["\n\n", "\n", " ", ""]
});

const splitter: (docs: Document[]) => Promise<Document[]> = async (docs: Document[]) => {
    const documents = docs.map(doc => new Document({ pageContent: doc.pageContent, metadata: doc.metadata, id: doc.id }));
    return await textSplitter.splitDocuments(documents);
};

export default splitter;