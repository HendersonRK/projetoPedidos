import { client, dbQuery } from '../database';

export class Pedido
{
    id_pedido: number = 0
    datapedido: Date = new Date
    situacao: number = 0
    observacoes: string = ''
    id_formapagamento: number = 0
    id_prazopagamento: number = 0
    id_cliente: number = 0
    id_tipofrete: number = 0

    /*validate()
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
    }*/

    static async listarTodos():Promise<Pedido[]>
    {
        let sql = `SELECT a.id_pedido, b.nome, a.datapedido, a.situacao
                    FROM pedido a 
                    LEFT JOIN cliente b ON a.id_cliente = b.id_cliente
                    ORDER BY a.id_pedido;`
                    
        let resultado = await dbQuery(sql);
        let pedidos : Pedido[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let pedido = new Pedido();
            Object.assign(pedido, json)//preenche os dados do objeto pedido, com os elementos dentro do JSON
            pedidos.push(pedido)
        }
        return pedidos
    }

    static async listaUmPorId(id_BuscaPedido: number): Promise<Pedido | null>
    {
        let id = Number(id_BuscaPedido)
        let sql =  `SELECT * FROM pedido WHERE id_pedido = $1 LIMIT 1;`
        
        let resultado = await dbQuery(sql, [id])

        if (resultado.length > 0)
        {
            let pedido = new Pedido()
            Object.assign(pedido, resultado[0]) //atribui o resultado a instancia da classe
            return pedido
        }
        return null;
    }

    public async insert():Promise<Pedido | null>
    {
        let sql = `INSERT INTO pedido (datapedido, situacao, observacoes, id_formapagamento, id_prazopagamento, id_cliente, id_tipofrete) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_pedido;`

        let params = [this.datapedido, this.situacao, this.observacoes, this.id_formapagamento, this.id_prazopagamento, this.id_cliente, this.id_tipofrete];
        let resultado = await dbQuery(sql, params);
        console.log(resultado+' no pedido.ts')

        if (resultado.length >0)
        {
            this.id_pedido = resultado[0].id_pedido;
        }
        return null;
    }

    public async update():Promise<Pedido | null>
    {
        let sql = `UPDATE cliente SET datapedido = $1, situacao = $2, observacoes = $3, id_formapagamento = $4, 
        id_prazopagamento = $5, id_cliente = $6, id_tipofrete = $7 WHERE id_pedido = $8;`    

        let params = [this.datapedido, this.situacao, this.observacoes, this.id_formapagamento, this.id_prazopagamento, this.id_cliente, this.id_tipofrete, this.id_tipofrete];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<Pedido | null>
    {
        let sql = `DELETE FROM pedido WHERE id_cliente = $1 RETURNING id_pedido;`
        let resultado = await dbQuery(sql, [this.id_pedido])
        if (resultado.length > 0)
        {
            this.id_pedido = resultado[0].id_pedido
            return this
        }
        return null        
    }
}