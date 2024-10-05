//const { Usuario } = require("../../../controller/model/usuario")

//declarações de constantes e variaveis
const apiUrl = "http://localhost:3000"
const modal = document.querySelector('.modal-container')

//funções 
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
        carregarUsuario(id);
        editar == false
    }
}

function confereSenha()
{
    const senha = document.getElementById('senhausuario');
    const repeteSenha = document.getElementById('repetirsenha');

    if (repeteSenha.value === senha.value)
    {
        alert('Senhas conferem, OK!')
        gravarUsuario()
    }
    else
    {
        alert ('As senhas que foram inseridas não conferem, confira a senha digitada!')
    }
   
}

function mostrarSenha()
{
    let inputSenha = document.getElementById('senhausuario')
    let btnMostarSenha = document.getElementById('btn-senhausuario')
    
    if (inputSenha.type === 'password') //se o tipo do input for igual a password
    {
        inputSenha.setAttribute('type', 'text')
        btnMostarSenha.classList.replace('fa-eye', 'fa-eye-slash')
    }
    else
    {
        inputSenha.setAttribute('type', 'password')
        btnMostarSenha.classList.replace('fa-eye-slash', 'fa-eye')
    }
}

function mostrarConfirmaSenha()
{    
    let inputRepetirSenha = document.getElementById('repetirsenha')
    let btnRepetirSenha = document.getElementById('btn-repetirsenha')

    if (inputRepetirSenha.type === 'password') //se o tipo do input for igual a password
    {
        inputRepetirSenha.setAttribute('type', 'text')
        btnRepetirSenha.classList.replace('fa-eye', 'fa-eye-slash')
    }
    else
    {
        inputRepetirSenha.setAttribute('type', 'password')
        btnRepetirSenha.classList.replace('fa-eye-slash', 'fa-eye')
    }
}

//funções de comunicação com back end.
async function gravarUsuario() 
{
    let id = document.getElementById('idusuario').value
    let method = id == '' ? 'POST' : 'PUT'
    let url = id == '' ? '/usuario' : '/usuario/'+id

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    let usuario = {
        "usuario": document.getElementById('nomeusuario').value,
        "senha": document.getElementById('senhausuario').value
    };

    const options = {        
        method: method,
        body: JSON.stringify(usuario), 
        headers: myHeaders,       
        redirect: "follow"
    }; 

    let result = await fetch (apiUrl+url, options);
    let usuarioResult = await result.json();

    if (usuarioResult.usuario)
    {
        alert('Usuario cadastrado com sucesso!')
        window.location.reload()
    }
    else
    {
        alert('Erro ao cadastrar Usuario, verifique os dados digitados!')
    }
}

async function listarUsuarios() 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options ={
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    };
    
    let result = await fetch (apiUrl+'/usuario', options);
    let usuarios = await result.json();
    let html = ''

    for (let index = 0; index < usuarios.length; index++)
    {        
        let usuario = usuarios[index];      
        let btnExlcuir = `<button class="btnexcluir" onclick="excluirUsuario(${usuario.id_usuario})">Excluir</button>`;
        let btnEditar = `<button class="btneditar" onclick="editarUsuario(${usuario.id_usuario})">Editar</button>`;

        html += `
        <tr>
            <td>${btnEditar}</td>
            <td>${btnExlcuir}</td>
            <td>${usuario.id_usuario}</td>
            <td>${usuario.usuario}</td>
        </tr> `
    }
    document.getElementById('tbody-usuarios').innerHTML = html;
}

async function excluirUsuario(id) 
{
    if (confirm("Deseja realmente excluir o Usuario?"))
    {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append('Authorization', authorization)

        const options = {
            headers: myHeaders,
            method: 'DELETE',
            redirect: 'follow'
        };

        let result = await fetch(apiUrl+"/usuario/"+id, options)
        let json = await result.json();

        if(json.OK === true)
        {
            alert('Usuario EXCLUIDO com sucesso')
            window.location.reload()
        }
        else
        {
            alert('Erro ao EXCLUIR usuario, contate o suporte técnico!')
        }
    }    
}

async function carregarUsuario(id)
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

        let result = await fetch(apiUrl+"/usuario/"+id, options)
        let usuario = await result.json();

        document.getElementById('idusuario').value = usuario.id_usuario
        document.getElementById('nomeusuario').value = usuario.usuario
    }    
}

async function editarUsuario(id) 
{
    openModal(true, id)   
}
