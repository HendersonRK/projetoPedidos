import { dbQuery } from "../database";

export class Produto
{
    id_produto: number = 0
    nomeproduto: string = ''
    nomeprodutoresumido: string = ''
    codigobarra: string = ''
    id_unidade: number = 0
    id_grupo: number = 0

    validate()
    {
        let errors: string[]=[];

        if (this.nomeproduto.length == 0)
        {
            errors.push("Nome do produto é obrigatório!")
        }
        
        return errors;
    }

    static async listarTodos():Promise<Produto[]>
    {
        let sql = `SELECT a.id_produto, a.nomeproduto, b.descricaouniproduto, c.descricaogrupoproduto
                    FROM produto a 
                    LEFT JOIN unidadeproduto b ON a.id_unidade = b.id_unidadeproduto
                    LEFT JOIN grupoproduto c ON a.id_grupo = c.id_grupoproduto
                    ORDER BY a.id_produto;`;

        let resultado = await dbQuery(sql);
        let produtos : Produto[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let produto = new Produto();
            Object.assign(produto, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            produtos.push(produto)
        }
        return produtos
    }

    static async listaUmPorId(id_produtoLocal: number): Promise<Produto|null>
    {
        let id = Number(id_produtoLocal)
        let sql =  `SELECT * FROM produto WHERE id_produto = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);
        if (resultado.length > 0)
        {
            let produto = new Produto()
            Object.assign(produto, resultado[0]) //atribui o resultado a instancia da classe
            return produto
        }
        return null;
    }

    public async insert():Promise<Produto|null>
    {
        let sql = `INSERT INTO produto (nomeproduto, nomeprodutoresumido, codigobarra, id_unidade, id_grupo) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id_produto;`;

        let params = [this.nomeproduto,
            this.nomeprodutoresumido,
            this.codigobarra, 
            this.id_unidade,
            this.id_grupo];

        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_produto = resultado[0].id_produto;
        }
        return null;
    }

    public async update():Promise<Produto|null>
    {
        let sql = `UPDATE produto SET nomeproduto = $1, nomeprodutoresumido = $2, codigobarra = $3, id_unidade = $4, id_grupo = $5 WHERE id_produto = $6;`;    
        let params = [this.nomeproduto, this.nomeprodutoresumido, this.codigobarra, this.id_unidade, this.id_grupo, this.id_produto];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this;
        }
        return null;
    }

    public async delete():Promise<Produto|null>
    {
        let sql = `DELETE FROM produto WHERE id_produto = $1 RETURNING id_produto;`;
        let resultado = await dbQuery(sql, [this.id_produto]);
        if (resultado.length > 0)
        {
            this.id_produto = resultado[0].id_produto;
            return this;
        }

        return null;     
    }

    static async listaUmPorNome(nomeProduto: any): Promise<Produto | null>
    {
        let buscaProduto = "%"+nomeProduto+"%"
        let sql = 'SELECT * FROM produto WHERE nomeproduto ILIKE $1 LIMIT 1'
        let resultado = await dbQuery(sql, [buscaProduto])

        if (resultado.length > 0)
        {
            let newProduto = new Produto()
            Object.assign(newProduto, resultado[0])
            return newProduto
        }

        return null
    }
}
