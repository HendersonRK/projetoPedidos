const modalGrupoProduto = document.querySelector('.modal-container')
const apiUrlGrupoProdutos = "http://localhost:3000"

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

    let result = await myPost(url, method, grupoProduto)

    if (result.descricaogrupoproduto)
    {
        alert("Grupo do Produto cadastrado com sucesso");
        window.location.reload();
    }
    else
    {
        alert("Erro ao cadastradar Grupo!")
    }
}

async function listarGrupoProduto(buscarGrupoProduto = '') 
{
    let url = buscarGrupoProduto == '' ? '/grupoproduto' : '/grupoproduto/buscapornome/'+buscarGrupoProduto

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        headers: myHeaders,
        method: 'GET',
        redirect: "follow"
    }    

    let resultado = await fetch(apiUrlGrupoProdutos+url, options)
    return await resultado.json()
    
    return result
}

async function motaTabelaGrupoProduto(buscarGrupoProduto) 
{
    let html = ''
    let resultados = await listarGrupoProduto(buscarGrupoProduto)

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
        let url = '/grupoproduto/'+id
        let result = await myGet(url, 'DELETE') 

        if(result.OK = true)
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
        let url = '/grupoproduto/'+id
        let result = await myGet(url)
 
        document.getElementById('idgrupoproduto').value = result.id_grupoproduto;
        document.getElementById('descricaogrupoproduto').value = result.descricaogrupoproduto;
    }
}

async function editarGrupoProduto(id) 
{
    openModal(true, id)   
}
