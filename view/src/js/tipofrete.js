const apiUrlTipoFrete = "http://localhost:3000"
const modalTipoFrete = document.querySelector('.modal-container')

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravaFrmPagamento();
    }
}

function openModalTipoFrete(editar = false, id)
{
    modalTipoFrete.classList.add('active')

    modalTipoFrete.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalTipoFrete.classList.remove('active')
        }
    }

    if (editar)
    {
        carregaTipoFrete(id)                
    }
    else
    {
        document.getElementById('idtipofrete').value = '';
        document.getElementById('descricaotipofrete').value = '';
    }
}

//funções de comunicação com back-end
async function gravarTipoFrete() 
{
    let id = document.getElementById('idtipofrete').value
    let method = id === '' ? 'POST' : 'PUT'
    let url = id === '' ? "/tipofrete" : "/tipofrete/"+id;
    
    let tipoFrete = {
        "tipofrete": document.getElementById('descricaotipofrete').value
    };

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(tipoFrete),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlTipoFrete+url, options);
    let tipoFreteResult = await result.json();

    if (tipoFreteResult.tipofrete)
    {
        alert('Tipo de frete cadastrado com sucesso!')
        window.location.reload();
    }
    else
    {
        alert('Erro ao cadastrar tipo de frete, verifique os dados digitados!')
    }
}

async function listarTipoFrete() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrlTipoFrete+'/tipofrete', options);
    let tiposFrete = await result.json();
    
    return tiposFrete
}

async function montaTabelaTipoFrete() 
{
    let html = ''
    let resultado = await listarTipoFrete()
    for (let index = 0; index < resultado.length; index++)
    {        
        let tipoFrete = resultado[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirTipoFrete(${tipoFrete.id_tipofrete})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarTipoFrete(${tipoFrete.id_tipofrete})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${tipoFrete.id_tipofrete}</td>
            <td>${tipoFrete.tipofrete}</td>
        </tr> `
    }
    document.getElementById('tbody-tipofrete').innerHTML = html;
}

async function montaSelectTipoFrete() 
{
    let resultado = await listarTipoFrete()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let tipoFrete = resultado[index]
        html += `<option value="${tipoFrete.id_tipofrete}">${tipoFrete.tipofrete}</option>`
    }

    document.getElementById('selecttipofrete').innerHTML = html
}

async function excluirTipoFrete(id) 
{
    if (confirm("Deseja excluir Tipo Frete?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };
        
        let result = await fetch(apiUrlTipoFrete+'/tipofrete/'+id, options)
        let json = await result.json();

        if (json.OK === true)
        {
            alert("Tipo de Frete EXCLUIDO com sucesso!")
            window.location.reload();
        }
        else
        {
            alert('Problema ao EXCLUIR tipo de frete, contate o suporte técnico!')
        }
    }
}

async function carregaTipoFrete(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlTipoFrete+"/tipofrete/"+id, options)
        let tipoFrete = await result.json();
 
        document.getElementById('idtipofrete').value = tipoFrete.id_tipofrete
        document.getElementById('descricaotipofrete').value = tipoFrete.tipofrete
    }
}

async function editarTipoFrete(id) 
{
    openModal(true, id)   
}