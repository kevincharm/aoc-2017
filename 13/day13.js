// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => {
    main()
})

const scanner = (depth, range, t = 0) => {
    range -= 1
    return range - Math.abs((depth+t)%(2*range)-range)
}

function severity(firewall) {
    return firewall
    .map((f, depth) => {
        const { range } = f
        const scanpos = scanner(depth, range)
        if (scanpos === 0) {
            return depth * range
        }
        return 0
    })
    .reduce((p, c) => p + c, 0)
}

function hit(firewall, delay = 0) {
    for (let depth=0; depth<firewall.length; depth++) {
        const f = firewall[depth]
        if (!f) continue
        const { range } = f
        const scanpos = scanner(depth, range, delay)
        if (scanpos === 0) {
            return true
        }
    }
    return false
}

function minDelay(firewall) {
    let delay = 0
    for (;hit(firewall, delay);delay++)
    ;return delay
}

function main() {
    const firewall = []
    const lines = input.split('\n')
    lines.forEach(line => {
        const [depth, range] = line
        .split(':')
        .map(c => ~~c.trim())
        firewall[depth] = { range }
    })

    console.log(`Severity: ${severity(firewall)}`)
    console.log(`Mininum Delay: ${minDelay(firewall)}`)
}
