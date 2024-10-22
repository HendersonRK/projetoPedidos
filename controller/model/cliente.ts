import { client, dbQuery } from '../database';

export class Cliente
{
    id_cliente: number = 0
    nome: string = ""
    cpf: string = ''
    siglauf: string = ''
    cidade: string = ''
    telefone: string = ''
    email: string = ''

    validate()
    {
        let errors: string[]=[];

        if (this.nome.length == 0)
        {
            errors.push("Nome do Cliente é obrigatória!")
        }
        if (this.cpf.length == 0)
        {
            errors.push("CPF do Cliente é obrigatória!")
        }
        if (this.email.length == 0)
        {
            errors.push("Email do Cliente é obrigatória!")
        }
        return errors;
    }

    static async listarTodas():Promise<Cliente[]>
    {
        let sql = `SELECT * FROM cliente ORDER BY id_cliente;`;
        let resultado = await dbQuery(sql);
        let clientes : Cliente[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let cliente = new Cliente();
            Object.assign(cliente, json)//preenche os dados do objeto cliente, com os elementos dentro do JSON
            clientes.push(cliente)
        }
        return clientes
    }

    static async listaUmPorId(id_BuscaCliente: number): Promise<Cliente | null>
    {
        let id = Number(id_BuscaCliente)
        let sql =  `SELECT * FROM cliente WHERE id_cliente = $1 LIMIT 1;`
        
        let resultado = await dbQuery(sql, [id])

        if (resultado.length > 0)
        {
            let cliente = new Cliente()
            Object.assign(cliente, resultado[0]) //atribui o resultado a instancia da classe
            return cliente
        }
        return null;
    }

    public async insert():Promise<Cliente | null>
    {
        let sql = `INSERT INTO cliente (nome, cpf, siglauf, cidade, telefone, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_cliente;`

        let params = [this.nome, this.cpf, this.siglauf, this.cidade, this.telefone, this.email];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_cliente = resultado[0].id_cliente;
        }
        return null;
    }

    public async update():Promise<Cliente | null>
    {
        let sql = `UPDATE cliente SET nome = $1, cpf = $2, siglauf = $3, cidade = $4, telefone = $5, email = $6 WHERE id_cliente = $7;`;    
        let params = [this.nome, this.cpf, this.siglauf, this.cidade, this.telefone, this.email, this.id_cliente];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<Cliente | null>
    {
        let sql = `DELETE FROM cliente WHERE id_cliente = $1 RETURNING id_cliente;`;
        let resultado = await dbQuery(sql, [this.id_cliente])
        if (resultado.length > 0)
        {
            this.id_cliente = resultado[0].id_cliente
            return this
        }
        return null        
    }
}