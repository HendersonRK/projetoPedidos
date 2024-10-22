//declarações de constantes e variaveis
const apiUrlPedido = "http://localhost:3000"
const modalPedido = document.querySelector('.modal-container')

//funções 
function openModal(editar = false, id)
{
    modalPedido.classList.add('active')

    modalPedido.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalPedido.classList.remove('active')
        }
    }
    if (editar)
    {
        carregarPedido(id);
        editar == false
    }
    else
    {
        document.getElementById('idpedido').value = ''
        document.getElementById('situacaopedido').value = ''
        document.getElementById('observacaopedido').value = ''
        document.getElementById('codigocliente').value = ''
        document.getElementById('nomecliente').value = ''
    }
}

//funções de comunicação com back end.
async function gravarPedido() 
{
    let id = document.getElementById('idpedido').value
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? '/pedido' : '/pedido/'+id

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    let selectFormaPagamento = document.getElementById('selectformapagamento')
    let valorFormaPagamento = selectFormaPagamento.value

    let selectPrazoPagamento = document.getElementById('selectprazopagamento')
    let valorPrazoPagamento = selectPrazoPagamento.value
    
    let selectTipoFrete = document.getElementById('selecttipofrete')
    let valorTipoFrete = selectTipoFrete.value

    let pedido = {
        "datapedido": document.getElementById('datapedido').value,
        "situacaopedido": document.getElementById('situacaopedido').value,
        "observacaopedido": document.getElementById('observacaopedido').value,
        "id_formapagamento": valorFormaPagamento,
        "id_prazopagamento": valorPrazoPagamento,
        "id_cliente": document.getElementById('codigocliente').value,
        "id_tipofrete": valorTipoFrete
    };

    const options = {        
        method: method,
        body: JSON.stringify(pedido), 
        headers: myHeaders,       
        redirect: "follow"
    }; 

    let result = await fetch (apiUrlPedido + url, options)
    let pedidoResult = await result.json()
    console.log(pedidoResult)

    if (pedidoResult.id_pedido)
    {
        alert('Pedido cadastrado com sucesso!')
        window.location.reload()
    }
    else
    {
        alert('Erro ao cadastrar Pedido, verifique os dados digitados!')
    }
}

async function listarPedidos() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrlPedido+'/pedido', options);
    let pedidos = await result.json();
    let html = ''

    for (let index = 0; index < pedidos.length; index++)
    {        
        let pedido = pedidos[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirPedido(${pedido.id_pedido})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarPedido(${pedido.id_pedido})">Editar</button>`;
        
        var dataInput = pedido.datapedido
        data = new Date (dataInput)
        let dataPedidoFormatada = data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});


        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${pedido.id_pedido}</td>
            <td>${pedido.nome}</td>
            <td>${dataPedidoFormatada}</td>
            <td>${pedido.situacao}</td>
        </tr> `
    }
    document.getElementById('tbody-pedido').innerHTML = html;
}

async function excluirPedido(id) 
{
    if (confirm("Deseja realmente excluir o Pedido?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };

        let result = await fetch(apiUrlPedido+"/pedido/"+id, options)
        let json = await result.json();

        if(json.OK === true)
        {
            alert('Pedido EXCLUIDO com sucesso')
            window.location.reload()
        }
        else
        {
            alert('Erro ao EXCLUIR pedido, contate o suporte técnico!')
        }
    }    
}

async function carregarPedido(id)
{
    if (id != null && !isNaN(id))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch(apiUrlPedidol+"/produto/"+id, options)
        let pedido = await result.json();

        document.getElementById('idpedido').value = pedido.id_pedido
        document.getElementById('datapedido').value = pedido.datapedido
        document.getElementById('situacaopedido').value = pedido.situacao
        document.getElementById('observacaopedido').value = pedido.observacoes
        document.getElementById('selectformapagamento').value = pedido.id_formapagamento
        document.getElementById('selectprazopagamento').value = pedido.id_prazopagamento
        document.getElementById('selecttipofrete').value = pedido.id_tipofrete
        document.getElementById('codigocliente').value = pedido.id_cliente
    }    
}

async function editarPedido(id) 
{
    openModal(true, id)   
}
