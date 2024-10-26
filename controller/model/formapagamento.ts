import { client, dbQuery } from '../database';

export class FormaPagamento
{
    id_frmpagamento: number = 0;
    descricaofrmpagamento: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.descricaofrmpagamento.length == 0)
        {
            errors.push("Descrição da Forma de Pagamento é obrigatória!")
        }
        return errors;
    }

    static async listarTodas():Promise<FormaPagamento[]>
    {
        let sql = `SELECT * FROM formapagamento ORDER BY id_frmpagamento;`;
        let resultado = await dbQuery(sql);
        let formasPagamento : FormaPagamento[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let formaPagamento = new FormaPagamento();
            Object.assign(formaPagamento, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            formasPagamento.push(formaPagamento)
        }
        return formasPagamento
    }

    static async listaUmaPorId(id_fPagamento: number): Promise<FormaPagamento | null>
    {
        let id = Number(id_fPagamento)
        let sql =  `SELECT * FROM formapagamento WHERE id_frmpagamento = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);

        if (resultado.length > 0)
        {
            let formaPagamento = new FormaPagamento()
            Object.assign(formaPagamento, resultado[0]) //atribui o resultado a instancia da classe
            return formaPagamento
        }
        return null;
    }

    public async insert():Promise<FormaPagamento|null>
    {
        let sql = `INSERT INTO formapagamento (descricaofrmpagamento) VALUES ($1) RETURNING id_frmpagamento;`;

        let params = [this.descricaofrmpagamento];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_frmpagamento = resultado[0].id_frmpagamento;
        }
        return null;
    }

    public async update():Promise<FormaPagamento|null>
    {
        let sql = `UPDATE formapagamento SET descricaofrmpagamento = $1 WHERE id_frmpagamento = $2;`;    
        let params = [this.descricaofrmpagamento, this.id_frmpagamento];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this
        }
        return null
    }

    public async delete():Promise<FormaPagamento|null>
    {
        let sql = `DELETE FROM formapagamento WHERE id_frmpagamento = $1 RETURNING id_frmpagamento;`;
        let resultado = await dbQuery(sql, [this.id_frmpagamento])
        if (resultado.length > 0)
        {
            this.id_frmpagamento = resultado[0].id_formapagamento
            return this
        }
        return null        
    }

    static async listaUmPorNome(nomeBusca: any): Promise<FormaPagamento | null> 
    {
        let nomeFormaPagamento = "%"+nomeBusca+"%"
        let sql = `SELECT * FROM formapagamento WHERE descricaofrmpagamento ILIKE $1 LIMIT 1;`
        let resultado = await dbQuery(sql, [nomeFormaPagamento])

        if (resultado.length > 0)
        {
            let newFormaPagamento = new FormaPagamento()
            Object.assign(newFormaPagamento, resultado[0])
            return newFormaPagamento
        }
        return null
    }
}