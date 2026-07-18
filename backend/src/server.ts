import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { checkDBConnection } from "./config/database.ts"

import { registerUser } from "./midddleware/authenticate.ts";
import cors from "cors";

// Step1 - check for database connection
await checkDBConnection();

// Step2 - create a server
const app: Express = express();
const port = process.env.SERVER_PORT;

// Step3 - enable cors for frontend to enable origins
let corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

// Step4 - register JSON body parser before routes/middleware
app.use(express.json());

app.use("/api/v1/auth/register", cors(corsOptions), (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    registerUser(req, res);
    next();
});



app.listen(port, () => {
    console.log(`Backend Express server listening on port ${port}`);
});
