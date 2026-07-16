import express, { type Express, type Request, type Response } from 'express';
import { checkDBConnection } from "./config/database.ts"

// Step1 - check for database connection
await checkDBConnection();

// Step2 - create a server
const app: Express = express();
const port = process.env.SERVER_PORT;

app.get('/', (req: Request, resp: Response) => {
    resp.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend Express server listening on port ${port}`);
});
