Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\nizar\Desktop\MS10\MS10shop\backend"
WshShell.Run "cmd /c ""C:\Program Files\nodejs\npx.cmd"" ts-node-dev --respawn --transpile-only src/index.ts", 0, False
