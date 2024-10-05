//declarações de constantes e variaveis
const apiUrl = "http://localhost:3000"
const modal = document.querySelector('.modal-container')

//funções 
function openModalProduto (editar = false, id)
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
        carregarProduto(id);
        editar == false
    }
}

//funções de comunicação com back end.
async function gravarProduto() 
{
    let id = document.getElementById('idproduto').value
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? '/produto' : '/produto/'+id

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    let selectUnidade = document.getElementById('selectunidadeproduto')
    let valorUnidade = selectUnidade.value

    let selectGrupo = document.getElementById('selectgrupoproduto')
    let valorGrupo = selectGrupo.value
    

    let produto = {
        "nomeproduto": document.getElementById('nomeproduto').value,
        "nomeprodutoresumido": document.getElementById('nomeprodutoreduzido').value,
        "codigobarra": document.getElementById('codigobarra').value,
        "id_unidade": valorUnidade,
        "id_grupo": valorGrupo
    };

    const options = {        
        method: method,
        body: JSON.stringify(produto), 
        headers: myHeaders,       
        redirect: "follow"
    }; 

    let result = await fetch (apiUrl+url, options);
    let produtoResult = await result.json();

    if (produtoResult.nomeproduto)
    {
        alert('Produto cadastrado com sucesso!')
        window.location.reload()
    }
    else
    {
        alert('Erro ao cadastrar Produto, verifique os dados digitados!')
    }
}

async function listarProdutos() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrl+'/produto', options);
    let produtos = await result.json();
    let html = ''

    for (let index = 0; index < produtos.length; index++)
    {        
        let produto = produtos[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirProduto(${produto.id_produto})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarProduto(${produto.id_produto})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${produto.id_produto}</td>
            <td>${produto.nomeproduto}</td>
            <td>${produto.descricaouniproduto}</td>
            <td>${produto.descricaogrupoproduto}</td>
        </tr> `
    }
    document.getElementById('tbody-produto').innerHTML = html;
}

async function excluirProduto(id) 
{
    if (confirm("Deseja realmente excluir o Produto?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };

        let result = await fetch(apiUrl+"/produto/"+id, options)
        let json = await result.json();

        if(json.OK === true)
        {
            alert('Produto EXCLUIDO com sucesso')
            window.location.reload()
        }
        else
        {
            alert('Erro ao EXCLUIR produto, contate o suporte técnico!')
        }
    }    
}

async function carregarProduto(id)
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

        let result = await fetch(apiUrl+"/produto/"+id, options)
        let produto = await result.json();

        document.getElementById('idproduto').value = usuario.id_usuario
        document.getElementById('nomeproduto').value = usuario.usuario
        document.getElementById('nomeprodutoreduzido').value = usuario.usuario
        document.getElementById('codigobarra').value = usuario.usuario
        document.getElementById('unidadeproduto').value = usuario.usuario
        document.getElementById('grupoproduto').value = usuario.usuario

    }    
}

async function editarProduto(id) 
{
    openModal(true, id)   
}

