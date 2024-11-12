import { Router, Request, Response } from "express"
import { enviarEmail } from "../model/email"
import { Pedido } from "../model/pedidos"
import { PedidoItem } from "../model/pedidoitens"
import { Configuracoes } from "../model/configuracoes"

export const routeEmail = Router()
//emails
routeEmail.get ('/email/:idpedido/:enderecoemail', async (req: Request, res: Response) =>
{
    let destinatario = String(req.params.enderecoemail)
    let idPedido = Number(req.params.idpedido)
    console.log('destinatario: '+destinatario+'. idPedido: '+idPedido)

    let pedido = await Pedido.listaUmPorId(idPedido)
    let itensPedido = await PedidoItem.listaPorPedido(idPedido)
    //console.log("pedido: "+pedido+ " ,itens pedido: "+itensPedido)


    let html = '<h1>Teste email</h1>'

    res.json(await enviarEmail(destinatario, html))
})

