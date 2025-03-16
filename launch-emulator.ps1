# navigate to the emulator directory
Set-Location "$Env:LOCALAPPDATA\Android\Sdk\emulator"

# Start emulator (replace Pixel_7_API_35 with your emulator's name)
.\emulator.exe -avd Pixel_7_API_35 -no-snapshot-load

# Wait until emulator fully boots (optional: wait a few seconds)
Start-Sleep -Seconds 10

# Check if emulator is detected by adb
Set-Location "$Env:LOCALAPPDATA\Android\Sdk\platform-tools"
.\adb.exe wait-for-device

Write-Output "✅ Emulator is now connected!"
