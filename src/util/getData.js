


export async function getQBs(token){
   let url = `https://project.trumedianetworks.com/api/nfl/players`
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

export async function getStats(id, token){
   const url = `https://project.trumedianetworks.com/api/nfl/player/${id}`
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
