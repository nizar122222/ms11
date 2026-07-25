@echo off
set PATH=C:\Program Files\nodejs;C:\Program Files\PostgreSQL\16\bin;%PATH%
cd /d C:\Users\nizar\Desktop\MS10\MS10shop\backend
npx.cmd ts-node-dev --respawn --transpile-only src/index.ts
