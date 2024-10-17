import { Router, Request, Response } from "express";
import { GrupoProduto } from "../model/grupoproduto";

export const routeGrupoProduto = Router()

//retorna os grupos de produtos cadastrados no banco de dados
routeGrupoProduto.get('/grupoproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let grupoProdutos = await GrupoProduto.listarTodos()
    return res.status(200).json(grupoProdutos);
});

//retorna um grupo produto do banco de dados
routeGrupoProduto.get('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let grupoProduto = await GrupoProduto.listaUmPorId(id)

    if (grupoProduto != null)
    {
        return res.status(200).json(grupoProduto)
    }

    let erro = {"codigo": id, "erro":"Unidade do Produto não encontrada"}
    return res.status(400).json(erro)
});

//grava grupo de produto no banco de dados
routeGrupoProduto.post('/grupoproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let grupoProduto = new GrupoProduto();
    grupoProduto.descricaogrupoproduto = req.body.descricaogrupoproduto
    let erros : string[] = grupoProduto.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await grupoProduto.insert();

    if (grupoProduto.id_grupoproduto)
    {
        return res.status(200).json(grupoProduto)
    }

    let erro = {"id_grupoproduto ": null, "erro" : "Erro ao inserir Unidade de Produto!"}
    return res.status(400).json(erro)
});

//deleta grupo de produto do banco de dados
routeGrupoProduto.delete('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let grupoProduto = await GrupoProduto.listaUmPorId(id)

    await grupoProduto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita grupo de produto
routeGrupoProduto.put('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let grupoProduto = await GrupoProduto.listaUmPorId(id)
    
    if (grupoProduto == null)
    {
        let erro = {"id": id, "erro" : "Grupo Produto não encontrado!"}
        return res.status(400).json(erro)
    }

    grupoProduto.descricaogrupoproduto = req.body.descricaogrupoproduto
    
    let erros : string[] = grupoProduto.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    grupoProduto.update()

    if (grupoProduto.id_grupoproduto)
    {
        return res.status(200).json(grupoProduto);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Unidade do Produto!"}
    return res.status(400).json(erro);
});
