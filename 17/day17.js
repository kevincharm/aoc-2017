// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function part1(steps) {
    const buf = [0]
    let pos = 0
    for (let i=1; i<=2017; i++) {
        pos = (pos + steps + 1) % buf.length
        buf.splice(pos+1, 0, i)
    }
    return buf[(pos+2) % buf.length]
}

function part2(steps) {
    let val
    let pos = 0
    for (let i=1; i<=50e6; i++) {
        pos = (pos + steps + 1) % i
        if (pos === 0) {
            val = i
        }
    }
    return val
}

function main() {
    const steps = ~~input
    console.log(`Part 1: ${part1(steps)}`)
    console.log(`Part 2: ${part2(steps)}`)
}
