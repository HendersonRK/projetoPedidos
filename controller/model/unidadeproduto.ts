import { dbQuery } from "../database";
import puppeteer from "puppeteer";

export class UnidadeProduto
{
    id_unidadeproduto: number = 0;
    descricaouniproduto: string = "";

    validate()
    {
        let errors: string[]=[];

        if (this.descricaouniproduto.length == 0)
        {
            errors.push("Descrição da Unidade é obrigatória!")
        }
        return errors;
    }

    static async listarTodas():Promise<UnidadeProduto[]>
    {
        let sql = `SELECT * FROM unidadeproduto ORDER BY id_unidadeproduto;`;
        let resultado = await dbQuery(sql);
        let unidadesProduto : UnidadeProduto[] = []

        for(let index = 0; index < resultado.length; index++)
        {
            let json = resultado[index]
            let unidadeProduto = new UnidadeProduto();
            Object.assign(unidadeProduto, json)//preenche os dados do objeto formaPagamento, com os elementos dentro do JSON
            unidadesProduto.push(unidadeProduto)
        }
        return unidadesProduto
    }

    static async listaUmaPorId(id_uProduto: number): Promise<UnidadeProduto | null>
    {
        let id = Number(id_uProduto)
        let sql =  `SELECT * FROM unidadeproduto WHERE id_unidadeproduto = $1 LIMIT 1;`;
        
        let resultado = await dbQuery(sql, [id]);
        if (resultado.length > 0)
        {
            let unidadeProduto = new UnidadeProduto()
            Object.assign(unidadeProduto, resultado[0]) //atribui o resultado a instancia da classe
            return unidadeProduto
        }
        return null;
    }

    static async listaUmPorNome(nomeUProduto: any): Promise<UnidadeProduto|null>
    {
        let nomeUnidade = "%"+nomeUProduto+"%"
        let sql =  `SELECT * FROM unidadeproduto WHERE descricaouniproduto ILIKE $1 LIMIT 1;`;        
        let resultado = await dbQuery(sql, [nomeUnidade]);

        if (resultado.length > 0)
        {
            let newUnidade = new UnidadeProduto()
            Object.assign(newUnidade, resultado[0]) //atribui o resultado a instancia da classe
            return newUnidade
        }
        return null;
        
    }

    public async insert():Promise<UnidadeProduto|null>
    {
        let sql = `INSERT INTO unidadeproduto (descricaouniproduto) VALUES ($1) RETURNING id_unidadeproduto;`;

        let params = [this.descricaouniproduto];
        let resultado = await dbQuery(sql, params);

        if (resultado.length >0)
        {
            this.id_unidadeproduto = resultado[0].id_unidadeproduto;
        }
        return null;
    }

    public async update():Promise<UnidadeProduto|null>
    {
        let sql = `UPDATE unidadeproduto SET descricaouniproduto = $1 WHERE id_unidadeproduto = $2;`;    
        let params = [this.descricaouniproduto, this.id_unidadeproduto];

        let resultado = await dbQuery(sql,params);
        
        if(resultado)
        {
            return this;
        }
        return null;
    }

    public async delete():Promise<UnidadeProduto|null>
    {
        let sql = `DELETE FROM unidadeproduto WHERE id_unidadeproduto = $1 RETURNING id_unidadeproduto;`;
        let resultado = await dbQuery(sql, [this.id_unidadeproduto]);
        if (resultado.length > 0)
        {
            this.id_unidadeproduto = resultado[0].id_unidadeproduto;
            return this;
        }

        return null;     
    }

   /* public async geraPdf() 
    {
        let html = ''
        const browser = await puppeteer.launch({headless:true})
        const page = await browser.newPage();
        await page.setViewport({width: 1366, height: 768})
    
        const pdfBuffer = await page.pdf()

        await page.close()
        await browser.close()

        for (let index = 0; index < pdfBuffer.length; index++)
        {
            let unidadeProduto = new UnidadeProduto()
            unidadeProduto = pdfBuffer[index]
        
            html += `
                <tr>
                    <td>${unidadeProduto.id}</td>
                    <td>${unidadeProduto.descricaouniproduto}</td>
                </tr>`
        }

        await page.setContent(html)

    //return pdfBuffer
    }*/

}
