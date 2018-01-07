// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())
const evil = eval

const sumRecurse = (arr, n = 1) =>
    !arr.length ? n :
    n + arr
    .map(c => sumRecurse(c, n + 1))
    .reduce((p, c) => p + c, 0)

function main() {
    let nGarbage = 0

    const cancel = input
    .replace(/!./g, '')

    const ecma = cancel
    .replace(/<.*?>/g, match => {
        nGarbage += match.length - 2
        return ''
    })
    .replace(/{,{/g, '{{')
    .replace(/},}/g, '}}')
    .replace(/{/g, '[')
    .replace(/}/g, ']')
    console.log(ecma)

    const depth = sumRecurse(evil(ecma))

    console.log(`total: ${depth}`)
    console.log(`garbage_n: ${nGarbage}`)
}
