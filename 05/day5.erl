%% -*- erlang -*-

%% utils
read_line(List) ->
    GetLine = io:get_line(""),
    if
        GetLine /= eof ->
            Line = string:trim(GetLine, trailing, "\n"),
            {Num, _} = string:to_integer(Line),
            read_line([Num] ++ List);
        true ->
            List
    end.
read_stdin() -> read_line([]).

%% rot_left/2.
rot_left(0, Q) -> Q;
rot_left(N, Q) ->
    {{_, Head}, Next} = queue:out(Q),
    rot_left(N-1, queue:in(Head, Next)).

%% rot_right/2.
rot_right(0, Q) -> Q;
rot_right(N, Q) ->
    {{_, Tail}, Next} = queue:out_r(Q),
    rot_right(N+1, queue:in_r(Tail, Next)).

%% advance/2.
advance(N, Stack) ->
    if
        N > 0 -> rot_left(N, Stack);
        N < 0 -> rot_right(N, Stack);
        true -> Stack
    end.

%% inc_stack_head/2.
inc_stack_head(N, Stack) ->
    {{_, Head}, Q} = queue:out(Stack),
    queue:in_r(Head+N, Q).

%% main/1 for escript.
main(_) ->
    List = lists:reverse(read_stdin()),
    Part1 = maze_one(List),
    io:format("Part 1: ~p steps.~n", [Part1]),
    Part2 = maze_two(List),
    io:format("Part 2: ~p steps.~n", [Part2]).

%% maze_one/1.
maze_one(Max, Pc, Sp, Stack) when Sp =< Max ->
    {_, Head} = queue:peek(Stack),
    Next = advance(Head, inc_stack_head(1, Stack)),
    maze_one(Max, Pc+1, Sp+Head, Next);
maze_one(_, Pc, _, _) -> Pc.
maze_one(L) ->
    Len = length(L),
    maze_one(Len, 0, 1, queue:from_list(L)).

%% maze_two/1.
calc_stack_head(Offset, Stack) ->
    if
        Offset >= 3 -> inc_stack_head(-1, Stack);
        true -> inc_stack_head(1, Stack)
    end.

maze_two(Max, Pc, Sp, Stack) when Sp =< Max ->
    {_, Head} = queue:peek(Stack),
    Next = advance(Head, calc_stack_head(Head, Stack)),
    maze_two(Max, Pc+1, Sp+Head, Next);
maze_two(_, Pc, _, _) -> Pc.
maze_two(L) ->
    Len = length(L),
    maze_two(Len, 0, 1, queue:from_list(L)).
