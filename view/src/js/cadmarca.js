const apiUrlMarca = "http://localhost:3000"
const modalMarca = document.querySelector('.modal-container')

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravarMarca();
    }
}

function openModalMarca(editar = false, id)
{
    modalMarca.classList.add('active')

    modalMarca.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalMarca.classList.remove('active')
        }
    }

    if (editar)
    {
        carregaMarca(id)                
    }
    else
    {
        document.getElementById('idmarca').value = '';
        document.getElementById('descricaomarca').value = '';
    }
}

//funções de comunicação com back-end
async function gravarMarca() 
{
    let id = document.getElementById('idmarca').value
    let method = id === '' ? 'POST' : 'PUT'
    let url = id === '' ? "/marcaproduto" : "/marcaproduto/"+id;
    
    let marca = {
        "descricaomarca": document.getElementById('descricaomarca').value
    };

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(marca),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlMarca+url, options);
    let marcaResult = await result.json();

    if (marcaResult.id_marca)
    {
        alert('Marca de produto cadastrada com sucesso!')
        window.location.reload();
    }
    else
    {
        alert('Erro ao cadastrar marca de produto, verifique os dados digitados!')
    }
}

async function listarMarca() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrlMarca+'/marcaproduto', options);
    let marcas = await result.json();
    
    return marcas
}

async function montaTabelaMarca() 
{
    let html = ''
    let resultado = await listarMarca()
    for (let index = 0; index < resultado.length; index++)
    {        
        let marca = resultado[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirMarca(${marca.id_marca})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarMarca(${marca.id_marca})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${marca.id_marca}</td>
            <td>${marca.descricaomarca}</td>
        </tr> `
    }
    document.getElementById('tbody-marcas').innerHTML = html;
}

async function montaSelectMarca() 
{
    let resultado = await listarMarca()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let marca = resultado[index]
        html += `<option value="${marca.id_marca}">${marca.descricaomarca}</option>`
    }

    document.getElementById('selectmarca').innerHTML = html
}

async function excluirMarca(id) 
{
    if (confirm("Deseja excluir a Marca de Produto?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };
        
        let result = await fetch(apiUrlMarca+'/marcaproduto/'+id, options)
        let json = await result.json();

        if (json.OK === true)
        {
            alert("Marca EXCLUIDA com sucesso!")
            window.location.reload();
        }
        else
        {
            alert('Problema ao EXCLUIR marca de produto, contate o suporte técnico!')
        }
    }
}

async function carregaMarca(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlMarca+"/marcaproduto/"+id, options)
        let marca= await result.json();
 
        document.getElementById('idmarca').value = marca.id_marca
        document.getElementById('descricaomarca').value = marca.descricaomarca
    }
}

async function editarMarca(id) 
{
    openModalMarca(true, id)   
}