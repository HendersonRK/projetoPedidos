const apiUrlCadCliente = "http://localhost:3000"
const modalCadCliente = document.querySelector('.modal-container')

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
    modalCadCliente.classList.add('active')

    modalCadCliente.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalCadCliente.classList.remove('active')
        }        
    }

    if (editar)
    {
        carregaCliente(id)
    }
    else
    {
        document.getElementById('idcliente').value = ''
        document.getElementById('nomecliente').value = ''
        document.getElementById('cpfcliente').value = ''
        document.getElementById('telefonecliente').value = ''
        document.getElementById('emailcliente').value = ''
    }
}

//funções de comunicação com back-end
async function gravarCliente() 
{
    let id = document.getElementById('idcliente').value
    let method = id === '' ? 'POST' : 'PUT'
    let url = id === '' ? '/cliente' : '/cliente/'+id
    
    let cliente = {
        "nomecliente" : document.getElementById('nomecliente').value,
        "cpfcliente" : document.getElementById('cpfcliente').value,
        "siglaufcliente" : document.getElementById('selectsiglauf').value,
        "cidadecliente" : document.getElementById('selectcidade').value,
        "telefonecliente" : document.getElementById('telefonecliente').value,
        "emailcliente" : document.getElementById('emailcliente').value
    }
    
    console.log(cliente)

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(cliente),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlCadCliente+url, options)
    let clienteResult = await result.json();

    if (clienteResult.id_cliente)
    {
        alert("Cliente cadastrado com sucesso");
        window.location.reload();
    }
    else
    {
        alert("Erro ao cadastradar Cliente!")
    }
}

async function listarClientes() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };

    let result = await fetch (apiUrlCadCliente+'/cliente', options)
    let clientes = await result.json()
    
    return clientes
}

async function motaTabelaClientes() 
{
    let html = ''
    let resultados = await listarClientes()

    for (let index = 0; index < resultados.length; index++)
    {
        let cliente = resultados[index]
        let btnExcluir = `<button class="btnexcluir" onclick="excluirCliente(${cliente.id_cliente})">Excluir</button>`
        let btnEditar = `<button class="btneditar" onclick="editarCliente(${cliente.id_cliente})">Editar</button>`
        
        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExcluir}</td>
            <td>${cliente.id_cliente}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.cidade}</td>
            <td>${cliente.siglauf}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.email}</td>

        </tr>`
    }
    document.getElementById('tbody-clientes').innerHTML = html
}

/*async function montaSelectGrupoProduto() 
{
    let resultado = await listarGrupoProduto()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let grupoProduto = resultado[index]
        html += `<option value="${grupoProduto.id_grupoproduto}">${grupoProduto.descricaogrupoproduto}</option>`
    }

    document.getElementById('selectgrupoproduto').innerHTML = html
}*/

async function excluirCliente(id) 
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

        let result = await fetch(apiUrlCadCliente+'/cliente/'+id, options);
        let json = await result.json();

        if(json.OK = true)
        {
            alert("Cadastro EXCLUIDO com sucesso!")
            window.location.reload();
        }
        else
        {
            alert("Problema ao excluir cadastro, contate o suporte técnico!")
        }
    }
}

async function carregaCliente(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlCadCliente+'/cliente/'+id, options)
        let cliente = await result.json();
 
        document.getElementById('idcliente').value = cliente.id_cliente
        document.getElementById('nomecliente').value = cliente.nome
        document.getElementById('cpfcliente').value = cliente.cpf
        document.getElementById('selectsiglauf').value = cliente.siglauf
        document.getElementById('selectcidade').value = cliente.cidade
        document.getElementById('telefonecliente').value = cliente.telefone
        document.getElementById('emailcliente').value = cliente.email
        
    }
}

async function editarCliente(id) 
{
    openModal(true, id)   
}

async function carregaEstados() 
{
    const url = "http://brasilapi.com.br/api/ibge/uf/v1";
    let result = await fetch(url);
    let estados = await result.json();  

    let html = '';
    
    for(let i=0; i<estados.length; i++)
    {
        let estado = estados[i];
        html += `<option value="${estado.sigla}">${estado.nome}</option>`
    }
    document.getElementById('selectsiglauf').innerHTML = html;
}

async function carregaCidades() 
{
    let sigla = document.getElementById('selectsiglauf').value;
    console.log(sigla);
    
    const url = "https://brasilapi.com.br/api/ibge/municipios/v1/"+sigla;
    let result = await fetch(url);
    let municipios = await result.json();

    let html = '';
    for(let i=0; i<municipios.length; i++)
    {
        let municipio = municipios[i];

        html += `<option value="${municipio.nome}">${municipio.nome}</option>`
    }
    document.getElementById('selectcidade').innerHTML = html;
}