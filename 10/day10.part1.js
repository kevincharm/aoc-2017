// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function main() {
    const lengths = input.split(',').map(i => parseInt(i))
    console.log(lengths)

    const list = []
    for (let i=0; i<256; i++) list.push(i)

    let pos = 0
    let skip = 0
    lengths.forEach(len => {
        const sublist = []
        for (let i=0; i<len; i++) {
            sublist.push(list[(pos + i) % list.length])
        }
        console.log(JSON.stringify(sublist))
        sublist.reverse()
        for (let i=0; i<len; i++) {
            list[(pos + i) % list.length] = sublist[i]
        }
        console.log(JSON.stringify(sublist))

        pos += len + skip++
    })

    console.log(JSON.stringify(list))
    console.log(list[0] * list[1])
}
