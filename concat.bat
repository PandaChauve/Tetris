@echo off
del concatenated.cjs
for /r "." %%F in (*.min.js) do type "%%F" >>concatenated.cjs