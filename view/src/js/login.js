const apiUrlUsuario = "http://localhost:3000"
let authorization = localStorage.getItem('Authorization')

async function buscarLogin(authorization) 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)
    
    const options = {
        method: 'GET',
        headers: myHeaders
    }

    try
    {
        let result = await fetch(apiUrlUsuario+"/login", options)
        let resultado = await result.json()

        if(resultado.resultado == "Login OK")
        {
            return true
        }
    }
    catch (error)
    {
        return false
    }    
    return false
}

async function buscarLoginNome(usuario) 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: 'GET',
        headers: myHeaders
    }

    let result = await fetch(apiUrlUsuario+"/usuario/buscapornome/"+usuario, options)
    let resultado = await result.json()

    if(resultado.resultado == "Login OK")
    {
        return true
    }
    return false
}

async function verificaLogin()
{
    let resultado = await buscarLogin(authorization)
    
    if (!resultado)
    {
        window.location = '../index.html'
    }
}

async function login()
{
    let usuario = document.getElementById('loginusuario').value
    let senha = document.getElementById('loginsenha').value 

    let base64 = "Basic "+btoa(usuario+":"+senha)
    let resultado = await buscarLogin(base64)

    if (resultado)
    {
        localStorage.setItem("Authorization", base64)
        window.location = 'home.html'
    }
    else
    {
        alert('Falha na autenticação, confirma suas credenciais!')
    }
}

function logout() 
{
    usuario = ''
    senha = ''
    localStorage.setItem('usuario', usuario)
    localStorage.setItem('senha', senha)
    window.location = '../../index.html'    
}


