import Router from "express";
import {
    embedPdfController
} from "../controllers/embed.controller";
import {
    upload
} from "../middlewares/upload.middleware";

const embedRouter = Router();

embedRouter.post("/pdf", upload.fields([{
    name: 'pdf',
    maxCount: 1
}]), embedPdfController);

export default embedRouter;