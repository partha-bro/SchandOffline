
const totalRequestFun = (requests) => {
    return requests.length
}

const sumOfTotalSchandTotalApp = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'Standalone')
            count++
    })
    return count
}

const sumOfTotalLanPortal = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'LAN')
            count++
    })
    return count
}

const sumOfTotalLicNo = (requests) => {
    let count = 0
    requests.forEach(r=>count += r.licNo)
    return count
}


module.exports = { totalRequestFun,sumOfTotalSchandTotalApp,sumOfTotalLanPortal,sumOfTotalLicNo }