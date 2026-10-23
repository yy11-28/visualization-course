# verify-site.ps1 — 遍历站点全部页面，汇总 console 错误
$pages = @(
  "/", "/lesson-01/", "/lesson-02/", "/lesson-03/", "/lesson-04/", "/lesson-05/",
  "/tools/pathway/", "/tools/graph/", "/tools/concepts/", "/tools/pitfalls/", "/tools/glossary/", "/tools/quiz/",
  "/supplementary/",
  "/supplementary/calendar.html", "/supplementary/calendar1.html", "/supplementary/calendar3.html",
  "/supplementary/colormap.html", "/supplementary/contour.html", "/supplementary/contourd3.html",
  "/supplementary/crime1985.html", "/supplementary/mark.html", "/supplementary/newstudent.html",
  "/supplementary/nssystem.html", "/supplementary/regression.html", "/supplementary/sex_compare.html",
  "/supplementary/tableshow.html", "/supplementary/treelist.html",
  "/lesson-01/demo/",
  "/lesson-01/demo/01-data-loader/", "/lesson-01/demo/02-dikw-pyramid/",
  "/lesson-01/demo/03-attribute-types/", "/lesson-01/demo/04-d3-array-ops/",
  "/lesson-01/demo/05-selectors/"
)

$allOk = $true
foreach ($p in $pages) {
  $null = playwright-cli goto ("http://localhost:8080" + $p) 2>&1
  Start-Sleep -Milliseconds 1100
  $con = (playwright-cli console 2>&1 | Out-String)
  $errLines = ($con -split "`n" | Select-String '\[ERROR\]' | ForEach-Object { $_.Line.Trim() }) | Select-Object -Unique -First 3
  $errCount = ($con -split "`n" | Select-String '\[ERROR\]').Count
  $status = if ($errCount -eq 0) { "OK" } else { $allOk = $false; "$errCount ERR" }
  Write-Output ("{0,-42} {1}" -f $p, $status)
  foreach ($e in $errLines) { Write-Output ("      " + $e.Substring(0, [Math]::Min(140, $e.Length))) }
}
if ($allOk) { Write-Output "`n== ALL PAGES CLEAN ==" } else { Write-Output "`n== SOME PAGES HAVE ERRORS ==" }
