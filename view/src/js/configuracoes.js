const apiUrlConfiguracoes = 'http://localhost:3000'

async function carregaConfiguracoes()
{   
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        headers: myHeaders,
        method: 'GET',
        redirect: 'follow'
    }

    let result = await fetch(apiUrlConfiguracoes+"/configuracoes/email", options)
    let configuracoes = await result.json();
    
    document.getElementById('hostname').value = configuracoes.hostname
    document.getElementById('emailfrom').value = configuracoes.emailretorno
    document.getElementById('portname').value = configuracoes.porta
    document.getElementById('emailusername').value = configuracoes.emailusername
    document.getElementById('emailpassword').value = configuracoes.emailpassword
}

async function gravarConfiguracoes() 
{
    let configuracoes = {
        "hostname" : document.getElementById('hostname').value,
        "emailretorno" : document.getElementById('emailfrom').value,
        "porta" : document.getElementById('portname').value,
        "emailusername" : document.getElementById('emailusername').value,
        "emailpassword" : document.getElementById('emailpassword').value
    }

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        method: 'PUT',
        body: JSON.stringify(configuracoes),
        headers: myHeaders,
        redirect: "follow"
    };

    let resultado = await fetch (apiUrlConfiguracoes+'/configuracoes/email', options)
    let configuracoesResult = await resultado.json()

    if (configuracoesResult.id_configuracao)
    {
        alert("Configuracao alterada com sucesso!")
        window.location.reload()
    }
    else
    {
        alert('Erro ao alterar configurações, verifique os dados digitados!')
    }

}