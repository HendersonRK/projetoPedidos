const apiUrl = "http://localhost:3000"
const modal = document.querySelector('.modal-container')

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravaFrmPagamento();
    }
}

function openModalFormaPagamento(editar = false, id)
{
    modal.classList.add('active')

    modal.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modal.classList.remove('active')
        }
    }

    if (editar)
    {
        carregaFormaPagamento(id)                
    }
    else
    {
        document.getElementById('idformapagamento').value = '';
        document.getElementById('descricaofrmpagamento').value = '';
    }
}

//funções de comunicação com back-end
async function gravaFrmPagamento() 
{
    let id = document.getElementById('idformapagamento').value
    let method = id === '' ? 'POST' : 'PUT'
    let url = id === '' ? "/formapagamento" : "/formapagamento/"+id;
    
    let formapagamento = {
        "descricaofrmpagamento": document.getElementById('descricaofrmpagamento').value
    };

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(formapagamento),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrl+url, options);
    let formaPagamentoResult = await result.json();

    if (formaPagamentoResult.descricaofrmpagamento)
    {
        alert('Forma de Pagamento cadastrada com sucesso!')
        window.location.reload();
    }
    else
    {
        alert('Erro ao cadastrar Forma de Pagamento, verifique os dados digitados!')
    }
}

async function listarFrmPagamento(buscaFormaPagamneto='') 
{
    let url = buscaFormaPagamneto === '' ? '/formapagamento' : '/formapagamento/buscapornome/'+buscaFormaPagamneto

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrl+url, options);
    let formasPagamento = await result.json();
    
    return formasPagamento    
}

async function montaTabelaFormaPagamento(buscaFormaPagamneto) 
{ 
    let html = ''
    let resultado = await listarFrmPagamento(buscaFormaPagamneto)
    for (let index = 0; index < resultado.length; index++)
    {        
        let formaPagamento = resultado[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirFormaPagamento(${formaPagamento.id_frmpagamento})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarFormaPagamento(${formaPagamento.id_frmpagamento})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${formaPagamento.id_frmpagamento}</td>
            <td>${formaPagamento.descricaofrmpagamento}</td>
        </tr> `
    }
    document.getElementById('tbody-frmpagamento').innerHTML = html;
}

async function montaSelectFormaPagamento() 
{
    let resultado = await listarFrmPagamento()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let formaPagamento = resultado[index]
        html += `<option value="${formaPagamento.id_frmpagamento}">${formaPagamento.descricaofrmpagamento}</option>`
    }

    document.getElementById('selectformapagamento').innerHTML = html
}


async function excluirFormaPagamento(id) 
{
    if (confirm("Deseja excluir forma de pagamento?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };
        
        let result = await fetch(apiUrl+'/formapagamento/'+id, options)
        let json = await result.json();

        if (json.OK === true)
        {
            alert("Forma de pagamento EXCLUIDA com sucesso!")
            window.location.reload();
        }
        else
        {
            alert('Problema ao EXCLUIR forma de pagamento, contate o suporte técnico!')
        }
    }
}

async function carregaFormaPagamento(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrl+"/formapagamento/"+id, options)
        let formaPagamento = await result.json();
 
        document.getElementById('idformapagamento').value = formaPagamento.id_frmpagamento
        document.getElementById('descricaofrmpagamento').value = formaPagamento.descricaofrmpagamento
    }
}

async function editarFormaPagamento(id) 
{
    openModalFormaPagamento(true, id)   
}

function buscaFormaPagamentoPorNome() 
{
    let nomeBusca = document.getElementById('campopesquisa').value
    montaTabelaFormaPagamento(nomeBusca)    
}