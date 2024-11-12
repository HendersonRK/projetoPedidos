import { dbQuery } from "../database";

export class Marca
{
    id_marca: number = 0;
    descricaomarca: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.descricaomarca.length == 0)
        {
            errors.push("Descrição da marca é obrigatória!")
        }
        return errors;
    }

     static async listarTodasMarcas():Promise<Marca[]>
    {
        let sql = `SELECT * FROM marca ORDER BY id_marca;`;
        let resultado = await dbQuery(sql);
        let marcas : Marca[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let marca = new Marca();
            Object.assign(marca, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            marcas.push(marca)
        }
        return marcas
    }

    static async listaUmaMarcaPorId(idMarca: number): Promise<Marca | null>
    {
        let id = Number(idMarca)
        let sql =  `SELECT * FROM marca WHERE id_marca = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);
        
        if (resultado.length > 0)
        {
            let marca = new Marca()
            Object.assign(marca, resultado[0]) //atribui o resultado a instancia da classe
            return marca
        }
        return null;
    }

    public async insert():Promise<Marca | null>
    {
        let sql = `INSERT INTO marca (id_marca, descricaomarca) VALUES (default, $1) RETURNING id_marca;`;

        let params = [this.descricaomarca];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_marca = resultado[0].id_marca;
        }
        return null;
    }

    public async update():Promise<Marca | null>
    {
        let sql = `UPDATE marca SET descricaomarca = $1 WHERE id_marca = $2;`;    
        let params = [this.descricaomarca, this.id_marca];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this;
        }
        return null;
    }

    public async delete():Promise<Marca | null>
    {
        let sql = `DELETE FROM marca WHERE id_marca = $1 RETURNING id_marca;`;
        let resultado = await dbQuery(sql, [this.id_marca]);
        if (resultado.length > 0)
        {
            this.id_marca = resultado[0].id_marca;
            return this;
        }

        return null;     
    }
}
