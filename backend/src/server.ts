import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, resp: Response) => {
    resp.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend Express server listening on port ${port}`);
});
