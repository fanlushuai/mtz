
@echo off

setlocal enabledelayedexpansion

set PC_FOLDER_PATH="E:\code\mtz"

set PHONE_FOLDER_PATH=/storage/emulated/0/autojs/

set PHONE_BUILD_FOLDER_PATH=/storage/emulated/0/autojs/mtz/inHereBuild

adb devices
 
:devicecheck
adb get-state | find "device"
if %errorlevel% neq 0 (
    echo device can not found £¬please check your connect
    pause
    exit
)

adb shell mkdir -p "%PHONE_FOLDER_PATH%"
adb push "%PC_FOLDER_PATH%" "%PHONE_FOLDER_PATH%"
adb push "%PC_FOLDER_PATH%" "%PHONE_BUILD_FOLDER_PATH%"
@REM adb disconnect

endlocal
