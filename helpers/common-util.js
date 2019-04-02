'use strict'

const generateRandomChars = (n) => {
    const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = n; i > 0; --i) {
        result += charset[Math.floor(Math.random() * charset.length)]
    }
    return result
}


module.exports = {
    generateRandomChars: generateRandomChars
}
