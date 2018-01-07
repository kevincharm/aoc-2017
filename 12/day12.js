// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => {
    main()
})

function dedupeConcat(p, c) {
    const deduped = c.filter(item => !p.includes(item))
    return p.concat(deduped)
}

function traverse(id, graph, programs = []) {
    const prog = graph[id]
    const untraversed = prog.pipes.filter(p => !programs.includes(p))
    if (!untraversed.length) {
        return programs
    } else {
        return untraversed
        .map(p => {
            return traverse(p, graph, programs.concat(untraversed))
        })
        .reduce(dedupeConcat, programs)
    }
}

function pruneGraph(graph, progs) {
    progs.forEach(id => {
        delete graph[id]
    })
}

function main() {
    let nGroups = 0
    const graph = {}
    const lines = input.split('\n')
    lines.forEach(line => {
        const parts = line.split('<->').map(l => l.trim())
        const id = parts[0]
        const pipes = parts[1].split(',').map(c => c.trim())
        graph[id] = { pipes }
    })

    while (Object.keys(graph).length) {
        const next = Object.keys(graph)[0]
        const group = traverse(next, graph)
        pruneGraph(graph, group)
        nGroups++
        if (next === '0') {
            console.log(`Programs in group 0: ${group.length}`)
        }
    }
    console.log(`Total groups: ${nGroups}`)
}
