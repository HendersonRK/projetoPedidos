import { client, dbQuery } from '../database'
import * as puppeteer from 'punycode'

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

        if (resultado.length >0)
        {
            this.id_pedido = resultado[0].id_pedido;
        }
        return null;
    }

    public async update():Promise<Pedido | null>
    {
        let sql = `UPDATE pedido SET datapedido = $1, situacao = $2, observacoes = $3, id_formapagamento = $4, 
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
        let sql = `DELETE FROM pedido WHERE id_pedido = $1 RETURNING id_pedido;`
        let resultado = await dbQuery(sql, [this.id_pedido])
        if (resultado.length > 0)
        {
            this.id_pedido = resultado[0].id_pedido
            return this
        }
        return null        
    }

    public async pdf()
    {
        const htmlImpressao = `
        <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pedido de Compra - Impressão</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #ffffff;
                        color: #000000;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                        color: #000000;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #000000;
                        padding: 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Pedido de Compra</h1>
                <table>
                    <tr>
                        <th>ID do Pedido</th>
                        <td>${this.id_pedido}</td>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <td>${this.datapedido}</td>
                    </tr>
                    <tr>
                        <th>Cidade</th>
                        <td>${this.situacao}</td>
                    </tr>
                    <tr>
                        <th>Estado</th>
                        <td>${this.observacoes}</td>
                    </tr>
                    <tr>
                        <th>Forma de Pagamento</th>
                        <td>${this.id_cliente}</td>
                    </tr>
                    <tr>
                        <th>Prazo de Pagamento</th>
                        <td>${this.id_formapagamento}</td>
                    </tr>
                    <tr>
                        <th>Tipo de Frete</th>
                        <td>${this.id_prazopagamento}</td>
                    </tr>
                    <tr>
                        <th>Observações</th>
                        <td>${this.id_tipofrete}</td>
                    </tr>
                </table>            
            </body>
        </html>
        `
    }
}