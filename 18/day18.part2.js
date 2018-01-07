// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

const EventEmitter = require('events')

class Program extends EventEmitter {
    constructor(id) {
        super()
        this.id = id
        this.stack = { p: id }
        this.i = 0
        this.recvQ = []
        this.ended = false
    }

    load(programStr) {
        this.instructions = programStr
        .split('\n')
        .map(line => line.split(/\s/))
    }

    setConsumer(program) {
        this.consumer = program
    }

    receive(n) {
        this.recvQ.push(n)
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
        case 'add':
            this.stack[arg1] = valArg1 + valArg2
            i += 1
            break
        case 'mul':
            this.stack[arg1] = valArg1 * valArg2
            i += 1
            break
        case 'mod':
            this.stack[arg1] = valArg1 % valArg2
            i += 1
            break
        case 'jgz':
            if (valArg1 > 0)
                i += valArg2
            else
                i += 1
            break
        case 'snd':
            this.emit('send', valArg1)
            i += 1
            break
        case 'rcv':
            if (this.recvQ.length) {
                this.isWaiting = false
                const n = this.recvQ.shift()
                this.stack[arg1] = n
                i += 1
            } else {
                this.isWaiting = true
            }
            break
        }

        this.i = i
    }

    run() {
        if (this.i >= 0 && this.i < this.instructions.length) {
            this.next()
        } else {
            this.ended = true
        }
    }
}

function main() {
    let oneSendCount = 0

    const zero = new Program(0)
    const one = new Program(1)

    zero.load(input)
    zero.setConsumer(one)
    zero.on('send', n => one.receive(n))

    one.load(input)
    one.setConsumer(zero)
    one.on('send', n => {
        oneSendCount++
        zero.receive(n)
    })

    while (!zero.ended && !one.ended) {
        zero.run()
        one.run()

        if (zero.isWaiting && one.isWaiting)
            break
    }

    console.log(`Total sends from program 1: ${oneSendCount}`)
}
