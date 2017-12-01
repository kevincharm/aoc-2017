-module(day1_lib).
-export([str_to_int_list/1]).

str_to_int_list(String) ->
    CharList = [[X] || X <- String],
    lists:map(fun(X) -> {Int, _} = string:to_integer(X), Int end, CharList).
