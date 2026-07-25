Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\nizar\Desktop\MS10\MS10shop\frontend"
WshShell.Run "cmd /c ""C:\Program Files\nodejs\npx.cmd"" next dev -p 3000", 0, False
