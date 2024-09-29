import { Router } from "express";

const queryRouter = Router();

// Import controller
import { queryController } from "../controllers/query.controller";

// Routes
queryRouter.post("/query", queryController);

export default queryRouter;