import { Router, Request, Response } from "express";
import { Produto } from "../model/produto";

export const routeProduto = Router()

//retorna os produtos cadastrados no banco de dados
routeProduto.get('/produto', async (req: Request, res: Response): Promise<Response> => 
{
    let produtos = await Produto.listarTodos();
    return res.status(200).json(produtos);
});

//retorna um produto do banco de dados
routeProduto.get('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let produto = await Produto.listaUmPorId(id)

    if (produto != null)
    {
        return res.status(200).json(produto)
    }

    let erro = {"codigo": id, "erro":"Produto não encontrado"}
    return res.status(400).json(erro)
});

//grava produto no banco de dados
routeProduto.post('/produto', async (req: Request, res: Response): Promise<Response> => 
{
    let produto = new Produto();
    produto.nomeproduto = req.body.nomeproduto
    produto.nomeprodutoresumido = req.body.nomeprodutoresumido
    produto.codigobarra = req.body.codigobarra
    produto.id_unidade = req.body.id_unidade
    produto.id_grupo = req.body.id_grupo
    
    let erros : string[] = produto.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await produto.insert();

    if (produto.nomeproduto)
    {
        return res.status(200).json(produto)
    }

    let erro = {"id": null, "erro" : "Erro ao inserir Produto!"}
    return res.status(400).json(erro)
});

//deleta produto do banco de dados
routeProduto.delete('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let produto = await Produto.listaUmPorId(id)

    await produto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita produto no banco de dados
routeProduto.put('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let produto = await Produto.listaUmPorId(id)
    
    if (produto == null)
    {
        let erro = {"Codigo: ": id, "erro" : "Produto não encontrado!"}
        return res.status(400).json(erro)
    }

    produto.nomeproduto = req.body.nomeproduto
    produto.nomeprodutoresumido = req.body.nomeprodutoresumido
    produto.codigobarra = req.body.codigobarra
    produto.id_unidade = req.body.idunidade
    produto.id_grupo = req.body.idgrupo
    
    let erros : string[] = produto.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    produto.update()

    if (produto.id_produto)
    {
        return res.status(200).json(produto);
    }
    
    let erro = {"Código: " : id, "erro" : "Erro ao editar Produto!"}
    return res.status(400).json(erro);
});