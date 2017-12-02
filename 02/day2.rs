use std::io;

fn split_str_to_u32_vec(input: &str, output: &mut Vec<u32>) {
    // Turn a row slice into columns of integers.
    for token in input.split_whitespace() {
        let i: u32 = token.parse().unwrap();
        output.push(i);
    }
}

fn chksum_one(rows: &Vec<Vec<u32>>) -> u32 {
    let mut sum = 0;
    for row in rows {
        let max = *row.iter().max().unwrap() as i32;
        let min = *row.iter().min().unwrap() as i32;
        let diff = (max - min).abs() as u32;
        sum += diff;
    }

    sum
}

fn find_div(row: &Vec<u32>) -> u32 {
    let mut div = 0;
    for (i1, c1) in row.iter().enumerate() {
        for (i2, c2) in row.iter().enumerate() {
            if i1 == i2 {
                break;
            }
            if c1 % c2 == 0 {
                div = c1 / c2;
            } else if c2 % c1 == 0 {
                div = c2 / c1;
            }
        }
    }

    div
}

fn chksum_two(rows: &Vec<Vec<u32>>) -> u32 {
    let mut sum = 0;
    for row in rows {
        let div = find_div(&row);
        sum += div;
    }

    sum
}

fn main() {
    let mut rows: Vec<Vec<u32>> = vec![];
    let stdin = io::stdin();
    loop {
        let mut buffer = String::new();
        match stdin.read_line(&mut buffer) {
            Err(_) => {},
            Ok(bytes) => if bytes == 0 { break; }
        }
        let trimmed = String::from(buffer.trim_matches('\n'));
        let mut cols = vec![];
        split_str_to_u32_vec(&trimmed, &mut cols);
        &rows.push(cols);
    }

    println!("Part 1: {}", chksum_one(&rows));
    println!("Part 2: {}", chksum_two(&rows));
}
