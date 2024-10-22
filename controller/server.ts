import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Usuario } from '../controller/model/usuario';
import { routeFormaPagamento } from './routes/routeformapagamento';
import { routeUnidadeProduto } from './routes/routeunidadeproduto';
import { routeGrupoProduto } from './routes/routegrupoproduto';
import { routeProduto } from './routes/routeproduto';
import { routeUsuario } from './routes/reouteusuario';
import { routeConfiguracao } from './routes/routeconfiguracaoemail';
import { routeEmail } from './routes/routeemail';
import { routeTipoFrete } from './routes/routetipofrete';
import { routeCliente } from './routes/routecliente';
import { routePrazoPagamento } from './routes/routeprazopagamento';
import { routePedido } from './routes/routepedido';

const port: Number = 3000;
let server: Express = express();

server.use(cors());
server.use(express.json());

server.use(routeFormaPagamento)
server.use(routeUnidadeProduto)
server.use(routeGrupoProduto)
server.use(routeProduto)
server.use(routeUsuario)
server.use(routeConfiguracao)
server.use(routeEmail)
server.use(routeTipoFrete)
server.use(routeCliente)
server.use(routePrazoPagamento)
server.use(routePedido)


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

//SERVIDOR
server.listen(port, () =>
{
    console.log('Server iniciado na porta: '+port)
})