%% -*- erlang -*-

pos_is_eq(Pos1, Pos2) ->
    X1 = element(1, Pos1),
    Y1 = element(2, Pos1),
    X2 = element(1, Pos2),
    Y2 = element(2, Pos2),
    Xeq = X1 == X2,
    Yeq = Y1 == Y2,
    Xeq and Yeq.

exists([Tail], Pos) ->
    Eq = pos_is_eq(Tail, Pos),
    if
        Eq ->
            Tail;
        true ->
            none
    end;
exists([Head | Rest], Pos) ->
    Eq = pos_is_eq(Head, Pos),
    if
        Eq ->
            Head;
        true ->
            exists(Rest, Pos)
    end.

get_val(Spiral, Pos) ->
    Exists = exists(Spiral, Pos),
    if
        Exists == none ->
            0;
        true ->
            element(3, Exists)
    end.

sum_of_adj(Spiral, Pos) ->
    X = element(1, Pos),
    Y = element(2, Pos),
    % ⟶
    R = get_val(Spiral, {X+1, Y+0}),
    % ↗
    Ru = get_val(Spiral, {X+1, Y+1}),
    % ↑
    U = get_val(Spiral, {X+0, Y+1}),
    % ↖
    Lu = get_val(Spiral, {X-1, Y+1}),
    % ⟵
    L = get_val(Spiral, {X-1, Y+0}),
    % ↙
    Ld = get_val(Spiral, {X-1, Y-1}),
    % ↓
    D = get_val(Spiral, {X+0, Y-1}),
    % ↘
    Rd = get_val(Spiral, {X+1, Y-1}),
    R+Ru+U+Lu+L+Ld+D+Rd.

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

advance(Spiral, Pos, Dir) ->
    X = element(1, Pos) + advance_x(Dir),
    Y = element(2, Pos) + advance_y(Dir),
    Sum = sum_of_adj(Spiral, {X, Y}),
    {X, Y, Sum}.

check_larger(Sum, Until) when Sum > Until ->
    io:format("Larger than input: ~p~n", [Sum]);
check_larger(Sum, Until) -> none.

spiral(Until, N, _, Dir, Spiral) when N == 1 ->
    Second = {1, 0, 1},
    spiral(Until, N+1, Second, Dir, [Second] ++ Spiral);
spiral(Until, N, _, _, Spiral) when Until == N -> Spiral;
spiral(Until, N, Pos, Dir, [Head|_]=Spiral) ->
    CurrentSum = element(3, Head),
    _ = check_larger(CurrentSum, Until),
    %
    LeftTheta = (Dir + 90) rem 360,
    Left = advance(Spiral, Pos, LeftTheta),
    Exists = exists(Spiral, Left),
    if
        Exists == none ->
            spiral(Until, N+1, Left, LeftTheta, [Left] ++ Spiral);
        true ->
            Forward = advance(Spiral, Pos, Dir),
            spiral(Until, N+1, Forward, Dir, [Forward] ++ Spiral)
    end.

spiral(Until) ->
    First = {0, 0, 1},
    spiral(Until, 1, First, 0, [First]).

distance(Pos) ->
    X = erlang:abs(element(1, Pos)),
    Y = erlang:abs(element(2, Pos)),
    X + Y.

%% main/1 for escript.
main([Arg]) ->
    Input = list_to_integer(Arg),
    Spiral = spiral(Input),
    [Head | _] = Spiral,
    erlang:display(Head),
    Dist = distance(Head),
    erlang:display(Dist).
