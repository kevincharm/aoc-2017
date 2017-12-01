-module(part1).
-export([sum/1]).
-import(day1_lib, [str_to_int_list/1]).

% sum/3
sum([Last], First, Result) ->
    if
        First == Last ->
            Last + Result;
        true ->
            Result
    end;
sum([Head, Next | Rest], First, Result) ->
    if
        Head == Next ->
            Head + sum([Next | Rest], First, Result);
        true ->
            sum([Next | Rest], First, Result)
    end.

% sum/1
sum(String) ->
    IntList = str_to_int_list(String),
    [Head | _] = IntList,
    sum(IntList, Head, 0).
