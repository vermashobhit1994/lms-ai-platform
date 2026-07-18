import {
    type Request,
    type Response,
} from "express";


export async function registerUser(req: Request, res: Response) {
    console.log("Register user called");
    // TODO: sanitization and validation

    res.json({ message: "registered user called from middleware" })

    // TODO: convert password to hash


    // TODO: save user profile data to database
}
