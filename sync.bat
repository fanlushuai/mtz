
@echo off

setlocal enabledelayedexpansion

set PC_FOLDER_PATH="D:\github\reader"

set PHONE_FOLDER_PATH=/storage/emulated/0/autojs/

set PHONE_BUILD_FOLDER_PATH=/storage/emulated/0/autojs/reader

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
adb disconnect

endlocal
