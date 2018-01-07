const compose = (...fns) =>
  fns.reverse().reduce((f, g) =>
    x => g(f(x)),
    x => x)

function encode(matrix) {
    if (!matrix) {
        console.warn('Encode failed!')
        return null
    }
    return matrix
    .map(row => row.join(''))
    .join('/')
}

function decode(image) {
    if (!image) {
        console.warn('Decode failed!')
        return null
    }

    return image
    .split('/')
    .map(row => row.split(''))
}

function rotr(matrix) {
    const n = matrix.length
    const rotated = []
    for (let i=0; i<n; i++) rotated.push([])

    for (let x=0; x<n; x++) {
        for (let y=0; y<n; y++) {
            rotated[x][y] = matrix[n-y-1][x]
        }
    }

    return rotated
}

function flipX(matrix) {
    const n = matrix.length
    const flipped = []

    for (let y=0; y<n; y++) {
        flipped.push(matrix[n-y-1])
    }

    return flipped
}

function rotl(matrix) {
    return compose(rotr, rotr, rotr)(matrix)
}

function flipY(matrix) {
    return compose(rotr, flipX, rotl)(matrix)
}

function print(matrix) {
    const m = matrix.slice()
    if (!m) {
        console.warn('Empty matrix!')
        return
    }
    console.log('')
    if (typeof m === 'string') {
        m = decode(m)
    }
    m.forEach(row => {
        console.log(row.join(''))
    })
    console.log('')
}

module.exports = {
    compose,
    encode,
    decode,
    rotr,
    rotl,
    flipX,
    flipY,
    print
}
