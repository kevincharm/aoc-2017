#include <stdio.h>

int main() {
    int a = 1;
    int b, c, d, e, f, g, h;
    b = c = d = e = f = g = h = 0;

    b = 105700;
    c = b + 17000;
    for (; b <= c; b += 17) {
        f = 1;
        for (d = 2; d <= b/2; d++) {
            if (b % d == 0) {
                f = 0;
            }
        }
        if (f == 0) {
            h += 1;
        }
    }

    printf("h: %d\n", h);
    return 0;
}
