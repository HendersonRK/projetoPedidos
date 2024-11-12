import { Router, Request, Response } from "express";
import { Pedido } from "../model/pedidos";

export const routePedido = Router()

//retorna os pedidos cadastradas no banco de dados
routePedido.get('/pedido', async (req: Request, res: Response): Promise<Response> => 
{
    let pedido = await Pedido.listarTodos() 
    return res.status(200).json(pedido);
});

//retorna um pedido do bancdo de dados
routePedido.get('/pedido/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let pedido = await Pedido.listaUmPorId(id)

    if (pedido != null)
    {
        return res.status(200).json(pedido)
    }

    let erro = {"codigo": id, "erro" : "Pedido não encontrada!"}
    return res.status(400).json(erro)
});

//grava pedido no banco de dados
routePedido.post('/pedido', async (req: Request, res: Response): Promise<Response> => 
{
    let pedido = new Pedido();
    pedido.datapedido = req.body.datapedido
    pedido.situacao = req.body.situacaopedido
    pedido.observacoes = req.body.observacaopedido
    pedido.id_formapagamento = req.body.id_formapagamento
    pedido.id_prazopagamento = req.body.id_prazopagamento
    pedido.id_cliente = req.body.id_cliente
    pedido.id_tipofrete = req.body.id_tipofrete

    /*let erros : string[] = formaPagamento.validate();

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }*/

    await pedido.insert();

    if (pedido.id_pedido)
    {
        return res.status(200).json(pedido)
    }

    let erro = {"id_pedido": null, "erro" : "Erro ao inserir Pedido!"}
    return res.status(400).json(erro)
});

//deleta pedido do banco de dados
routePedido.delete('/pedido/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let pedido = await Pedido.listaUmPorId(id)
    await pedido?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita pedido
routePedido.put('/pedido/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let pedido = await Pedido.listaUmPorId(id)
    
    if (pedido == null)
    {
        let erro = {"id": id, "erro" : "Pedido não encontrado!"}
        return res.status(400).json(erro)
    }

    pedido.datapedido = req.body.datapedido
    pedido.situacao = req.body.situacaopedido
    pedido.observacoes = req.body.observacaopedido
    pedido.id_formapagamento = req.body.id_formapagamento
    pedido.id_prazopagamento = req.body.id_prazopagamento
    pedido.id_cliente = req.body.id_cliente
    pedido.id_tipofrete = req.body.id_tipofrete
    
    /*let erros : string[] = formaPagamento.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }*/

    pedido.update()

    if (pedido.id_pedido)
    {
        return res.status(200).json(pedido);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Pedido!"}
    return res.status(400).json(erro);
});