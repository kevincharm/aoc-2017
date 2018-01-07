    b = 57
    c = b
    // jnz a 2
    // jnz 1 5
    b *= 100
    b -= -100000
    c = b
    c -= -17000
    do { f = 1
        d = 2
        do { e = 2
            do { g = d
                g *= e
                g -= b
                if (g === 0)
                    f = 0
                e -= -1
                g = e
                g -= b
            } while (g !== 0)
            d -= -1
            g = d
            g -= b
        } while (g !== 0)
        if (f === 0)
            h -= -1
        g = b
        g -= c
        if (g === 0)
            process.exit()
        b -= -17
    } while (true)




