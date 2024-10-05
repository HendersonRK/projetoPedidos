import { UnidadeProduto } from "./unidadeproduto";
import { dbQuery } from "../database";

export class Usuario
{
    id_usuario: number = 0;
    usuario: string = "";
    senha: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.usuario.length == 0)
        {
            errors.push("Definição de Usuario é obrigatória!")
        }

        if (this.senha.length == 0)
        {
            errors.push("Senha para o Usuario é obrigatória!")
        }
        return errors;
    }

    static async listarTodos():Promise<Usuario[]>
    {
        let sql = `SELECT * FROM usuario ORDER BY id_usuario;`;
        let resultado = await dbQuery(sql);
        let usuarios : Usuario[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let usuario = new Usuario();
            Object.assign(usuario, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            usuarios.push(usuario)
        }
        return usuarios
    }

    static async listaUmPorId(id_usuario: number): Promise<Usuario | null>
    {
        let id = Number(id_usuario)
        let sql =  `SELECT * FROM usuario WHERE id_usuario = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);

        if (resultado.length > 0)
        {
            let usuario = new Usuario()
            Object.assign(usuario, resultado[0]) //atribui o resultado a instancia da classe
            return usuario
        }
        return null;
    }

    static async listaUmPorNome(usuario:string): Promise<Usuario | null>
    {
        let nomeUsuario = "%"+usuario+"%"
        let sql =  `SELECT * FROM usuario WHERE usuario ILIKE $1 LIMIT 1;`;        
        let resultado = await dbQuery(sql, [nomeUsuario]);

        if (resultado.length > 0)
        {
            let newUsuario = new Usuario()
            Object.assign(newUsuario, resultado[0]) //atribui o resultado a instancia da classe
            return newUsuario
        }
        return null;
    }

    public async listaUmPorNome(usuario:any): Promise<Usuario | null>
    {
        let nomeUsuario = "%"+usuario+"%"
        let sql =  `SELECT * FROM usuario WHERE usuario ILIKE $1 LIMIT 1;`;        
        let resultado = await dbQuery(sql, [nomeUsuario]);

        if (resultado.length > 0)
        {
            let newUsuario = new Usuario()
            Object.assign(newUsuario, resultado[0]) //atribui o resultado a instancia da classe
            return newUsuario
        }
        return null;
    }
    
    public async insert():Promise<Usuario|null>
    {
        let sql = `INSERT INTO usuario (usuario, senha) VALUES ($1, $2) RETURNING id_usuario;`;

        let params = [this.usuario, this.senha];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_usuario = resultado[0].id_usuario;
        }
        return null;
    }

    public async update():Promise<Usuario|null>
    {
        let sql = `UPDATE usuario SET usuario = $1, senha = $2 WHERE id_usuario = $3;`;    
        let params = [this.usuario, this.senha, this.id_usuario];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<Usuario|null>
    {
        let sql = `DELETE FROM usuario WHERE id_usuario = $1;`;
        let resultado = await dbQuery(sql, [this.id_usuario])
        if (resultado.length > 0)
        {
            this.id_usuario = resultado[0].id_usuario
            return this
        }
        return null        
    }

}