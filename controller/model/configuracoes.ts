import { client, dbQuery } from '../database';

export class Configuracoes
{
    id_configuracao: number = 0
    hostname: string = ''
    emailretorno: string = ''
    porta: number = 0
    emailusername: string = ''
    emailpassword: string = ''


    static async listarConfiguracoes():Promise<Configuracoes>
    {
        let sql = `SELECT * FROM configuracoes;`;
        let resultado = await dbQuery(sql);
        
        let newConfiguracao = new Configuracoes();
        Object.assign(newConfiguracao, resultado[0])//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
        
        return newConfiguracao
    }

    public async update():Promise<Configuracoes|null>
    {
        let sql = `UPDATE configuracoes SET hostname = $1, emailretorno = $2, porta = $3, emailusername = $4, emailpassword = $5 WHERE id_configuracao = 1 RETURNING id_configuracao;`;    
        let params = [this.hostname, this.emailretorno, this.porta, this.emailusername, this.emailpassword];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this;
        }
        return null;
    }
}