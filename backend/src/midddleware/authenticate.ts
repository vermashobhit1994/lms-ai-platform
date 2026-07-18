import {
    type Request,
    type Response,
} from "express";


export function registerUser(req: Request, res: Response) {
    console.log("Register user called");
    // TODO: sanitization

    res.json({ message: "registered user called from middleware" })

}
