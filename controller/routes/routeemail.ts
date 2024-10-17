import { Router, Request, Response } from "express"
import { enviarEmail } from "../model/email"

export const routeEmail = Router()
//emails
routeEmail.get ('/email', async (req: Request, res: Response) =>
{
    res.json(await enviarEmail('henderson.kettermann@gmail.com'))
})
