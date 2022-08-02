// Find out total request
const totalRequestFun = (requests) => {
    return requests.length
}

// Find out total no of SchandTotal application delivered
const sumOfTotalSchandTotalApp = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'Standalone')
            count++
    })
    return count
}

// Find out total no of LAN Portal delivered
const sumOfTotalLanPortal = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'LAN')
            count++
    })
    return count
}

// Find out total no of SchandTotal Application Licence number delivered
const sumOfAppLicNo = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'Standalone')
        count += r.licNo
    })
    return count
}

// Find out total no of LAN Licence number delivered
const sumOfLanLicNo = (requests) => {
    let count = 0
    requests.forEach(r=>{
        if(r.buildType === 'LAN')
        count += r.licNo
    })
    return count
}


module.exports = {
    totalRequestFun,
    sumOfTotalSchandTotalApp,
    sumOfTotalLanPortal,
    sumOfAppLicNo,
    sumOfLanLicNo 
}