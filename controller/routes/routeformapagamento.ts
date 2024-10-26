import { Router, Request, Response } from "express";
import { FormaPagamento } from "../model/formapagamento";

export const routeFormaPagamento = Router()

//retorna as formas de pagamentos cadastradas no banco de dados
routeFormaPagamento.get('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let formasPagamento = await FormaPagamento.listarTodas();    
    return res.status(200).json(formasPagamento);
});

//retorna uma forma de pagamento do bancdo de dados
routeFormaPagamento.get('/formapagamento/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let formaPagamento = await FormaPagamento.listaUmaPorId(id)

    if (formaPagamento != null)
    {
        return res.status(200).json(formaPagamento)
    }

    let erro = {"codigo": id, "erro" : "Forma de pagamento não encontrada!"}
    return res.status(400).json(erro)
});

//grava forma de pagamento no banco de dados
routeFormaPagamento.post('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let formaPagamento = new FormaPagamento();
    formaPagamento.descricaofrmpagamento = req.body.descricaofrmpagamento;
    let erros : string[] = formaPagamento.validate();

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await formaPagamento.insert();
    
    if (formaPagamento.id_frmpagamento)
    {
        return res.status(200).json(formaPagamento)
    }
    let erro = {"id_frmpagamento": null, "erro" : "Erro ao inserir Forma de Pagamento!"}
    return res.status(400).json(erro)
});

//deleta forma de pagamento do banco de dados
routeFormaPagamento.delete('/formapagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let formaPagamento = await FormaPagamento.listaUmaPorId(id)
    await formaPagamento?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita forma de pagamento
routeFormaPagamento.put('/formapagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let formaPagamento = await FormaPagamento.listaUmaPorId(id)
    
    if (formaPagamento == null)
    {
        let erro = {"id": id, "erro" : "Forma de Pagamento não encontrada!"}
        return res.status(400).json(erro)
    }

    formaPagamento.descricaofrmpagamento = req.body.descricaofrmpagamento
    
    let erros : string[] = formaPagamento.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    formaPagamento.update()

    if (formaPagamento.id_frmpagamento)
    {
        return res.status(200).json(formaPagamento);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Forma de Pagamento!"}
    return res.status(400).json(erro);
});

routeFormaPagamento.get('/formapagamento/buscapornome/:nome', async (req: Request, res: Response): Promise<Response> => 
{
    let nomeFormaPagamento = String(req.params.nome)
    let formaPagamento = await FormaPagamento.listaUmPorNome(nomeFormaPagamento)

    if (formaPagamento != null)
    {
        return res.status(200).json([formaPagamento])
    }

    let erro = {"Forma Pagamento": " ", "erro" : "Forma de pagamento não encontrada!"}
    return res.status(400).json(erro)
})