import { client, dbQuery } from '../database';

export class TipoFrete
{
    id_tipofrete: number = 0;
    tipofrete: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.tipofrete.length == 0)
        {
            errors.push("Descrição do tipo de frete é obrigatório!")
        }
        return errors;
    }

    static async listarTodos():Promise<TipoFrete[]>
    {
        let sql = `SELECT * FROM tipofrete ORDER BY id_tipofrete;`;
        let resultado = await dbQuery(sql);
        let tiposfrete : TipoFrete[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let tipoFrete = new TipoFrete();
            Object.assign(tipoFrete, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            tiposfrete.push(tipoFrete)
        }
        return tiposfrete
    }

    static async listaUmPorId(id_tFrete: number): Promise<TipoFrete | null>
    {
        let id = Number(id_tFrete)
        let sql =  `SELECT * FROM tipofrete WHERE id_tipofrete = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);

        if (resultado.length > 0)
        {
            let tipoFrete = new TipoFrete()
            Object.assign(tipoFrete, resultado[0]) //atribui o resultado a instancia da classe
            return tipoFrete
        }
        return null;
    }

    public async insert():Promise<TipoFrete | null>
    {
        let sql = `INSERT INTO tipofrete (tipofrete) VALUES ($1) RETURNING id_tipofrete;`

        let params = [this.tipofrete];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_tipofrete = resultado[0].id_tipofrete;
        }
        return null;
    }

    public async update():Promise<TipoFrete|null>
    {
        let sql = `UPDATE tipofrete SET tipofrete = $1 WHERE id_tipofrete = $2;`   
        let params = [this.tipofrete, this.id_tipofrete];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<TipoFrete|null>
    {
        let sql = `DELETE FROM tipofrete WHERE id_tipofrete = $1 RETURNING id_tipofrete;`;
        let resultado = await dbQuery(sql, [this.id_tipofrete])
        if (resultado.length > 0)
        {
            this.id_tipofrete = resultado[0].id_tipofrete
            return this
        }
        return null        
    }
}