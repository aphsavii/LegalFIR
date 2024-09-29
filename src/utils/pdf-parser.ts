import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

const loadPdf = async (path: string): Promise<Document[]> => {
    const pdfFile = new PDFLoader(path);
    return await pdfFile.load();
}

export { loadPdf };