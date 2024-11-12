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
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? "/formapagamento" : "/formapagamento/"+id;
    
    let formapagamento = {
        "descricaofrmpagamento": document.getElementById('descricaofrmpagamento').value
    };

    let result = await myPost(url, method, formapagamento)

    if (result.descricaofrmpagamento)
    {
        alert('Forma de Pagamento cadastrada com sucesso!')
        window.location.reload();
    }
    else
    {
        alert('Erro ao cadastrar Forma de Pagamento, verifique os dados digitados!')
    }
}

async function listarFrmPagamento(buscaFormaPagamento='') 
{
    let url = buscaFormaPagamento == '' ? '/formapagamento' : '/formapagamento/buscapornome/'+buscaFormaPagamento
    
    let result = await myGet(url)
    
    return result    
}

async function montaTabelaFormaPagamento(buscaFormaPagamento) 
{ 
    let html = ''
    let resultado = await listarFrmPagamento(buscaFormaPagamento)
    
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
        let url = '/formapagamento/'+id
        let result = await myGet(url, 'DELETE')

        if (result.OK === true)
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
        let url = '/formapagamento/'+id
        let result = await myGet(url)
 
        document.getElementById('idformapagamento').value = result.id_frmpagamento
        document.getElementById('descricaofrmpagamento').value = result.descricaofrmpagamento
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