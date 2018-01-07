// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function main() {
    const particles = parse(input)
    const idx = closestToOrigin(particles)
    console.log(`Closest to origin: ${idx}`)
    const rem = remaining(particles)
    console.log(`Particles left: ${rem}`)
}

function closestToOrigin(particles) {
    let min, idx
    particles.forEach((p, i) => {
        const { ax, ay, az } = p
        const dist = Math.abs(ax) + Math.abs(ay) + Math.abs(az)
        if (!i || dist < min) {
            min = dist
            idx = i
        }
    })
    return idx
}

function remaining(particles) {
    let last
    let same = 0
    const collided = {}
    while (same < 1e3) { // yoloswag
        particles.forEach((p0, p0i) => {
            particles.forEach((p1, p1i) => {
                if (p0i === p1i) return

                if (p0.sx === p1.sx &&
                    p0.sy === p1.sy &&
                    p0.sz === p1.sz) {
                    collided[p0i] = true
                    collided[p1i] = true
                }
            })
        })
        particles.forEach(p => {
            p.sx += p.vx += p.ax
            p.sy += p.vy += p.ay
            p.sz += p.vz += p.az
        })
        rem = particles.length - Object.keys(collided).length
        if (last === rem)
            same++
        last = rem
    }
    return rem
}

function parse(input) {
    const re = new RegExp(
        'p=<(-?\\d+),(-?\\d+),(-?\\d+)>,\\s' +
        'v=<(-?\\d+),(-?\\d+),(-?\\d+)>,\\s' +
        'a=<(-?\\d+),(-?\\d+),(-?\\d+)>'
    )
    const particles = input
    .split('\n')
    .map(line => {
        const [ _, sx, sy, sz, vx, vy, vz, ax, ay, az ] = line
        .match(re)
        .map(n => parseInt(n))
        return { sx, sy, sz, vx, vy, vz, ax, ay, az }
    })
    return particles
}
