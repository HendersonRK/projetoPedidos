import { client, dbQuery } from '../database';

export class PrazoPagamento
{
    id_prazopagamento: number = 0;
    prazopagamento: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.prazopagamento.length == 0)
        {
            errors.push("Prazo de pagamento é campo obrigatório!")
        }
        return errors;
    }

    static async listarTodos():Promise<PrazoPagamento[]>
    {
        let sql = `SELECT * FROM prazopagamento ORDER BY id_prazopagamento;`;
        let resultado = await dbQuery(sql);
        let prazosPagamento : PrazoPagamento[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let prazoPagamento = new PrazoPagamento()
            Object.assign(prazoPagamento, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            prazosPagamento.push(prazoPagamento)
        }
        return prazosPagamento
    }

    static async listaUmPorId(id_pPagamento: number): Promise<PrazoPagamento | null>
    {
        let id = Number(id_pPagamento)
        let sql =  `SELECT * FROM prazopagamento WHERE id_prazopagamento = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);

        if (resultado.length > 0)
        {
            let prazoPagamento = new PrazoPagamento()
            Object.assign(prazoPagamento, resultado[0]) //atribui o resultado a instancia da classe
            return prazoPagamento
        }
        return null;
    }

    public async insert():Promise<PrazoPagamento | null>
    {
        let sql = `INSERT INTO prazopagamento (prazopagamento) VALUES ($1) RETURNING id_prazopagamento;`;

        let params = [this.prazopagamento];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_prazopagamento = resultado[0].id_prazopagamento
        }
        return null;
    }

    public async update():Promise<PrazoPagamento | null>
    {
        let sql = `UPDATE prazopagamento SET prazopagamento = $1 WHERE id_prazopagamento = $2;`;    
        let params = [this.prazopagamento, this.id_prazopagamento];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<PrazoPagamento | null>
    {
        let sql = `DELETE FROM prazopagamento WHERE id_prazopagamento = $1 RETURNING id_prazopagamento;`;
        let resultado = await dbQuery(sql, [this.id_prazopagamento])
        if (resultado.length > 0)
        {
            this.id_prazopagamento = resultado[0].id_prazopagamento
            return this
        }
        return null        
    }
}