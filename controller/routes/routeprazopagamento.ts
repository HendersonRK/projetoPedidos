import { Router, Request, Response } from "express";
import { PrazoPagamento } from "../model/prazopagamento";

export const routePrazoPagamento = Router()

//retorna os prazos de pagamentos cadastradas no banco de dados
routePrazoPagamento.get('/prazopagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let prazosPagamento = await PrazoPagamento.listarTodos();    
    return res.status(200).json(prazosPagamento);
});

//retorna um prazo de pagamento do bancdo de dados
routePrazoPagamento.get('/prazopagamento/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let prazoPagamento = await PrazoPagamento.listaUmPorId(id)

    if (prazoPagamento != null)
    {
        return res.status(200).json(prazoPagamento)
    }

    let erro = {"codigo": id, "erro" : "Forma de pagamento não encontrada!"}
    return res.status(400).json(erro)
});

//grava prazo de pagamento no banco de dados
routePrazoPagamento.post('/prazopagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let prazoPagamento = new PrazoPagamento();
    prazoPagamento.prazopagamento = req.body.descricaoprazopagamento
    let erros : string[] = prazoPagamento.validate();

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await prazoPagamento.insert();
    
    if (prazoPagamento.id_prazopagamento)
    {
        return res.status(200).json(prazoPagamento)
    }
    let erro = {"id_prazopagamento": null, "erro" : "Erro ao inserir Prazo de Pagamento!"}
    return res.status(400).json(erro)
});

//deleta prazo de pagamento do banco de dados
routePrazoPagamento.delete('/prazopagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let prazoPagamento = await PrazoPagamento.listaUmPorId(id)
    await prazoPagamento?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita prazo de pagamento
routePrazoPagamento.put('/prazopagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let prazoPagamento = await PrazoPagamento.listaUmPorId(id)
    
    if (prazoPagamento == null)
    {
        let erro = {"id": id, "erro" : "Prazo de Pagamento não encontrado!"}
        return res.status(400).json(erro)
    }

    prazoPagamento.prazopagamento = req.body.descricaoprazopagamento
    
    let erros : string[] = prazoPagamento.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    prazoPagamento.update()

    if (prazoPagamento.id_prazopagamento)
    {
        return res.status(200).json(prazoPagamento);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Forma de Pagamento!"}
    return res.status(400).json(erro);
});