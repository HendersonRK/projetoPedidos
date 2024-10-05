import { dbQuery } from "../database";

export class GrupoProduto
{
    id_grupoproduto: number = 0;
    descricaogrupoproduto: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.descricaogrupoproduto.length == 0)
        {
            errors.push("Descrição do grupo é obrigatória!")
        }
        return errors;
    }

     static async listarTodos():Promise<GrupoProduto[]>
    {
        let sql = `SELECT * FROM grupoproduto ORDER BY id_grupoproduto;`;
        let resultado = await dbQuery(sql);
        let grupoProdutos : GrupoProduto[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let grupoProduto = new GrupoProduto();
            Object.assign(grupoProduto, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            grupoProdutos.push(grupoProduto)
        }
        return grupoProdutos
    }

    static async listaUmPorId(id_gProduto: number): Promise<GrupoProduto|null>
    {
        let id = Number(id_gProduto)
        let sql =  `SELECT * FROM grupoproduto WHERE id_grupoproduto = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);
        if (resultado.length > 0)
        {
            let grupoProduto = new GrupoProduto()
            Object.assign(grupoProduto, resultado[0]) //atribui o resultado a instancia da classe
            return grupoProduto
        }
        return null;
    }

    public async insert():Promise<GrupoProduto|null>
    {
        let sql = `INSERT INTO grupoproduto (id_grupoproduto, descricaogrupoproduto) VALUES (default, $1) RETURNING id_grupoproduto;`;

        let params = [this.descricaogrupoproduto];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_grupoproduto = resultado[0].id_grupoproduto;
        }
        return null;
    }

    public async update():Promise<GrupoProduto|null>
    {
        let sql = `UPDATE grupoproduto SET descricaogrupoproduto = $1 WHERE id_grupoproduto = $2;`;    
        let params = [this.descricaogrupoproduto, this.id_grupoproduto];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this;
        }
        return null;
    }

    public async delete():Promise<GrupoProduto|null>
    {
        let sql = `DELETE FROM grupoproduto WHERE id_grupoproduto = $1 RETURNING id_grupoproduto;`;
        let resultado = await dbQuery(sql, [this.id_grupoproduto]);
        if (resultado.length > 0)
        {
            this.id_grupoproduto = resultado[0].id_grupoproduto;
            return this;
        }

        return null;     
    }
}
