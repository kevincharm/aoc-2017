%% -*- erlang -*-
%% Usage: `cat ./tests/test3.txt | escript day2.erl`

%% Convert string to list of ints.
row_to_int_cols(String) ->
    StrCols = string:lexemes(String, "\s"),
    lists:map(fun(X) -> {Int, _} = string:to_integer(X), Int end, StrCols).

%% Use read_stdin/1. Read stdin until EOF and return as list of strings.
read_line(Rows) ->
    GetLine = io:get_line(""),
    if
        GetLine /= eof ->
            Line = string:trim(GetLine, trailing, "\n"),
            Cols = row_to_int_cols(Line),
            read_line([Cols] ++ Rows);
        true ->
            Rows
    end.
read_stdin() -> read_line([]).

%% Use row_max/1. Reduces row to max value of its columns.
row_max([Tail], Result) ->
    if
        Tail > Result ->
            Tail;
        true ->
            Result
    end;
row_max([Head | Rest], Result) ->
    if
        Head > Result ->
            row_max(Rest, Head);
        true ->
            row_max(Rest, Result)
    end.
row_max([Head | Rest]) -> row_max(Rest, Head).

%% Use row_min/1. Reduces row to min value of its columns.
row_min([Tail], Result) ->
    if
        Tail < Result ->
            Tail;
        true ->
            Result
    end;
row_min([Head | Rest], Result) ->
    if
        Head < Result ->
            row_min(Rest, Head);
        true ->
            row_min(Rest, Result)
    end.
row_min([Head | Rest]) -> row_min(Rest, Head).

%% Part 1 solution:
find_diff(Cols) ->
    Max = row_max(Cols),
    Min = row_min(Cols),
    erlang:abs(Max - Min).

checksum_one([Cols], Sum) ->
    Diff = find_diff(Cols),
    Sum + Diff;
checksum_one([Cols | RestRows], Sum) ->
    Diff = find_diff(Cols),
    checksum_one(RestRows, Sum + Diff).
checksum_one(Rows) -> checksum_one(Rows, 0).

%% Part 2 solution:
find_div_in_col(Num, [Tail]) ->
    if
        Num rem Tail == 0 ->
            Num / Tail;
        Tail rem Num == 0 ->
            Tail / Num;
        true ->
            none
    end;
find_div_in_col(Num, [Head | Rest]) ->
    if
        Num rem Head == 0 ->
            Num / Head;
        Head rem Num == 0 ->
            Head / Num;
        true ->
            find_div_in_col(Num, Rest)
    end.
find_div([_]) -> 0;
find_div([Head | Rest]) ->
    Result = find_div_in_col(Head, Rest),
    if
        Result == none ->
            find_div(Rest);
        true ->
            trunc(Result)
    end.

checksum_two([Cols], Sum) ->
    Div = find_div(Cols),
    Sum + Div;
checksum_two([Cols | RestRows], Sum) ->
    Div = find_div(Cols),
    checksum_two(RestRows, Sum + Div).
checksum_two(Rows) -> checksum_two(Rows, 0).

%% main/1 for escript.
main(_) ->
    Rows = read_stdin(),
    ChecksumOne = checksum_one(Rows),
    ChecksumTwo = checksum_two(Rows),
    erlang:display(ChecksumOne),
    erlang:display(ChecksumTwo).
