import { Router, Request, Response } from "express";
import { UnidadeProduto } from "../model/unidadeproduto";

export const routeUnidadeProduto = Router()

//retorna as unidades de produtos cadastradas no banco de dados
routeUnidadeProduto.get('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let unidadesProduto = await UnidadeProduto.listarTodas();
    return res.status(200).json(unidadesProduto);
});

//retorna uma unidade do produto do banco de dados
routeUnidadeProduto.get('/unidadeproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let unidadeProduto = await UnidadeProduto.listaUmaPorId(id)

    if (unidadeProduto != null)
    {
        return res.status(200).json(unidadeProduto)
    }

    let erro = {"codigo": id, "erro":"Unidade do Produto não encontrada"}
    return res.status(400).json(erro)
});

//retorna um unidade de produto do banco de dados por nome
routeUnidadeProduto.get('/unidadeproduto/buscapornome/:nome', async (req: Request, res: Response): Promise<Response> => 
{    
    let nomeUnidade = String(req.params.nome)
    let unidade = await UnidadeProduto.listaUmPorNome(nomeUnidade)
    if (unidade != null)
    {
        return res.status(200).json([unidade])
    }

    let erro = {"Unidade": " ", "erro" : "Unidade de produto não encontrada"}
    return res.status(400).json(erro)
});

//grava unidade de produto no banco de dados
routeUnidadeProduto.post('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let uniProduto = new UnidadeProduto();
    uniProduto.descricaouniproduto = req.body.descricaouniproduto;
    let erros : string[] = uniProduto.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await uniProduto.insert();

    if (uniProduto.id_unidadeproduto)
    {
        return res.status(200).json(uniProduto)
    }

    let erro = {"id_unidadeproduto ": null, "erro" : "Erro ao inserir Unidade de Produto!"}
    return res.status(400).json(erro)
});

//deleta unidade de produto do banco de dados
routeUnidadeProduto.delete('/unidadeproduto/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let unidadeProduto = await UnidadeProduto.listaUmaPorId(id)

    await unidadeProduto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita unidade do produto
routeUnidadeProduto.put('/unidadeproduto/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let unidadeProduto = await UnidadeProduto.listaUmaPorId(id)
    
    if (unidadeProduto == null)
    {
        let erro = {"id": id, "erro" : "Unidade Produto não encontrada!"}
        return res.status(400).json(erro)
    }

    unidadeProduto.descricaouniproduto = req.body.descricaouniproduto
    
    let erros : string[] = unidadeProduto.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    unidadeProduto.update()

    if (unidadeProduto.id_unidadeproduto)
    {
        return res.status(200).json(unidadeProduto);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Unidade do Produto!"}
    return res.status(400).json(erro);
});