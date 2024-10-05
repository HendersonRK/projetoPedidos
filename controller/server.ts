import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { FormaPagamento } from '../controller/model/formapagamento';
import { UnidadeProduto } from '../controller/model/unidadeproduto';
import { Usuario } from '../controller/model/usuario';
import { GrupoProduto } from './model/grupoproduto';
import { Produto } from './model/produto';
import { client, dbQuery } from './database';

const port: Number = 3000;
let server: Express = express();

server.use(cors());
server.use(express.json());


server.use(async(req: Request, res: Response, next: NextFunction) =>
{
    /*let usuario:any = req.get('usuario')
    let senha:any = req.get('senha')*/

    console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url)
    let authorization = req.get("Authorization")?.replace("Basic ", '')
    console.log(authorization)
    

    if (authorization)
    {    
        let decoded = Buffer.from(authorization, 'base64').toString('binary')
        console.log(decoded)
        let usuarioSenha: string[] = decoded.split(":")
        let usuario = usuarioSenha[0]
        let senha = usuarioSenha[1]

        let usuarioLogin = await Usuario.listaUmPorNome(usuario)
        console.log(usuarioLogin?.usuario)
        console.log(usuarioLogin?.senha)

        console.log ('Usuario: '+usuario)
        console.log ('Senha: '+senha)

        if(usuario === usuarioLogin?.usuario && senha === usuarioLogin.senha)
        {
            next()
            return
        }
    }

    let erro = { "id": null, "erro" : "Falha na autenticação" }    
    return res.status(401).json(erro)
})


//LOGIN
server.get('/login', async (req: Request, res: Response): Promise<Response> =>
{
    let resultado = {"id": null, "resultado" : "Login OK" }
    return res.status(200).json(resultado)
})


//ROTAS FORMAS DE PAGAMENTO
//retorna as formas de pagamentos cadastradas no banco de dados
server.get('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let formasPagamento = await FormaPagamento.listarTodas();    
    return res.status(200).json(formasPagamento);
});

//retorna uma forma de pagamento do bancdo de dados
server.get('/formapagamento/:codigo', async (req: Request, res: Response): Promise<Response> => 
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
server.post('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
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
server.delete('/formapagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);  
    let formaPagamento = await FormaPagamento.listaUmaPorId(id)
    await formaPagamento?.delete()

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita forma de pagamento
server.put('/formapagamento/:id', async (req: Request, res: Response): Promise<Response> => 
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


//ROTAS DE PRODUTOS
//retorna os produtos cadastrados no banco de dados
server.get('/produto', async (req: Request, res: Response): Promise<Response> => 
{
    let produtos = await Produto.listarTodos();
    return res.status(200).json(produtos);
});

//retorna um produto do banco de dados
server.get('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
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
server.post('/produto', async (req: Request, res: Response): Promise<Response> => 
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
server.delete('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let produto = await Produto.listaUmPorId(id)

    await produto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita unidade do produto
server.put('/produto/:codigo', async (req: Request, res: Response): Promise<Response> => 
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


//ROTAS UNIDADE DE PRODUTOS
//retorna as unidades de produtos cadastradas no banco de dados
server.get('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let unidadesProduto = await UnidadeProduto.listarTodas();
    return res.status(200).json(unidadesProduto);
});

//retorna uma unidade do produto do banco de dados
server.get('/unidadeproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
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

//grava unidade de produto no banco de dados
server.post('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
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
server.delete('/unidadeproduto/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let unidadeProduto = await UnidadeProduto.listaUmaPorId(id)

    await unidadeProduto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita unidade do produto
server.put('/unidadeproduto/:id', async (req: Request, res: Response): Promise<Response> => 
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


//ROTAS GRUPO DE PRODUTOS
//retorna os grupos de produtos cadastrados no banco de dados
server.get('/grupoproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let grupoProdutos = await GrupoProduto.listarTodos()
    return res.status(200).json(grupoProdutos);
});

//retorna um grupo produto do banco de dados
server.get('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
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
server.post('/grupoproduto', async (req: Request, res: Response): Promise<Response> => 
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
server.delete('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.codigo);
    let grupoProduto = await GrupoProduto.listaUmPorId(id)

    await grupoProduto?.delete()
    
    let retorno = {"OK" : true};
    return res.status(200).json(retorno);
});

//edita grupo de produto
server.put('/grupoproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
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


//ROTAS USUARIO
//retorna os usuarios cadastrados no banco de dados
server.get('/usuario', async (req: Request, res: Response): Promise<Response> => 
{
    let usuarios = await Usuario.listarTodos();
    return res.status(200).json(usuarios);
});

//retorna um usuario do banco de dados por ID
server.get('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
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
server.get('/usuario/buscapornome/:nome', async (req: Request, res: Response): Promise<Response> => 
{    
    let nomeUsuario = String(req.params.nome)
    let usuario = await Usuario.listaUmPorNome(nomeUsuario)
    if (usuario != null)
    {
        return res.status(200).json(usuario)
    }

    let erro = {"Usuario": " ", "erro" : "Usuario não encontrado"}
    return res.status(400).json(erro)
});

//grava usuario no banco de dados
server.post('/usuario', async (req: Request, res: Response): Promise<Response> => 
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
server.delete('/usuario/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let usuario = await Usuario.listaUmPorId(id)
    await usuario?.delete();

    let retorno = {'OK' : true};
    return res.status(200).json(retorno);
});

//edita usuario no banco de dados
server.put('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
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


//SERVIDOR
server.listen(port, () =>
{
    console.log('Server iniciado na porta: '+port)
})
