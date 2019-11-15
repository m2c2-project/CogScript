cd code
SET dolph=sdcard/dolphin/script

adb shell "mkdir %dolph%"

for %%i in (*) do (adb push %%i %dolph%)

adb shell "mkdir %dolph%/test_game"

for %%i in (test_game/*) do (adb push test_game/%%i %dolph%/test_game)

adb shell "mkdir %dolph%/test_game2"

for %%i in (test_game2/*) do (adb push test_game2/%%i %dolph%/test_game2)

adb shell "mkdir %dolph%/newscript"

for %%i in (newscript/*) do (adb push newscript/%%i %dolph%/newscript)

adb shell "mkdir %dolph%/evenodd"

for %%i in (evenodd/*) do (adb push evenodd/%%i %dolph%/evenodd)

adb shell "mkdir %dolph%/symbolsearch"

for %%i in (symbolsearch/*) do (adb push symbolsearch/%%i %dolph%/symbolsearch)

adb shell "mkdir %dolph%/dotmemory"

for %%i in (dotmemory/*) do (adb push dotmemory/%%i %dolph%/dotmemory)

adb shell "mkdir %dolph%/cogtask_demo1"

for %%i in (cogtask_demo1/*) do (adb push cogtask_demo1/%%i %dolph%/cogtask_demo1)

adb shell "mkdir %dolph%/cogtask_demo2"

for %%i in (cogtask_demo2/*) do (adb push cogtask_demo2/%%i %dolph%/cogtask_demo2)

adb shell "mkdir %dolph%/cogtask_trial1"

for %%i in (cogtask_trial1/*) do (adb push cogtask_trial1/%%i %dolph%/cogtask_trial1)

pause