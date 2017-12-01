-module(part2).
-export([sum/1]).
-import(day1_lib, [str_to_int_list/1]).

% sum/4
sum([Last], Rotated, Result, Incr) ->
    Next = lists:nth(Incr, Rotated),
    if
        Last == Next ->
            Last + Result;
        true ->
            Result
    end;
sum([Head | Rest], Rotated, Result, Incr) ->
    Next = lists:nth(Incr, Rotated),
    [RotHead | RotRest] = Rotated,
    if
        Head == Next ->
            Head + sum(Rest, RotRest ++ [RotHead], Result, Incr);
        true ->
            sum(Rest, RotRest ++ [RotHead], Result, Incr)
    end.

% sum/2
sum(IntList, Incr) -> sum(IntList, IntList, 0, Incr).

% sum/1
sum(String) ->
    IntList = str_to_int_list(String),
    Incr = trunc(string:length(String) / 2) + 1,
    sum(IntList, Incr).
