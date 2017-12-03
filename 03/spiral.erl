%% -*- erlang -*-

advance_x(Dir) ->
    case Dir of
        0 -> 1;
        180 -> -1;
        90 -> 0;
        270 -> 0
    end.

advance_y(Dir) ->
    case Dir of
        90 -> 1;
        270 -> -1;
        0 -> 0;
        180 -> 0
    end.

advance(Pos, Dir) ->
    X = element(1, Pos),
    Y = element(2, Pos),
    {X + advance_x(Dir), Y + advance_y(Dir)}.

exists([Tail], Pos) ->
    if
        Tail == Pos ->
            Tail;
        true ->
            none
    end;
exists([Head | Rest], Pos) ->
    if
        Head == Pos ->
            Head;
        true ->
            exists(Rest, Pos)
    end.

spiral(Until, N, _, Dir, Spiral) when N == 1 ->
    Second = {1, 0},
    spiral(Until, N+1, Second, Dir, [Second] ++ Spiral);
spiral(Until, N, _, _, Spiral) when Until == N -> Spiral;
spiral(Until, N, Pos, Dir, Spiral) ->
    LeftTheta = (Dir + 90) rem 360,
    Left = advance(Pos, LeftTheta),
    Exists = exists(Spiral, Left),
    if
        Exists == none ->
            spiral(Until, N+1, Left, LeftTheta, [Left] ++ Spiral);
        true ->
            Forward = advance(Pos, Dir),
            spiral(Until, N+1, Forward, Dir, [Forward] ++ Spiral)
    end.

spiral(Until) ->
    First = {0, 0},
    spiral(Until, 1, First, 0, [First]).

distance(Pos) ->
    X = erlang:abs(element(1, Pos)),
    Y = erlang:abs(element(2, Pos)),
    X + Y.

%% main/1 for escript.
main([Arg]) ->
    Input = list_to_integer(Arg)
    Spiral = spiral(Arg),
    [Head | _] = Spiral,
    Dist = distance(Head),
    erlang:display(Dist).
