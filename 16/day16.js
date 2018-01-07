// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

const spin = (programs, size) => {
    while (size--) programs.unshift(programs.pop())
}

const exchange = (programs, a, b) => {
    const _a = programs[a]
    programs[a] = programs[b]
    programs[b] = _a
}

const partner = (programs, a, b) => {
    let _a, _a_i, _b, _b_i
    for (let i=0; i<programs.length; i++) {
        const p = programs[i]
        switch (p) {
        case a:
            _a = p
            _a_i = i
            break
        case b:
            _b = p
            _b_i = i
        }
    }
    programs[_a_i] = _b
    programs[_b_i] = _a
}

const handle = (line, programs) => {
    const op = line.charAt(0)
    let a, b
    switch (op) {
    case 's':
        const size = ~~line.slice(1)
        spin(programs, size)
        break
    case 'x':
        [a, b] = line
        .slice(1)
        .split('/')
        .map(i => ~~i)
        exchange(programs, a, b)
        break
    case 'p':
        [a, b] = line
        .slice(1)
        .split('/')
        partner(programs, a, b)
    }
}

function main() {
    const moves = input.split(',')
    const programs = []
    const off = 'a'.charCodeAt(0)
    for (let i=0; i<16; i++) {
        programs.push(String.fromCharCode(off+i))
    }
    const init = programs.slice()

    const images = []
    let i
    for (i=0;; i++) {
        moves.forEach(move => handle(move, programs))
        const image = programs.join('')
        if (images.find(img => img === image)) {
            console.log(`Cycled at (${i}): ${image}`)
            break
        }
        images.push(image)
    }

    let rem = 1e9 % i
    console.log(`Final order: ${images[rem-1]}`)
}
