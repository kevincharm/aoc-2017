// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function main() {
    const lines = input.split('\n\n')
    const [begin, perform] = lines[0].split('\n')
    const initState = begin.match(/begin in state ([A-Z]+)./i)[1]
    const steps = ~~perform.match(/diagnostic checksum after (\d+)/i)[1]

    // parse functions
    const states = {}
    const stateDefs = lines.slice(1)
    stateDefs.forEach(def => {
        const lines = def.split('\n')

        const id = lines.shift().match(/In state ([A-Z]+):/i)[1]

        const lowCurr = lines.shift().match(/current value is (\d+)/i)[1]
        const lowWrite = ~~lines.shift().match(/write the value (\d+)/i)[1]
        const lowMove = lines
        .shift()
        .match(/one slot to the (left|right)/i)[1] === 'left' ? -1 : 1
        const lowNext = lines.shift().match(/continue with state ([A-Z]+)/i)[1]
        const low = new Action(lowWrite, lowMove, lowNext)

        const highCurr = lines.shift().match(/current value is (\d+)/i)[1]
        const highWrite = ~~lines.shift().match(/write the value (\d+)/i)[1]
        const highMove = lines
        .shift()
        .match(/one slot to the (left|right)/i)[1] === 'left' ? -1 : 1
        const highNext = lines.shift().match(/continue with state ([A-Z]+)/i)[1]
        const high = new Action(highWrite, highMove, highNext)

        states[id] = new State(id, low, high)
    })

    const high = {}
    let state = states[initState]
    let cursor = 0
    let pc = steps
    while (pc--) {
        let action
        if (!high[cursor]) {
            action = state.low
        } else {
            action = state.high
        }

        if (action.write) {
            high[cursor] = true
        } else {
            delete high[cursor]
        }

        cursor += action.move
        state = states[action.next]
    }

    console.log(`Checksum: ${Object.keys(high).length}`)
}

class State {
    constructor(id, low, high) {
        this.id = id
        this.low = low
        this.high = high
    }
}

class Action { // lawsuit
    constructor(write, move, next) {
        this.write = write
        this.move = move
        this.next = next
    }
}
