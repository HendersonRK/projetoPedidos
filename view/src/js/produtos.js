//declarações de constantes e variaveis
const apiUrlProduto = "http://localhost:3000"
const modalProduto = document.querySelector('.modal-container')

//funções 
function openModalProduto (editar = false, id)
{
    modalProduto.classList.add('active')

    modalProduto.onclick = e => 
    {
        if (e.target.className.indexOf('modal-container') !== -1)
        {
            modalProduto.classList.remove('active')
        }
    }
    if (editar == true)
    {
        carregarProduto(id);
        editar == false
    }
    else
    {
        document.getElementById('idproduto').value = ''
        document.getElementById('nomeproduto').value = ''
        document.getElementById('nomeprodutoreduzido').value = ''
        document.getElementById('codigobarra').value = ''
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

    let selectMarca = document.getElementById('selectmarca')
    let valorMarca = selectMarca.value
    

    let produto = {
        "nomeproduto": document.getElementById('nomeproduto').value,
        "nomeprodutoresumido": document.getElementById('nomeprodutoreduzido').value,
        "codigobarra": document.getElementById('codigobarra').value,
        "id_unidade": valorUnidade,
        "id_grupo": valorGrupo,
        "id_marca": valorMarca
    };

    const options = {        
        method: method,
        body: JSON.stringify(produto), 
        headers: myHeaders,       
        redirect: "follow"
    }; 

    let result = await fetch (apiUrlProduto+url, options);
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

async function listarProdutos(buscaProduto='') 
{
    let url = buscaProduto === '' ? '/produto' : '/produto/buscapornome/'+buscaProduto
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrlProduto+url, options)
    let produtos = await result.json()

    return produtos    
}

async function montaTabelaProduto(buscaProduto)
{
    let resultado = await listarProdutos(buscaProduto)
    let html = ''

    for (let index = 0; index < resultado.length; index++)
    {        
        let produto = resultado[index];      
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

        let result = await fetch(apiUrlProduto+"/produto/"+id, options)
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

        let result = await fetch(apiUrlProduto+"/produto/"+id, options)
        let produto = await result.json();

        document.getElementById('idproduto').value = produto.id_produto
        document.getElementById('nomeproduto').value = produto.nomeproduto
        document.getElementById('nomeprodutoreduzido').value = produto.nomeprodutoresumido
        document.getElementById('codigobarra').value = produto.codigobarra
        document.getElementById('selectunidadeproduto').value = produto.id_unidade
        document.getElementById('selectgrupoproduto').value = produto.id_grupo
        document.getElementById('selectmarca').value = produto.id_marca
    }    
}

async function editarProduto(id) 
{
    openModalProduto(true, id)   
}

async function buscaProdutoPorNome() 
{
    let nomeBusca = document.getElementById('campopesquisa').value
    montaTabelaProduto(nomeBusca)    
}

async function buscarProduto() 
{
    const buscaIdProduto = document.getElementById('idprodutopedido').value
    const buscaNomeProduto = document.getElementById('nomeprodutopedido').value

    const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    if(buscaIdProduto != '' && buscaNomeProduto == '')
    {//busca por ID produto
        let result = await fetch (apiUrlProduto+'/produto/'+buscaIdProduto, options);
        let produto = await result.json()

            if (produto.id_produto == undefined)
            {
                alert('Produto não encontrado, verifique os dados digitados!')
            }
            else
            {
                document.getElementById('nomeprodutopedido').value = produto.nomeproduto
            }   
    }
    else if (buscaIdProduto == '' && buscaNomeProduto != '')
    {//Busca por nome produto
        let result = await fetch (apiUrlProduto+'/produto/buscapornome/'+buscaNomeProduto, options);
        let cliente = await result.json()

            if (cliente.length > 0)
            {
                document.getElementById('nomeprodutopedido').value = produto[0].nomeproduto
                document.getElementById('idprodutopedido').value = produto[0].id_produto         
            }
            else
            {
                alert('Produto não encontrado, verifique os dados digitados!')
            }
    } 
    else 
    {
        alert('ATENÇÃO, insira o código ou o nome do produto para continuar!')
    }
}
