// -*- node.jz -*-
// Usage: cat input.txt | node day21.js

const { compose, encode, decode,
    rotr, rotl, flipX, flipY, print } = require('./util')

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function main() {
    let matrix = decode('.#./..#/###')
    const rules = input
    .split('\n')
    .map(rule => rule.split('=>').map(parts => parts.trim()))

    // print(matrix)
    let iter = process.argv[2]
    while (iter--) {
        const n = matrix.length
        if (!(n % 2)) {
            matrix = div2(matrix, rules)
        } else if (!(n % 3)) {
            matrix = div3(matrix, rules)
        }
        // print(matrix)
    }
    const count = matrix
    .map(row => {
        return row
        .map(col => {
            switch (col) {
            case '#': return 1
            case '.': return 0
            }
        })
        .reduce((p, c) => p + c, 0)
    })
    .reduce((p, c) => p + c, 0)
    console.log(`On: ${count}`)
}

function div2(matrix, rules) {
    const n = matrix.length
    const submatrices = []
    for (let y=0; y<n; y+=2) {
        const rows = matrix.slice(y, y+2)
        for (let x=0; x<n; x+=2) {
            const submatrix = rows
            .map(row => row.slice(x, x+2))
            const enhanced = lookup(submatrix, rules)
            submatrices.push(enhanced)
        }
    }
    return combine(submatrices)
}

function div3(matrix, rules) {
    const n = matrix.length
    const submatrices = []
    for (let y=0; y<n; y+=3) {
        const rows = matrix.slice(y, y+3)
        for (let x=0; x<n; x+=3) {
            const submatrix = rows
            .map(row => row.slice(x, x+3))
            const enhanced = lookup(submatrix, rules)
            submatrices.push(enhanced)
        }
    }
    return combine(submatrices)
}

function combine(matrices = []) {
    const n = Math.sqrt(matrices.length)
    const result = []
    for (let i=0; i<matrices.length; i+=n) {
        const subset = matrices.slice(i, i+n)
        for (let y=0; y<matrices[0].length; y++) {
            const row = []
            for (let x=0; x<n; x++) {
                row.push(...subset[x][y])
            }
            result.push(row)
        }
    }
    return result
}

function lookup(matrix, rules) {
    let m = matrix.slice()
    for (let i=0; i<4; i++) {
        const mm = find(m, rules)
        if (mm) return mm
        const mx = find(flipX(m), rules)
        if (mx) return mx
        const my = find(flipY(m), rules)
        if (my) return my
        m = rotr(m)
    }
    return null
}

function find(matrix, rules) {
    const m = encode(matrix)
    const r = rules
    .find(([rule, out]) => m === rule)
    if (r) {
        const [_, out] = r
        return decode(out)
    }

    return null
}
