import { Router, Request, Response } from "express";
import { Cliente } from "../model/cliente";

export const routeCliente = Router()

//retorna os clientes cadastrados no banco de dados
routeCliente.get('/cliente', async (req: Request, res: Response): Promise<Response> => 
{
    let clientes = await Cliente.listarTodas()   
    return res.status(200).json(clientes);
});

//retorna um cliente do bancdo de dados
routeCliente.get('/cliente/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let cliente = await Cliente.listaUmPorId(id)

    if (cliente != null)
    {
        return res.status(200).json(cliente)
    }

    let erro = {"codigo": id, "erro" : "Cliente não encontrado!"}
    return res.status(400).json(erro)
});

//grava cliente no banco de dados
routeCliente.post('/cliente', async (req: Request, res: Response): Promise<Response> => 
{
    let cliente = new Cliente()
    cliente.nome = req.body.nomecliente
    cliente.cpf = req.body.cpfcliente
    cliente.siglauf = req.body.siglaufcliente
    cliente.cidade = req.body.cidadecliente
    cliente.telefone = req.body.telefonecliente
    cliente.email = req.body.emailcliente
    let erros : string[] = cliente.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await cliente.insert()
    
    if (cliente.id_cliente)
    {
        return res.status(200).json(cliente)
    }
    let erro = {"id_cliente": null, "erro" : "Erro ao cadastrar cliente, verifique os dados inseridos!"}
    return res.status(400).json(erro)
});

//deleta cliente do banco de dados
routeCliente.delete('/cliente/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let cliente = await Cliente.listaUmPorId(id)
    await cliente?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita tipo de frete
routeCliente.put('/cliente/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let cliente = await Cliente.listaUmPorId(id)
    
    if (cliente == null)
    {
        let erro = {"id": id, "erro" : "Cliente não encontrado!"}
        return res.status(400).json(erro)
    }

    cliente.nome = req.body.nomecliente
    cliente.cpf = req.body.cpfcliente
    cliente.siglauf = req.body.siglaufcliente
    cliente.cidade = req.body.cidadecliente
    cliente.telefone = req.body.telefonecliente
    cliente.email = req.body.emailcliente
        
    let erros : string[] = cliente.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    cliente.update()

    if (cliente.id_cliente)
    {
        return res.status(200).json(cliente);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Cliente, verifique os dados digitados!"}
    return res.status(400).json(erro);
});

routeCliente.get('/cliente/buscapornome/:nomecliente', async (req: Request, res: Response): Promise<Response> => 
{
    let nomeCliente = String(req.params.nomecliente)
    let cliente = await Cliente.listaUmPorNome(nomeCliente)

    if(cliente != null)
    {
        return res.status(200).json([cliente])
    }

    let erro = {"Cliente": "", "erro" : "Cliente não encontrado"}
    return res.status(400).json(erro)
})