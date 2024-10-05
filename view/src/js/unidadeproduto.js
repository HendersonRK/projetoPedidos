const modalUnidade = document.querySelector('.modal-container')
const apiUrlUnidade = "http://localhost:3000"

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravarUnidadeProduto();
    }
}

function openModal (editar = false, id)
{
    modalUnidade.classList.add('active')

    modalUnidade.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalUnidade.classList.remove('active')
        }        
    }

    if (editar)
    {
        carregaUnidadeProduto(id);
    }
    else
    {
        document.getElementById('idunidadeproduto').value = ''
        document.getElementById('descricaouniproduto').value = ''
    }
}

//funções de comunicação com back-end
async function gravarUnidadeProduto() 
{
    let id = document.getElementById('idunidadeproduto').value
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? '/unidadeproduto' : '/unidadeproduto/'+id
    
    let unidadeProduto = {
        "descricaouniproduto" : document.getElementById('descricaouniproduto').value
    }

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(unidadeProduto),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlUnidade+url, options)
    let unidadeProdutoResult = await result.json();

    if (unidadeProdutoResult.descricaouniproduto)
    {
        alert("Unidade Cadastrada com sucesso");
        window.location.reload();
    }
    else
    {
        alert("Erro ao cadastradar Unidade!")
    }
}

async function listarUnidadeProduto() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };

    let result = await fetch (apiUrlUnidade+'/unidadeproduto', options)
    let unidadesProdutos = await result.json()
    
    return unidadesProdutos
}

async function montaTabela()
{
    let resultado = await listarUnidadeProduto()

    let html = ''  

    for (let index = 0; index < resultado.length; index++)
    {
        let unidadeProduto = resultado[index]
        let btnExcluir = `<button class="btnexcluir" onclick="excluirUnidadeProduto(${unidadeProduto.id_unidadeproduto})">Excluir</button>`
        let btnEditar = `<button class="btneditar" onclick="editarUnidadeProduto(${unidadeProduto.id_unidadeproduto})">Editar</button>`
        
        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExcluir}</td>
            <td>${unidadeProduto.id_unidadeproduto}</td>
            <td>${unidadeProduto.descricaouniproduto}</td>
        </tr>`
    }
    document.getElementById('tbody-unidadeprodutos').innerHTML = html
}

async function montaSelectUnidadeProduto()
{
    let resultado = await listarUnidadeProduto()

    let html = ''  

    for (let index = 0; index < resultado.length; index++)
    {
        let unidadeProduto = resultado[index]
        
        html += `<option value="${unidadeProduto.id_unidadeproduto}">${unidadeProduto.descricaouniproduto}</option>"`
    }
    document.getElementById('selectunidadeproduto').innerHTML = html
}

async function excluirUnidadeProduto(id) 
{
    if (confirm("Deseja realmente excluir o cadastro?"))  
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };

        let result = await fetch(apiUrlUnidade+'/unidadeproduto/'+id, options);
        let json = await result.json();

        if(json.OK = true)
        {
            alert("Unidade Produto EXCLUIDA com sucesso!")
            window.location.reload();
        }
        else
        {
            alert("Problema ao excluir Unidade, contate o suporte técnico!")
        }
    }
}

async function carregaUnidadeProduto(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlUnidade+'/unidadeproduto/'+id, options)
        let unidadeProduto = await result.json();
 
        document.getElementById('idunidadeproduto').value = unidadeProduto.id_unidadeproduto;
        document.getElementById('descricaouniproduto').value = unidadeProduto.descricaouniproduto;
    }
}

async function editarUnidadeProduto(id) 
{
    openModal(true, id)   
}
