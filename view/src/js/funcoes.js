export const apiUrl = "http://localhost:3000"

import { listarUnidadeProduto } from "./unidadeproduto"

async function montaSelectUnidadeProduto()
{
    let resultado = await listarUnidadeProduto()

    let html = ''  

    for (let index = 0; index < resultado.length; index++)
    {
        let unidadeProduto = resultado[index]
        
        html += `<option value="${resultado.id_unidadeproduto}>${resultado.descricaouniproduto}</option>"`
    }
    document.getElementById('unidadeproduto').innerHTML = html
}