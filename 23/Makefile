default: clean day23 run

day23: day23.part2.c
	gcc -o day23.part2 day23.part2.c -Ofast

run:
	time cat input.txt | ./day23.part2

clean:
	rm -rf ./day23.part2
