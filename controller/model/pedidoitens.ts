import { client, dbQuery } from '../database';

export class PedidoItem
{
    id_pedidoitem: number = 0
    id_pedido: number = 0
    id_produto: number = 0
    quantidade: number = 0    
    valorunitario: number = 0
    valortotal: number = 0

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

    static async listarTodos():Promise<PedidoItem[]>
    {
        let sql = `SELECT * FROM pedidoitem ORDER BY id_pedidoitem;`
                    
        let resultado = await dbQuery(sql);
        let itens : PedidoItem[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let item = new PedidoItem();
            Object.assign(item, json)//preenche os dados do objeto pedido, com os elementos dentro do JSON
            itens.push(item)
        }
        return itens
    }

    static async listaUmPorId(id_BuscaPedidoItem: number): Promise<PedidoItem | null>
    {
        let id = Number(id_BuscaPedidoItem)
        let sql =  `SELECT * FROM pedidoitem WHERE id_pedidoitem = $1 LIMIT 1;`
        
        let resultado = await dbQuery(sql, [id])

        if (resultado.length > 0)
        {
            let pedidoItem = new PedidoItem()
            Object.assign(pedidoItem, resultado[0]) //atribui o resultado a instancia da classe
            return pedidoItem
        }
        return null;
    }

    public async insert():Promise<PedidoItem | null>
    {
        let sql = `INSERT INTO pedidoitem (id_pedido, id_produto, quantidade, valorunitario, valortotal) 
        VALUES ($1, $2, $3, $4, $5) RETURNING id_pedidoitem;`

        let params = [this.id_pedido, this.id_produto, this.quantidade, this.valorunitario, this.valortotal];
        let resultado = await dbQuery(sql, params);
        
        if (resultado.length >0)
        {
            return this.id_pedidoitem = resultado[0].id_pedidoitem;
        }
        return null;
    }

    public async update():Promise<PedidoItem | null>
    {
        let sql = `UPDATE pedidoitem SET id_produto = $1, quantidade = $2, valorunitario = $3, valorotal = $4 WHERE id_pedidoitem = $5;`    

        let params = [this.id_produto, this.quantidade, this.valorunitario, this.valortotal, this.id_pedidoitem];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<PedidoItem | null>
    {
        let sql = `DELETE FROM pedidoitem WHERE id_pedidoitem = $1 RETURNING id_pedidoitem;`
        let resultado = await dbQuery(sql, [this.id_pedido])
        
        if (resultado.length > 0)
        {
            this.id_pedidoitem = resultado[0].id_pedidoitem
            return this
        }
        return null        
    }

    static async listaPorPedido (idPedido:number):Promise<PedidoItem[]>
    {
        let sql = `SELECT b.nomeproduto, a.quantidade, a.valorunitario, a.valortotal
                    FROM pedidoitem a
                    LEFT JOIN produto b ON a.id_produto = b.id_produto
                    WHERE a.id_pedido = $1
                    ORDER BY id_pedidoitem;`

        let resultado = await dbQuery(sql, [idPedido])
        let itensPedido: PedidoItem[] = []

        for(let index = 0; index< resultado.length; index++)
        {
            let json = resultado[index]
            let item = new PedidoItem()
            Object.assign(item, json)
            itensPedido.push(item)
        }

        return itensPedido
    }
}