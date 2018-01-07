const input = `4    10  4   1   8   4   9   14  5   1   14  15  0   15  3   5`

const isEq = (a, b) => a.join(',') === b.join(',')
const dupe = (arr, hist) => hist.find(h => isEq(arr, h))
const len = arr => arr && arr.length ? arr.length : 0

function realloc(state) {
    const next = state.slice()
    const highIdx = next.indexOf(Math.max(...next))
    const high = next[highIdx]
    next[highIdx] = 0
    let acc = high
    for (let i = 0; acc-- > 0;) next[(highIdx + 1 + i++) % next.length]++
    return next
}

function runLoop(input) {
    const states = []
    let init = input.slice()
    let state = input.slice()
    do {
        states.push(state)
        state = realloc(state)
    } while (!dupe(state, states))
    return states
}

const inputArr = input.split(/\s+/).map(s => parseInt(s))
const first = runLoop(inputArr)
const second = runLoop(first[first.length-1])
console.log(len(first))
console.log(len(second))
