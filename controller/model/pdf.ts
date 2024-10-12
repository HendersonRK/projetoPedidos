import puppeteer from "puppeteer";
import { UnidadeProduto } from '../controller/model/unidadeproduto';

async function geraPdf() 
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
        let unidadeProduto = pdfBuffer[index]
        
        html += `
            <tr>
                <td>${unidadeProduto.id_unidadeproduto}</td>
                <td>${unidadeProduto.descricaouniproduto}</td>
            </tr>`
    }

    await page.setContent(html)

    //return pdfBuffer
}

async function pdf() 
{
    let resultado = 
    for (let index = 0; index < resultado.length; index++)
    {
        let unidadeProduto = resultado[index]
       
        html += `
        <tr>
            <td>${unidadeProduto.id_unidadeproduto}</td>
            <td>${unidadeProduto.descricaouniproduto}</td>
        </tr>`
    }

    let pdfBuffer = await geraPdf(html)
    fs.writeFileSync('UnidadeProdutos.pdf', pdfBuffer)
}