// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

const EventEmitter = require('events')

class Program extends EventEmitter {
    constructor(id) {
        super()
        this.id = 0
        this.stack = {}
        this.i = 0
    }

    load(programStr) {
        this.instructions = programStr
        .split('\n')
        .map(line => line.split(/\s/))
    }

    next() {
        let i = this.i
        const [op, arg1, arg2] = this.instructions[i]
        const valArg1 = this.stack[arg1] || parseInt(arg1) || 0
        const valArg2 = this.stack[arg2] || parseInt(arg2) || 0
        switch (op) {
        case 'set':
            this.stack[arg1] = valArg2
            i += 1
            break
        case 'sub':
            this.stack[arg1] = valArg1 - valArg2
            i += 1
            break
        case 'mul':
            this.emit('mul')
            this.stack[arg1] = valArg1 * valArg2
            i += 1
            break
        case 'jnz':
            if (valArg1 !== 0)
                i += valArg2
            else
                i += 1
            break
        }

        this.i = i
    }

    run() {
        while (this.i >= 0 && this.i < this.instructions.length) {
            this.next()
        }
        this.emit('end')
    }
}

function main() {
    const zero = new Program(0)
    let mulcount = 0
    zero.on('mul', () => {
        mulcount++
    })
    zero.on('end', () => {
        console.log(`Multiplies: ${mulcount}`)
    })
    zero.load(input)
    zero.run()
}
