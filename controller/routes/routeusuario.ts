import { Router, Request, Response } from "express";
import { Usuario } from "../model/usuario";

export const routeUsuario = Router()

//ROTAS USUARIO
//retorna os usuarios cadastrados no banco de dados
routeUsuario.get('/usuario', async (req: Request, res: Response): Promise<Response> => 
{
    let usuarios = await Usuario.listarTodos();
    return res.status(200).json(usuarios);
});

//retorna um usuario do banco de dados por ID
routeUsuario.get('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo)
    let usuario = await Usuario.listaUmPorId(id)

    if (usuario != null)
    {
        return res.status(200).json(usuario)
    }

    let erro = {"codigo": id, "erro":"Usuario não encontrada"}
    return res.status(400).json(erro)
});

//retorna um usuario do banco de dados por nome
routeUsuario.get('/usuario/buscapornome/:nome', async (req: Request, res: Response): Promise<Response> => 
{    
    let nomeUsuario = String(req.params.nome)
    let usuario = await Usuario.listaUmPorNome(nomeUsuario)
    
    if (usuario != null)
    {
        return res.status(200).json([usuario])
    }

    let erro = {"Usuario": " ", "erro" : "Usuario não encontrado"}
    return res.status(400).json(erro)
});

//grava usuario no banco de dados
routeUsuario.post('/usuario', async (req: Request, res: Response): Promise<Response> => 
{
    let usuario = new Usuario();
    usuario.usuario = req.body.usuario;
    usuario.senha = req.body.senha;
    let erros : string[] = usuario.validate()

    if (erros.length > 0)
    {
        let json = {"erros " : erros}
        return res.status(400).json(json)
    }

    await usuario.insert();

    if (usuario.id_usuario)
    {
        return res.status(200).json(usuario)
    }

    let erro = {"codigo":"", "erro" : "Erro ao inserir Usuario."};
    return res.status(400).json(erro);
});

//deleta usuario do banco de dados
routeUsuario.delete('/usuario/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let usuario = await Usuario.listaUmPorId(id)
    await usuario?.delete();

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita usuario no banco de dados
routeUsuario.put('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let usuario = await Usuario.listaUmPorId(id)
        
    if (usuario == null)
    {
        let erro = {"id": id, "erro" : "Usuario não encontrado!"}
        return res.status(400).json(erro)
    }

    usuario.usuario = req.body.usuario
    usuario.senha = req.body.senha
        
    let erros : string[] = usuario.validate()

    if (erros.length > 0)
    {
        let json = {"erros": erros}
        return res.status(400).json(json)
    }

    usuario.update();

    if (usuario.id_usuario)
    {
        return res.status(200).json(usuario);
    }
    
    let erro = {"id" : id, "erro" : "Erro ao editar Usuario!"}
    return res.status(400).json(erro);
});