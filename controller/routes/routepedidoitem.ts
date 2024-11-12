import { Router, Request, Response } from "express";
import { PedidoItem } from "../model/pedidoitens";


export const routePedidoItem = Router()

//retorna os itens de  pedidos cadastradas no banco de dados
routePedidoItem.get('/pedidoitem', async (req: Request, res: Response): Promise<Response> => 
{
    let resultado = await PedidoItem.listarTodos()
    return res.status(200).json(resultado);
})

//retorna os itens de pedidos cadastradas no banco de dados pelo id de pedido
routePedidoItem.get('/pedidoitem/pedido/:idPedido', async (req: Request, res: Response): Promise<Response> => 
{
    let idPedido = Number(req.params.idPedido)
    let resultado = await PedidoItem.listaPorPedido(idPedido)

    return res.status(200).json(resultado);
})

//retorna um item de pedido do bancdo de dados
routePedidoItem.get('/pedidoitem/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let pedidoItem = await PedidoItem.listaUmPorId(id)

    if (pedidoItem != null)
    {
        return res.status(200).json(pedidoItem)
    }

    let erro = {"codigo": id, "erro" : "Item de Pedido não encontrado!"}
    return res.status(400).json(erro)
})

//grava item do pedido no banco de dados
routePedidoItem.post('/pedidoitem', async (req: Request, res: Response): Promise<Response> => 
{
    let pedidoItem = new PedidoItem();
    pedidoItem.id_pedido = req.body.id_pedido
    pedidoItem.id_produto = req.body.id_produto
    pedidoItem.quantidade = req.body.quantidade
    pedidoItem.valorunitario = req.body.valorUnitario
    pedidoItem.valortotal = req.body.valorTotal

    /*let erros : string[] = formaPagamento.validate();

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }*/

    await pedidoItem.insert();

    console.log("pedido item no arq routepedidoitem"+pedidoItem)

    if (pedidoItem.id_pedidoitem)
    {
        return res.status(200).json(pedidoItem)
    }

    let erro = {"id_pedidoItem": null, "erro" : "Erro ao inserir item no pedido!"}
    return res.status(400).json(erro)
});

routePedidoItem.delete('/pedidoitem/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let pedidoItem = await PedidoItem.listaUmPorId(id)
    
    await pedidoItem?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita pedido
routePedidoItem.put('/pedido/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let pedidoItem = await PedidoItem.listaUmPorId(id)
    
    if (pedidoItem == null)
    {
        let erro = {"id": id, "erro" : "Item de Pedido não encontrado!"}
        return res.status(400).json(erro)
    }

    Object.assign(pedidoItem, req.body)
    /*pedido.datapedido = req.body.datapedido
    pedido.situacao = req.body.situacaopedido
    pedido.observacoes = req.body.observacaopedido
    pedido.id_formapagamento = req.body.id_formapagamento
    pedido.id_prazopagamento = req.body.id_prazopagamento
    pedido.id_cliente = req.body.id_cliente
    pedido.id_tipofrete = req.body.id_tipofrete
    
    let erros : string[] = formaPagamento.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }*/

    pedidoItem.update()
   
    if (pedidoItem.id_pedidoitem)
    {
        return res.status(200).json(pedidoItem);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Pedido!"}
    return res.status(400).json(erro);
});

