@echo off
cd /d C:\Users\User\Desktop\machineknives
node gen-glossary.cjs > nul
node -e "const g=require('./gen-glossary.cjs'); g.run(require('./data-gl-fail-a.cjs'), './src/data/post'); g.run(require('./data-gl-fail-b.cjs'), './src/data/post'); g.run(require('./data-gl-fail-c.cjs'), './src/data/post');"
echo Done.
