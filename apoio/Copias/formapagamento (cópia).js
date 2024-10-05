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
/*
function pegarParametro (parametro)
{
    const queryString = window.location.search;
    console.log("queryString"+queryString)
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parametro);
}*/

function openModal (editar = false, id)
{
    modal.classList.add('active')

    modal.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modal.classList.remove('active')
        }
    }

    if (editar == true)
    {
        console.log (id+'id dentro do if no open modal')
        carregaFormaPagamento(id);
                
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
    //let id = pegarParametro('id');
    let id = document.getElementById('idformapagamento').value
    console.log(id)
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? "/formapagamento" : "/formapagamento/"+id;
    
    let formapagamento = {
        "descricaofrmpagamento": document.getElementById('descricaofrmpagamento').value
    };

    console.log(formapagamento);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const options = {
        method: method,
        body: JSON.stringify(formapagamento),
        headers: myHeaders,
        redirect: "follow"
    };

     console.log('oii')
    let result = await fetch (apiUrl+url, options);
     console.log('oii 1')
    let formaPagamentoResult = await result.json();

    //console.log("resultformaPagamento.descrição"+formaPagamentoResult.descricaofrmpagamento)
    //console.log('length forma pagamento' +formaPagamentoResult.descricaofrmpagamento.value.length)

     console.log('oii 3')
    if (formaPagamentoResult.descricaofrmpagamento)
    {
        alert('Forma de Pagamento cadastrada com sucesso!')
    }
    else
    {
        alert('Erro ao cadastrar Forma de Pagamento, verifique os dados digitados!')
    }
}

async function listarFrmPagamento() 
{
    const options ={
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrl+'/formapagamento', options);
    let formasPagamento = await result.json();
    let html = '';

    for (let index = 0; index < formasPagamento.length; index++)
    {
        let formapagamento = formasPagamento[index];
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirFormaPagamento(${formapagamento.id_frmpagamento})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarFormaPagamento(${formapagamento.id_frmpagamento})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${formapagamento.id_frmpagamento}</td>
            <td>${formapagamento.descricaofrmpagamento}</td>
        </tr> `
    }
    document.getElementById('tbody-frmpagamento').innerHTML = html;
}

async function excluirFormaPagamento(id) 
{
    if (confirm("Deseja excluir forma de pagamento?"))
    {
        const options = {
            method: 'DELETE',
            redirect: 'follow'
        };
        
        let result = await fetch(apiUrl+'/formapagamento/'+id, options)
        let json = await result.json();

        if (json.OK = true)
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
    console.log("id dentro da função carregaga forma de pagamento = "+id);

    if(id != null)
    {
        let result = await fetch(apiUrl+'/formapagamento/'+id)
        let formapagamento = await result.json();
 
        document.getElementById('idformapagamento').value = formapagamento.id_frmpagamento;
        document.getElementById('descricaofrmpagamento').value = formapagamento.descricaofrmpagamento;
    }
}

async function editarFormaPagamento(id) 
{
    console.log(id+' id na função editar forma de pagamento')
    openModal(true, id)   
}

