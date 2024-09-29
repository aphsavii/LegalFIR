import { Request, Response, RequestHandler } from 'express';
import retrieve from '../utils/retriever';
const queryController: RequestHandler = async (req: Request, res: Response) => {
    let headersSent = false;

    try {
        const { query, fileId } = req.body;

        // Set headers for streaming
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        headersSent = true;

        // Stream the response
        for await (const chunk of retrieve(query, fileId)) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        // End the response
        res.write('event: end\ndata: \n\n');
        res.end();
    } catch (error) {
        console.error('Error in queryController:', error);

        if (!headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: error.message
            }));
        } else {
            // If headers were already sent, we can only end the response
            res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
};

export { queryController };