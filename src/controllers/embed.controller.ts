import { loadPdf } from "../utils/pdf-parser";
import splitter from "../utils/text-splitter";
import { initVectorStore } from "../connections/vectorstore.connection";
import { v4 as uuidv4 } from 'uuid';
import { Request, RequestHandler, Response } from "express";
import { File as MulterFile } from "multer";
import fs from "fs";
import {openAiEmbedder} from "../ml-models/embedder.model";

interface CustomRequest extends Request {
    files: {
        pdf: MulterFile[];
    };
}
const embedPdfController: RequestHandler = async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;
    const fileId = "test2";
    try {
        const vectorStore = await initVectorStore(fileId,openAiEmbedder);
        if (!customReq?.files?.pdf)
            return res.status(400).json({
                msg: "No pdf file uploaded",
            });
        const pdfUrl = customReq?.files?.pdf[0].path;
        const docs = await loadPdf(pdfUrl);
        // console.log(fileId);

        const chunks = await splitter(docs);
        const embeds = await vectorStore.addDocuments(chunks);

        if (!embeds)
            return res.status(500).json({
                msg: "Failed to embed documents",
            });
        
        res.status(200).json({
            message: "Documents successfully embedded",
            count: docs.length,
            fileId,
        });

        fs.unlinkSync(pdfUrl);  // Delete the uploaded pdf file
    } catch (error) {
        console.error("Error in embedWebpageController:", error);
        res.status(500).json({
            msg: "Internal server error",
        });
    }
};

export { embedPdfController };
