// -*- node.jz -*-

/**
 *  Day 22, Part 1 & 2
 *
 *  Usage:
 *      input >> stdin >> node day22.js $PART $ITERATIONS
 *  e.g.
 *      `cat input.txt | node day22.js 2 10000000`
 */

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

// Enums
const NS_CLEAN = 0x0
const NS_WEAKENED = 0x1
const NS_INFECTED = 0x2
const NS_FLAGGED = 0x3

// Utils
const hash = (x, y) => `${x},${y}`
const unhash = (str) => str.split(',').map(n => parseInt(n))
const left = dir => dir + 90
const right = dir => dir - 90
const backout = dir => dir + 180

function main() {
    const partOne = ~~process.argv[2] === 1

    const cluster = inputToCluster(input)

    let node = cluster['0,0']
    const pos = { x: 0, y: 0 }
    let dir = 90
    let infections = 0
    let iter = ~~process.argv[3] || 10e6
    while (iter--) {
        switch (node.status) {
        case NS_CLEAN:
            if (partOne) {
                node.status = NS_INFECTED
                infections++
            } else {
                node.status = NS_WEAKENED
            }
            dir = left(dir)
            break
        case NS_WEAKENED:
            node.status = NS_INFECTED
            infections++
            break
        case NS_INFECTED:
            if (partOne) {
                node.status = NS_CLEAN
            } else {
                node.status = NS_FLAGGED
            }
            dir = right(dir)
            break
        case NS_FLAGGED:
            node.status = NS_CLEAN
            dir = backout(dir)
            break
        }

        pos.x += Math.round(Math.cos(dtr(dir)))
        pos.y -= Math.round(Math.sin(dtr(dir)))

        const key = hash(pos.x, pos.y)
        let next = node[english(dir)]
        if (!next) {
            // unresolved, check if we've seen it:
            next = cluster[key]
        }
        if (!next) {
            // haven't seen it before, so record it
            next = new Node()
            // link back to this node
            next[english(backout(dir))] = node
            // bob is, indeed, your uncle
            cluster[key] = next
        }

        node = next
    }

    console.log(`Infections: ${infections}`)
}

/**
 *  Quadtree node
 */
class Node {
    constructor(
        status = NS_CLEAN,
        up = null,
        down = null,
        left = null,
        right = null
    ) {
        this.up = up
        this.down = down
        this.left = left
        this.right = right
        this.status = status
    }
}

/**
 *  Input string -> quadtree
 */
function inputToCluster(str) {
    const rows = str
    .split('\n')
    .map(row =>
        row.split('').map(col => {
            switch (col) {
            case '#': return true
            default: return false
            }
        })
    )

    const cluster = {}
    const n = rows.length
    const off = -Math.floor(n/2) // halfway
    rows.forEach((row, _y) => {
        row.forEach((col, _x) => {
            const x = _x+off
            const y = _y+off
            const node = new Node(col ? NS_INFECTED : NS_CLEAN)
            cluster[hash(x, y)] = node
        })
    })
    for (const key in cluster) {
        resolve(key, cluster)
    }
    return cluster
}

function resolve(key, cluster) {
    const [x, y] = unhash(key)
    const node = cluster[key]
    if (!node.up) node.up = cluster[hash(x, y-1)]
    if (!node.down) node.down = cluster[hash(x, y+1)]
    if (!node.left) node.left = cluster[hash(x-1, y)]
    if (!node.right) node.right = cluster[hash(x+1, y)]
}

function english(dir) {
    switch (dir % 360) {
    case 90: return 'up'
    case 180: return 'left'
    case 270: return 'down'
    case 0: return 'right'
    }
}

function dtr(deg) {
    return deg*Math.PI/180
}
