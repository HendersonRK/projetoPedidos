const apiUrlGrupoProduto = "http://localhost:3000"
const modalGrupoProduto = document.querySelector('.modal-container')

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravarGrupoProduto();
    }
}

function openModal(editar = false, id)
{
    modalGrupoProduto.classList.add('active')

    modalGrupoProduto.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalGrupoProduto.classList.remove('active')
        }        
    }

    if (editar)
    {
        carregaGrupoProduto(id)
    }
    else
    {
        document.getElementById('idgrupoproduto').value = ''
        document.getElementById('descricaogrupoproduto').value = ''
    }
}

//funções de comunicação com back-end
async function gravarGrupoProduto() 
{
    let id = document.getElementById('idgrupoproduto').value
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? '/grupoproduto' : '/grupoproduto/'+id
    
    let grupoProduto = {
        "descricaogrupoproduto" : document.getElementById('descricaogrupoproduto').value
    }

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(grupoProduto),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlGrupoProduto+url, options)
    let grupoProdutoResult = await result.json();

    if (grupoProdutoResult.descricaogrupoproduto)
    {
        alert("Grupo do Produto cadastrado com sucesso");
        window.location.reload();
    }
    else
    {
        alert("Erro ao cadastradar Grupo!")
    }
}

async function listarGrupoProduto() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };

    let result = await fetch (apiUrlGrupoProduto+'/grupoproduto', options)
    let grupoProdutos = await result.json()
    
    return grupoProdutos
}

async function motaTabelaGrupoProduto() 
{
    let html = ''
    let resultados = await listarGrupoProduto()

    for (let index = 0; index < resultados.length; index++)
    {
        let grupoProduto = resultados[index]
        let btnExcluir = `<button class="btnexcluir" onclick="excluirGrupoProduto(${grupoProduto.id_grupoproduto})">Excluir</button>`
        let btnEditar = `<button class="btneditar" onclick="editarGrupoProduto(${grupoProduto.id_grupoproduto})">Editar</button>`
        
        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExcluir}</td>
            <td>${grupoProduto.id_grupoproduto}</td>
            <td>${grupoProduto.descricaogrupoproduto}</td>
        </tr>`
    }
    document.getElementById('tbody-grupoproduto').innerHTML = html
}

async function montaSelectGrupoProduto() 
{
    let resultado = await listarGrupoProduto()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let grupoProduto = resultado[index]
        html += `<option value="${grupoProduto.id_grupoproduto}">${grupoProduto.descricaogrupoproduto}</option>`
    }

    document.getElementById('selectgrupoproduto').innerHTML = html
}

async function excluirGrupoProduto(id) 
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

        let result = await fetch(apiUrlGrupoProduto+'/grupoproduto/'+id, options);
        let json = await result.json();

        if(json.OK = true)
        {
            alert("Grupo Produto EXCLUIDA com sucesso!")
            window.location.reload();
        }
        else
        {
            alert("Problema ao excluir Grupo, contate o suporte técnico!")
        }
    }
}

async function carregaGrupoProduto(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlGrupoProduto+'/grupoproduto/'+id, options)
        let grupoProduto = await result.json();
 
        document.getElementById('idgrupoproduto').value = grupoProduto.id_grupoproduto;
        document.getElementById('descricaogrupoproduto').value = grupoProduto.descricaogrupoproduto;
    }
}

async function editarGrupoProduto(id) 
{
    openModal(true, id)   
}
