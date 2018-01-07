// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

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

function knot(input, rounds = 1) {
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

    return hash
}

function popcnt(str) {
    return (str.match(/1/g) || []).length
}

function toBits(hex) {
    let bits = ''
    for (let i=0; i<hex.length; i=i+2) {
        const digit = hex.substr(i, 2)
        const interim = parseInt(digit, 16).toString(2)
        const complete = leftpad(interim, '0', 8)
        bits += complete
    }
    return bits
}

function strikeX(grid, x, y, yRange = 128) {
    const bit = grid[y][x]
    if (bit !== 1) return 0

    // find domain of adjacent setbits
    // along x-axis from <x,y>
    while (x > 0 && grid[y][x-1] === 1) x--;
    const begin = x
    for (; grid[y][x] === 1; x++) grid[y][x] = 'X';
    const end = x

    // above
    const up = y - 1
    if (up >= 0) {
        grid[up].slice(begin, end).forEach((b, i) => {
            if (b === 1) strikeX(grid, begin+i, up, yRange)
        })
    }

    // below
    const down = y + 1
    if (down < yRange) {
        grid[down].slice(begin, end).forEach((b, i) => {
            if (b === 1) strikeX(grid, begin+i, down, yRange)
        })
    }

    return 1
}

function main() {
    const Y_RANGE = 128
    const grid = []
    let used = 0
    for (let i=0; i<Y_RANGE; i++) {
        const line = `${input.trim()}-${i}`
        const hash = knot(line, 64)
        const bits = toBits(hash)
        grid.push(bits.split('').map(b => ~~b))
        used += popcnt(bits)
    }

    let regions = 0
    grid.forEach((row, y) => {
        row.forEach((_, x) => {
            if (strikeX(grid, x, y, Y_RANGE)) {
                regions += 1
            }
        })
    })

    console.log(`Allocated space: ${used}`)
    console.log(`Regions: ${regions}`)
}
