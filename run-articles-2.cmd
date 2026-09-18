@echo off
REM Run all the article generator scripts for the 13 new article PR
cd /d C:\Users\User\Desktop\machineknives
for %%f in (make-sg-paper.cjs append-sg-paper.cjs make-sg-shear.cjs append-sg-shear.cjs append-sg-shear-b.cjs make-sg-gran.cjs append-sg-gran.cjs append-sg-gran-b.cjs make-mt-resharp.cjs append-mt-resharp.cjs append-mt-resharp-b.cjs make-mt-prev.cjs append-mt-prev.cjs append-mt-prev-b.cjs make-tb-chip.cjs append-tb-chip.cjs make-tb-crack.cjs append-tb-crack.cjs make-cs-turkey.cjs append-cs-turkey.cjs append-cs-turkey-b.cjs make-cs-gran.cjs append-cs-gran.cjs append-cs-gran-b.cjs) do (
  if exist "%%f" (
    node "%%f" > nul 2>&1
  )
)
echo All article scripts run.
