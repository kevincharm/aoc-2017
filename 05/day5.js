// -*- node -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => run())

function run() {
    const parse = (str) => str.split('\n').map(i => ~~i)
    const maze = (stack = [], pred = () => false, pc = 0) => {
        for (let sp = 0; !Number.isNaN(sp += pred(stack[sp]) ? stack[sp]-- : stack[sp]++);) pc++
        return pc
    }

    console.log(maze(parse(input)))
    console.log(maze(parse(input), s => s || s === 0 ? s >= 3 : false))
}
