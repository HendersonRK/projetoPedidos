import { Router, Request, Response } from "express";
import { TipoFrete } from "../model/tipofrete";

export const routeTipoFrete = Router()

//retorna os tipos de frete cadastrados no banco de dados
routeTipoFrete.get('/tipofrete', async (req: Request, res: Response): Promise<Response> => 
{
    let tiposFrete = await TipoFrete.listarTodos();    
    return res.status(200).json(tiposFrete);
});

//retorna um tipo de frete do bancdo de dados
routeTipoFrete.get('/tipofrete/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let tipoFrete = await TipoFrete.listaUmPorId(id)

    if (tipoFrete != null)
    {
        return res.status(200).json(tipoFrete)
    }

    let erro = {"codigo": id, "erro" : "Forma de pagamento não encontrada!"}
    return res.status(400).json(erro)
});

//grava tipo de frete no banco de dados
routeTipoFrete.post('/tipofrete', async (req: Request, res: Response): Promise<Response> => 
{
    let tipoFrete = new TipoFrete();
    tipoFrete.tipofrete = req.body.tipofrete;

    let erros : string[] = tipoFrete.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await tipoFrete.insert()
    
    if (tipoFrete.id_tipofrete)
    {
        return res.status(200).json(tipoFrete)
    }
    let erro = {"id_tipofrete": null, "erro" : "Erro ao inserir Tipo de Frete!"}
    return res.status(400).json(erro)
});

//deleta tipo de frete do banco de dados
routeTipoFrete.delete('/tipofrete/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let tipoFrete = await TipoFrete.listaUmPorId(id)
    await tipoFrete?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita tipo de frete
routeTipoFrete.put('/tipofrete/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let tipoFrete = await TipoFrete.listaUmPorId(id)
    
    if (tipoFrete == null)
    {
        let erro = {"id": id, "erro" : "Tipo de frete não encontrado!"}
        return res.status(400).json(erro)
    }

    tipoFrete.tipofrete = req.body.descricaotipofrete
        
    let erros : string[] = tipoFrete.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    tipoFrete.update()

    if (tipoFrete.id_tipofrete)
    {
        return res.status(200).json(tipoFrete);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Forma de Pagamento!"}
    return res.status(400).json(erro);
});