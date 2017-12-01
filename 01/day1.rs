use std::env;

fn str_to_u32_vec(input: &str, output: &mut Vec<u32>) {
    // Get a Vec<u32> from the input slice so we can do math.
    for c in input.chars() {
        let i = c.to_digit(10).unwrap();
        output.push(i);
    }
}

fn part1(input: &Vec<u32>) -> u32 {
    let mut sum = 0;

    for (i, curr) in input.iter().enumerate() {
        let next = input[(i+1) % input.len()];
        if *curr == next {
            *(&mut sum) += curr;
        }
    }

    sum
}

fn part2(input: &Vec<u32>) -> u32 {
    let mut sum = 0;
    let ilen = input.len();
    let halflen = ilen / 2;

    for (i, curr) in input.iter().enumerate() {
        let next = input[(i+halflen) % ilen];
        if *curr == next {
            *(&mut sum) += curr;
        }
    }

    sum
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let input = &args[1];
    let mut input_ints = vec![];
    str_to_u32_vec(input, &mut input_ints);
    println!("Part 1: {}", part1(&input_ints));
    println!("Part 2: {}", part2(&input_ints));
}
