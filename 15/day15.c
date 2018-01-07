#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

int64_t judge_one(int64_t a, int64_t b) {
    const int pairs = 40000000;
    int64_t total = 0;
    for (int i=0; i<pairs; i++) {
        a = (a * 16807) % INT32_MAX;
        b = (b * 48271) % INT32_MAX;

        total += ~~((a & 0xffff) == (b & 0xffff));
    }

    return total;
}

int64_t judge_two(int64_t a, int64_t b) {
    const int pairs = 5000000;
    int64_t total = 0;
    bool a_rdy = false;
    bool b_rdy = false;
    for (int i=0; i<pairs;) {
        if (!a_rdy)
            a_rdy = !((a = (a * 16807) % INT32_MAX) % 4);
        if (!b_rdy)
            b_rdy = !((b = (b * 48271) % INT32_MAX) % 8);

        if (a_rdy && b_rdy) {
            i += ~~!(a_rdy = b_rdy = false);
            total += ~~((a & 0xffff) == (b & 0xffff));
        }
    }

    return total;
}

int main(int argc, char *argv[]) {
    char *line = NULL;
    size_t size;
    int64_t a, b;
    getline(&line, &size, stdin);
    sscanf(line, "%*s %*s %*s %*s %lld", &a);
    getline(&line, &size, stdin);
    sscanf(line, "%*s %*s %*s %*s %lld", &b);

    printf("Inputs: a = %lld, b = %lld\n", a, b);
    printf("Total (P1): %lld\n", judge_one(a, b));
    printf("Total (P2): %lld\n", judge_two(a, b));

    return 0;
}
