import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { FormaPagamento } from '../model/formapagamento';
import { UnidadeProduto } from '../model/unidadeproduto';
import { Usuario } from '../model/usuario';
import { client, dbQuery } from './database';

const port: Number = 3000;
let server: Express = express();

server.use(cors());
server.use(express.json());

//funções 
async function pegarFormaPagamento(id:number) 
{
    let sql =  `SELECT * FROM formapagamento WHERE id_frmpagamento = $1 LIMIT 1;`;
    let resultado = await dbQuery(sql, [id]);

    if (resultado.length > 0)
    {
        console.log(resultado[0]);
        return resultado[0];
    }
    return null;
}

async function pegarUnidadeProduto(id:number) 
{
    let sql =  `SELECT * FROM unidadeproduto WHERE id_unidadeproduto = $1 LIMIT 1;`;
    let resultado = await dbQuery(sql, [id]);

    if (resultado.length > 0)
    {
        console.log(resultado[0]);
        return resultado[0];
    }
    return null;
}

async function pegarUsuario(id:number) 
{
    let sql =  `SELECT * FROM usuario WHERE id_usuario = $1 LIMIT 1;`;
    let resultado = await dbQuery(sql, [id]);

    if (resultado.length > 0)
    {
        console.log(resultado[0]);
        return resultado[0];
    }
    return null;
}

//rotas
//retorna as formas de pagamentos cadastradas no banco de dados
server.get('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
{
    let sql = `SELECT * FROM formapagamento ORDER By id_frmpagamento;`;
    let resultado = await dbQuery(sql);
    console.table (resultado);

    return res.status(200).json(resultado);
});

//retorna as unidades de produtos cadastradas no banco de dados
server.get('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let sql = `SELECT * FROM unidadeproduto ORDER By id_unidadeproduto;`;
    let resultado = await dbQuery(sql);
    console.table (resultado);

    return res.status(200).json(resultado);
});

//retorna os usuarios cadastrados no banco de dados
server.get('/usuario', async (req: Request, res: Response): Promise<Response> => 
{
    let sql = `SELECT * FROM usuario ORDER By id_usuario;`;
    let resultado = await dbQuery(sql);
    console.table (resultado);

    return res.status(200).json(resultado);
});

//retorna uma forma de pagamento do bancdo de dados
server.get('/formapagamento/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number (req.params.codigo)
    let formaPagamento = await pegarFormaPagamento(codigo);

    if (formaPagamento != null)
    {
        return res.status(200).json(formaPagamento)
    }

    let erro = {"codigo": codigo, "erro":"Forma de pagamento não encontrada!"}
    return res.status(400).json(erro)
});

//retorna uma unidade do produto do banco de dados
server.get('/unidadeproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number(req.params.codigo)
    let unidadeProduto = await pegarUnidadeProduto(codigo)

    if (unidadeProduto != null)
    {
        return res.status(200).json(unidadeProduto)
    }

    let erro = {"codigo": codigo, "erro":"Unidade do Produto não encontrada"}
    return res.status(400).json(erro)
});

//retorna um usuario do banco de dados
server.get('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number(req.params.codigo)
    let usuario = await pegarUnidadeProduto(codigo)

    if (usuario != null)
    {
        return res.status(200).json(usuario)
    }

    let erro = {"codigo": codigo, "erro":"Usuario não encontrada"}
    return res.status(400).json(erro)
});

//grava forma de pagamento no banco de dados
server.post('/formapagamento', async (req: Request, res: Response): Promise<Response> => 
{
    try
    {    
        let formaPagamento = new FormaPagamento();
        formaPagamento.descricaofrmpagamento = req.body.descricaofrmpagamento;

        if (!formaPagamento.descricaofrmpagamento)
        {
            return res.status(400).json({"erro": "Descrição da forma de pagamento é obrigatória!"})
        }

        let sql = `INSERT INTO formapagamento (descricaofrmpagamento) VALUES ($1) RETURNING id_frmpagamento;`;

        console.log ('query sql ',sql);

        let params = [formaPagamento.descricaofrmpagamento];
        let resultado = await dbQuery(sql, params);
        console.log('resultado da inserção ', resultado)

        if (resultado.length>0)
        {
            let formaPagamento = await pegarFormaPagamento(resultado[0].id_frmpagamento);

            if (formaPagamento != null)
            {
                return res.status(200).json(formaPagamento);
            }
        }
        let erro = {"codigo": "", "erro": "Erro ao inserir forma de pagamento."};
        return res.status(400).json(erro);
    }
    catch (error)
    {
        console.error('Erro ao inserir forma de pagamento:'+error)
        return res.status(500).json({"erro": "Erro interno ao inserir forma de pagamento!"})
    }

});

//grava unidade de produto no banco de dados
server.post('/unidadeproduto', async (req: Request, res: Response): Promise<Response> => 
{
    let uniProduto = new UnidadeProduto();
    uniProduto.descricaouniproduto = req.body.descricaouniproduto;

    let sql = `INSERT INTO unidadeproduto (descricaouniproduto) VALUES ($1) RETURNING id_unidadeproduto`;

    console.log (sql);

    let params = [uniProduto.descricaouniproduto];
    let resultado = await dbQuery(sql, params);

    if (resultado.length >0)
    {
        let uniProduto = await pegarUnidadeProduto(resultado[0].id_unidadeproduto);

        if (uniProduto != null)
        {
            return res.status(200).json(uniProduto);
        }
    }
    let erro = {"codigo":"", "erro" : "Erro ao inserir unidade."};
    return res.status(400).json(erro);
});

//grava usuario no banco de dados
server.post('/usuario', async (req: Request, res: Response): Promise<Response> => 
{
    let usuario = new Usuario();
    usuario.usuario = req.body.usuario;
    usuario.password = req.body.password;

    let sql = `INSERT INTO usuario (usuario, password) VALUES ($1, $2) RETURNING id_usuario`;

    console.log (sql);

    let params = [usuario.usuario, usuario.password];
    let resultado = await dbQuery(sql, params);

    if (resultado.length >0)
    {
        let usuario = await pegarUsuario(resultado[0].id_usuario);

        if (usuario != null)
        {
            return res.status(200).json(usuario);
        }
    }
    let erro = {"codigo":"", "erro" : "Erro ao inserir Usuario."};
    return res.status(400).json(erro);
});

//deleta forma de pagamento do banco de dados
server.delete('/formapagamento/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let sql = `DELETE FROM formapagamento WHERE id_frmpagamento = $1;`;
    let resultado = await dbQuery(sql, [id]);

    let retorno = {'OK' : true};

    return res.status(200).json(retorno);
});

//deleta unidade de produto do banco de dados
server.delete('/unidadeproduto/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let sql = `DELETE FROM unidadeproduto WHERE id_unidadeproduto = $1;`;
    let resultado = await dbQuery(sql, [id]);

    let retorno = {'OK' : true};

    return res.status(200).json(retorno);
});

//deleta usuario do banco de dados
server.delete('/usuario/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let sql = `DELETE FROM usuario WHERE id_usuario = $1;`;
    let resultado = await dbQuery(sql, [id]);

    let retorno = {'OK' : true};

    return res.status(200).json(retorno);
});

//edita formas de pagamento
server.put('/formapagamento/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number(req.params.codigo);

    let formaPagamento = new FormaPagamento();
    formaPagamento.id_frmpagamento = codigo
    formaPagamento.descricaofrmpagamento = req.body.descricaofrmpagamento
    
    let sql = `UPDATE formapagamento SET descricaofrmpagamento = $1 WHERE id_frmpagamento = $2;`;
    console.log(sql);

    let params = [formaPagamento.descricaofrmpagamento, codigo];

    let resultado = await dbQuery(sql, params);

    return res.status(200).json(formaPagamento);
});

//edita unidade do produto
server.put('/unidadeproduto/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number(req.params.codigo);

    let unidadeProduto = new UnidadeProduto();
    unidadeProduto.id_uniproduto = codigo
    unidadeProduto.descricaouniproduto = req.body.descricaouniproduto
    
    let sql = `UPDATE unidadeproduto SET descricaouniproduto = $1 WHERE id_unidadeproduto = $2;`;
    console.log(sql);

    let params = [unidadeProduto.descricaouniproduto, codigo];

    let resultado = await dbQuery(sql, params);

    return res.status(200).json(unidadeProduto);
});

//edita usuario no banco de dados
server.put('/usuario/:codigo', async (req: Request, res: Response): Promise<Response> => 
{
    let codigo = Number(req.params.codigo);

    let usuario = new Usuario();
    usuario.id_usuario = codigo
    usuario.usuario = req.body.usuario
    usuario.password = req.body.password
    
    let sql = `UPDATE usuario SET usuario = $1, password = $2 WHERE id_usuario = $3;`;
    console.log(sql);

    let params = [usuario.usuario, usuario.password, codigo];

    let resultado = await dbQuery(sql, params);

    return res.status(200).json(usuario);
});

server.listen(port, () =>
{
    console.log('Server iniciado na porta: '+port)
})