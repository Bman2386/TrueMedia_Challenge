import token from './keys.js'


// async function getQBs(url = 'https://project.trumedianetworks.com/api/nfl/players') {
//     // Default options are marked with *
//     const response = await fetch(url, {
//         method: 'GET', // *GET, POST, PUT, DELETE, etc.
//         mode: 'no-cors', // no-cors, *cors, same-origin
//         //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         //credentials: `omit`, // include, *same-origin, omit
//         headers: {
//             'Content-Type': 'application/json',
//             'temptoken': `${token}`
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         //redirect: 'follow', // manual, *follow, error
//         //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//         //body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });
//     console.log(response.json())
//     // return response.json(); // parses JSON response into native JavaScript objects
// }

export async function getQBs(url = `https://project.trumedianetworks.com/api/nfl/players`){
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'temptoken': `${token}`
        }
    })
    const QBData = await response.json()
    return QBData
}

export async function getStats(id){
   const url = `https://project.trumedianetworks.com/api/nfl/player/${id}`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'temptoken': `${token}`
        }
    })
    const data = await response.json()
    return data
}
