import { Router, Request, Response } from "express"
import { enviarEmail } from "../model/email"

export const routeEmail = Router()
//emails
routeEmail.get ('/email/:endereco', async (req: Request, res: Response) =>
{
    let enderecoEmail = String(req.params.endereco)
    res.json(await enviarEmail(enderecoEmail))
})
