// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => {
    const args = process.argv.slice(2)
    const rounds = args[0]
    main(rounds)
})

function leftpad(str, char = 0, len = 2) {
    let res = str.slice()
    if (str.length < len) {
        const pad = len - str.length
        for (let i=0; i<pad; i++) {
            res = char + res
        }
    }
    return res
}

function knot(input, rounds = 64) {
    let lengths = input
    .split('')
    .map(i => i.charCodeAt(0))

    if (rounds > 1) {
        lengths = lengths.concat([17, 31, 73, 47, 23])
    }

    const BLOCKS = 16
    const list = []
    for (let i=0; i<256; i++) {
        list.push(i)
    }

    let pos = 0
    let skip = 0
    for (let r=0; r<rounds; r++) {
        lengths.forEach(len => {
            const sublist = []
            for (let i=0; i<len; i++) {
                sublist.push(list[(pos + i) % list.length])
            }

            sublist.reverse()
            for (let i=0; i<len; i++) {
                list[(pos + i) % list.length] = sublist[i]
            }

            pos += len + skip++
        })
    }

    let dense = []
    for (let i=0; i<list.length/BLOCKS; i++) {
        let sum = list[i*BLOCKS]
        for (let j=1; j<BLOCKS; j++) {
            sum ^= list[(i * BLOCKS) + j]
        }
        dense.push(sum)
    }

    const hash = dense
    .map(i => leftpad(i.toString(16)))
    .join('')

    // console.log(list[0] * list[1])
    // console.log(hash)
    return hash
}

function main(rounds = 1) {
    console.log(knot(input, rounds))
}

module.exports = {
    knot,
    leftpad
}
