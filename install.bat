@echo off
python -m venv .venv
if "%COMSPEC%" == "%SystemRoot%\system32\cmd.exe" (
    call .venv\Scripts\activate
) else (
    . .\.venv\Scripts\activate
)
pip install -r requirements.txt