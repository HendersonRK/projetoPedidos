const apiUrlPrazoPagamento = "http://localhost:3000"
const modalPrazoPagamento = document.querySelector('.modal-container')

//funções do frontend
function pressEnter()
{
    if (event.key == 'Enter')
    {
        gravaFrmPagamento();
    }
}

function openModalPrazoPagamento(editar = false, id)
{
    modalPrazoPagamento.classList.add('active')

    modalPrazoPagamento.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalPrazoPagamento.classList.remove('active')
        }
    }

    if (editar)
    {
        carregaPrazoPagamento(id)                
    }
    else
    {
        document.getElementById('idprazopagamento').value = '';
        document.getElementById('descricaoprazopagamento').value = '';
    }
}

//funções de comunicação com back-end
async function gravaPrazoPagamento() 
{
    let id = document.getElementById('idprazopagamento').value
    let method = id === '' ? 'POST' : 'PUT'
    let url = id === '' ? "/prazopagamento" : "/prazopagamento/"+id;
    
    let prazopagamento = {
        "descricaoprazopagamento": document.getElementById('descricaoprazopagamento').value
    };

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: method,
        body: JSON.stringify(prazopagamento),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch (apiUrlPrazoPagamento+url, options);
    let prazoPagamentoResult = await result.json();

    if (prazoPagamentoResult.prazopagamento)
    {
        alert('Prazo de Pagamento cadastrado com sucesso!')
        window.location.reload();
    }
    else
    {
        alert('Erro ao cadastrar Prazo de Pagamento, verifique os dados digitados!')
    }
}

async function listarPrazoPagamento() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrlPrazoPagamento+'/prazopagamento', options);
    let prazosPagamento = await result.json();
    
    return prazosPagamento
}

async function montaTabelaPrazoPagamento() 
{
    let html = ''
    let resultado = await listarPrazoPagamento()

    for (let index = 0; index < resultado.length; index++)
    {        
        let prazoPagamento = resultado[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirPrazoPagamento(${prazoPagamento.id_prazopagamento})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarPrazoPagamento(${prazoPagamento.id_prazopagamento})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${prazoPagamento.id_prazopagamento}</td>
            <td>${prazoPagamento.prazopagamento}</td>
        </tr> `
    }
    document.getElementById('tbody-prazopagamento').innerHTML = html;
}

async function montaSelectPrazoPagamento() 
{
    let resultado = await listarPrazoPagamento()
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {
        let prazoPagamento = resultado[index]
        html += `<option value="${prazoPagamento.id_prazopagamento}">${prazoPagamento.prazopagamento}</option>`
    }

    document.getElementById('selectprazopagamento').innerHTML = html
}

async function excluirPrazoPagamento(id) 
{
    if (confirm("Deseja excluir prazo de pagamento?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };
        
        let result = await fetch(apiUrlPrazoPagamento+'/prazopagamento/'+id, options)
        let json = await result.json();

        if (json.OK === true)
        {
            alert("Prazo de pagamento EXCLUIDA com sucesso!")
            window.location.reload();
        }
        else
        {
            alert('Problema ao EXCLUIR prazo de pagamento, contate o suporte técnico!')
        }
    }
}

async function carregaPrazoPagamento(id)
{   
    if(id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
        };

        let result = await fetch(apiUrlPrazoPagamento+"/prazopagamento/"+id, options)
        let prazoPagamento = await result.json();
 
        document.getElementById('idprazopagamento').value = prazoPagamento.id_prazopagamento
        document.getElementById('descricaoprazopagamento').value = prazoPagamento.prazopagamento
    }
}

async function editarPrazoPagamento(id) 
{
    openModal(true, id)   
}