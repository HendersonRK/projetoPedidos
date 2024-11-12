import { Router, Request, Response } from "express";
import { Configuracoes } from "../model/configuracoes";

export const routeConfiguracao = Router()

//ROTAS DE CONFIGURAÇÕES
//busca as configurações de email no banco de dados
routeConfiguracao.get('/configuracoes/email', async (req:Request, res:Response): Promise<Response> =>
{
    let configuracoes = await Configuracoes.listarConfiguracoes()
    return res.status(200).json(configuracoes);
})

//edita as configurações de email no banco de dados
routeConfiguracao.put('/configuracoes/email', async (req:Request, res:Response) =>
{
    let configuracao = await Configuracoes.listarConfiguracoes()
        
    if (configuracao == null)
    {
        let erro = {"Configuracao": '', "erro" : "Contate o administrador do sistema, erro ao importar configurações do sistema!"}
        return res.status(400).json(erro)
    }

    configuracao.hostname = req.body.hostname
    configuracao.porta = req.body.porta
    configuracao.emailusername = req.body.emailusername
    configuracao.emailpassword = req.body.emailpassword
    configuracao.emailretorno = req.body.emailretorno

    configuracao.update();

    if (configuracao.id_configuracao)
    {
        return res.status(200).json(configuracao);
    }
    
    let erro = {"id" : 1, "erro" : "Erro ao editar Configuração, contate o suporte!"}
    return res.status(400).json(erro);
}) 