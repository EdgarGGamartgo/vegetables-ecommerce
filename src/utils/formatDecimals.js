// This function reformats a string number to only two decimals

export const formatDecimals = (quantity) => {
    const indexDot = quantity.indexOf('.')
    const integers = quantity.substring(0, indexDot)
    let decimals = quantity.substring(indexDot + 1)
    if (decimals.length > 2) {
        let decimalOne = decimals.charAt(0)
        let decimalTwo = decimals.charAt(1)
        decimals = `${decimalOne}${decimalTwo}`
    } 
    return `${integers}.${decimals}`    
}