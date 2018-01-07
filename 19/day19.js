// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function main() {
    const graph = parse(input)
    resolve(graph)
    const { acc, steps } = traverse(graph)
    console.log(`Accumulated: ${acc.join('')}`)
    console.log(`Total steps: ${steps}`)
}

class Vertex {
    constructor(type, x, y) {
        this.type = type
        this.x = x
        this.y = y
        this.links = {}
    }
}

function vertical(vertex, grid, x, y) {
    for (let j=y-1; j >= 0 && grid[j][x] !== ' '; j--) {
        if (grid[j][x].match(/\||\+|[A-Z]/)) {
            vertex.links.up = [x, j]
            break
        }
    }
    for (let j=y+1; j < grid.length && grid[j][x] !== ' '; j++) {
        if (grid[j][x].match(/\||\+|[A-Z]/)) {
            vertex.links.down = [x, j]
            break
        }
    }
}

function horizontal(vertex, grid, x, y) {
    for (let i=x-1; i >= 0 && grid[y][i] !== ' '; i--) {
        if (grid[y][i].match(/\-|\+|[A-Z]/)) {
            vertex.links.left = [i, y]
            break
        }
    }
    for (let i=x+1; i < grid[0].length && grid[y][i] !== ' '; i++) {
        if (grid[y][i].match(/\-|\+|[A-Z]/)) {
            vertex.links.right = [i, y]
            break
        }
    }
}

function parse(inputStr) {
    const grid = inputStr
    .split('\n')
    .map(row => row.split(''))
    const graph = []

    for (let y=0; y<grid.length; y++) {
        const row = grid[y]
        for (let x=0; x<row.length; x++) {
            const col = row[x]
            if (col === ' ') continue

            const vertex = new Vertex(col, x, y)
            const { links } = vertex
            graph.push(vertex)

            if (col === '|') {
                vertical(vertex, grid, x, y)
                continue
            }

            if (col === '-') {
                horizontal(vertex, grid, x, y)
                continue
            }

            if (col === '+') {
                vertical(vertex, grid, x, y)
                horizontal(vertex, grid, x, y)
                continue
            }

            vertical(vertex, grid, x, y)
            horizontal(vertex, grid, x, y)
            const { up, down, left, right } = links
            const one = !!up ^ !!down ^ !!left ^ !!right
            if (one) continue
            if (!(up && down)) {
                links.up = null
                links.down = null
            }
            if (!(left && right)) {
                links.left = null
                links.right = null
            }
        }
    }

    return graph
}

function resolveLink(graph, link) {
    const [x, y] = link
    return graph.find(v => v.x === x && v.y === y)
}

function resolve(graph) {
    graph.forEach((vertex, idx) => {
        const { links } = vertex
        const { up, down, left, right } = links
        if (up)
            links.up = resolveLink(graph, up)
        if (down)
            links.down = resolveLink(graph, down)
        if (left)
            links.left = resolveLink(graph, left)
        if (right)
            links.right = resolveLink(graph, right)
    })
}

function traverse(graph) {
    let vertex = graph[0]
    let lastVertex = vertex
    let dir = 'down'
    let acc = []
    let steps = 1
    while (vertex.links.up || vertex.links.down || vertex.links.left || vertex.links.right) {
        steps += Math.max(Math.abs(vertex.x - lastVertex.x), Math.abs(vertex.y - lastVertex.y))
        const { type, links } = vertex
        const { up, down, left, right } = links

        const isLetter = type.match(/[A-Z]/)
        if (isLetter)
            acc.push(type)

        const verticalClear = (dir === 'down' && down) || (dir === 'up' && up)
        const isVertical = type === '|' || isLetter
        const horizontalClear = (dir === 'left' && left) || (dir === 'right' && right)
        const isHorizontal = type === '-' || isLetter
        if ((verticalClear && isVertical) || (horizontalClear && isHorizontal)) {
            lastVertex = vertex
            vertex = links[dir]
            continue
        }

        if (type === '+') {
            let turn = false
            if (['up', 'down'].includes(dir)) {
                if (left)
                    dir = 'left'
                if (right)
                    dir = 'right'
                if (left || right) {
                    lastVertex = vertex
                    vertex = links[dir]
                    continue
                }
            }
            if (['left', 'right'].includes(dir)) {
                if (up)
                    dir = 'up'
                if (down)
                    dir = 'down'
                if (up || down) {
                    lastVertex = vertex
                    vertex = links[dir]
                    continue
                }
            }
            if (turn) {
                lastVertex = vertex
                vertex = links[dir]
                continue
            }
        }

        break
    }

    return { acc, steps }
}
