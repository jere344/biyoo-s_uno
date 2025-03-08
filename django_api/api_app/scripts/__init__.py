from . import cardscript

get_run:dict[str, callable] = {
    "cardscript": cardscript.run
}