const apiUrl = "http://localhost:3000"

async function myGet(url, method) 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append('Authorization', authorization)

    const options = {
        headers: myHeaders,
        method: method,
        redirect: "follow"
    }    

    let resultado = await fetch(apiUrl+url, options)
    return await resultado.json()
}

async function myPost(url, method, jacson) 
{
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    
    const options = {
        method: method,
        body: JSON.stringify(jacson),
        headers: myHeaders,
        redirect: "follow"
    }

    let resultado = await fetch(apiUrl+url, options)
    return await resultado.json()
}
