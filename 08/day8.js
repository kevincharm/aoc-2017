// -*- node.jz -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function ecmascriptify(input) {
    const regs = {}
    const weEczemaSkriptNow = input
    .split('\n')
    .map(line => {
        const tokens = line.match(/([a-z]+)\s[a-z]+\s\-?[0-9]+\sif\s([a-z]+)/)
        if (!tokens) return line
        const reg1 = tokens[1]
        const reg2 = tokens[2]
        regs[reg1] = true
        regs[reg2] = true
        const swapsies = line.split(' if ')
        return `
            if (${swapsies[1]}) ${swapsies[0]};
            if (${reg2} > large) large = ${reg2};
        `
    })
    .join('\n')
    .replace(/inc/g, '+=')
    .replace(/dec/g, '-=')

    return `
        let large = 0;
        ${Object.keys(regs)
        .map(reg => `let ${reg} = 0;`)
        .join('\n')}
        ${weEczemaSkriptNow}
        ${Object.keys(regs)
        .map(reg => `console.log('${reg} = ' + ${reg});`)
        .join('\n')}
        console.log('Max@end:' + Math.max(${Object.keys(regs).join(',')}));
        console.log('Large watermark:' + large);
    `
}

function main() {
    const skript = ecmascriptify(input)
    console.log(skript)
    eval(skript)
}
