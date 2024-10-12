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