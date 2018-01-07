// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => {
    main()
})

const dist = (i, j) => Math.abs(i) + Math.abs(j)

function main() {
    let i = 0
    let j = 0
    let max = 0
    input.split(',').forEach(dir => {
        const d = dir.split('')
        const inc = 1/d.length
        d.forEach(x => {
            switch (x) {
            case 'n':
                j += inc
                break
            case 's':
                j -= inc
                break
            case 'e':
                i += inc
                break
            case 'w':
                i -= inc
                break
            }
        })
        max = Math.max(max, dist(i, j))
    })

    console.log(`total steps: ${dist(i, j)}`)
    console.log(`max steps: ${max}`)
}
