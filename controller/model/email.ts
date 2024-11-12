import { Configuracoes } from "./configuracoes"
import * as nodemailer from 'nodemailer'

export async function enviarEmail(destinatario:string, bodyEmail:string) 
{
    let configuracaoEmail = Configuracoes.listarConfiguracoes()

    let emailConfig = {
        host: (await configuracaoEmail).hostname,
        port: (await configuracaoEmail).porta,
        auth: {
            user: (await configuracaoEmail).emailusername,
            pass: (await configuracaoEmail).emailpassword
        }
    }

    let mailOptions = {
        from: (await configuracaoEmail).emailretorno,
        to: destinatario,
        subject: 'Teste email com API e configurações no banco de dados!',
        html: bodyEmail
    }
    console.log(emailConfig)
    console.log(mailOptions)
    let transporter = nodemailer.createTransport(emailConfig)
    return await transporter.sendMail(mailOptions)
}