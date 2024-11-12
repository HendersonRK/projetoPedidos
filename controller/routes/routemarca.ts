import { Router, Request, Response } from "express";
import { Marca } from "../model/marca";

export const routeMarca = Router()

//retorna os grupos de produtos cadastrados no banco de dados
routeMarca.get('/marcaproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let marcas = await Marca.listarTodasMarcas()
    return res.status(200).json(marcas)
});

//retorna um grupo produto do banco de dados
routeMarca.get('/marcaproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let marca = await Marca.listaUmaMarcaPorId(id)

    if (marca != null)
    {
        return res.status(200).json(marca)
    }

    let erro = {"codigo": id, "erro":"Marca de Produto não encontrada"}
    return res.status(400).json(erro)
});

//grava grupo de produto no banco de dados
routeMarca.post('/marcaproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let marca = new Marca();
    marca.descricaomarca = req.body.descricaomarca
    let erros : string[] = marca.validate()

    if (erros.length > 0)
    {
        let json = {"erros":erros}
        return res.status(400).json(json)
    }

    await marca.insert();

    if (marca.id_marca)
    {
        return res.status(200).json(marca)
    }

    let erro = {"id_marca ": null, "erro" : "Erro ao inserir Marca de Produto!"}
    return res.status(400).json(erro)
});

//deleta grupo de produto do banco de dados
routeMarca.delete('/marcaproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let marca = await Marca.listaUmaMarcaPorId(id)

    await marca?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita grupo de produto
routeMarca.put('/marcaproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let marca = await Marca.listaUmaMarcaPorId(id)
    
    if (marca == null)
    {
        let erro = {"id": id, "erro" : "Marca não encontrado!"}
        return res.status(400).json(erro)
    }

    marca.descricaomarca = req.body.descricaomarca
    
    let erros : string[] = marca.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    marca.update()

    if (marca.id_marca)
    {
        return res.status(200).json(marca);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Marca de Produto!"}
    return res.status(400).json(erro);
});
