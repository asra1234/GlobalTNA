$enc = New-Object System.Text.UTF8Encoding($false)
function CU { param([int[]]$cps) -join ($cps | ForEach-Object { [char]$_ }) }
function UC { param([int]$cp) [char]::ConvertFromUtf32($cp) }

# Each pair: [corrupted, correct]
$fix = @(
  @( (CU @(0xF0,0x178,0x2014,0x201A,0xEF,0xB8,0x8F)), ((UC 0x1F5C2)+[char]0xFE0F) ),
  @( (CU @(0xF0,0x178,0x201D,0xA7)),                   (UC 0x1F527) ),
  @( (CU @(0xE2,0x161,0xA1)),                           (UC 0x26A1) ),
  @( (CU @(0xF0,0x178,0x17D,0xA8)),                     (UC 0x1F3A8) ),
  @( (CU @(0xF0,0x178,0xAA,0x161)),                     (UC 0x1FA9A) ),
  @( (CU @(0xF0,0x178,0x201D,0xA8)),                    (UC 0x1F528) ),
  @( (CU @(0xE2,0x161,0xA0,0xEF,0xB8,0x8F)),           ((UC 0x26A0)+[char]0xFE0F) ),
  @( (CU @(0xF0,0x178,0x201C,0x2039)),                  (UC 0x1F4CB) ),
  @( (CU @(0xF0,0x178,0x201C,0x8D)),                    (UC 0x1F4CD) ),
  @( (CU @(0xF0,0x178,0x2018,0xA4)),                    (UC 0x1F464) ),
  @( (CU @(0xE2,0x153,0x2030,0xEF,0xB8,0x8F)),         ((UC 0x2709)+[char]0xFE0F) ),
  @( (CU @(0xF0,0x178,0x2014,0x2018)),                  (UC 0x1F5D1) ),
  @( (CU @(0xEF,0xBC,0x2039)),                          [char]0xFF0B ),
  @( (CU @(0xE2,0x2020,0xBB)),                          [char]0x21BB ),
  @( (CU @(0xE2,0x2020,0x90)),                          [char]0x2190 ),
  @( (CU @(0xE2,0x153,0x201C)),                         [char]0x2713 ),
  @( (CU @(0xE2,0x20AC,0xA6)),                          [char]0x2026 ),
  @( (CU @(0xE2,0x20AC,0x201D)),                        [char]0x2014 ),
  @( (CU @(0xE2,0x2014,0x8F)),                          [char]0x25CF )
)

$files = @(
  "D:\GlobalTNA\frontend\app\page.js",
  "D:\GlobalTNA\frontend\app\jobs\new\page.js",
  "D:\GlobalTNA\frontend\app\jobs\[id]\page.js"
)

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file, $enc)
  $total = 0
  foreach ($pair in $fix) {
    $before = $content
    $content = $content.Replace($pair[0], $pair[1])
    if ($content -ne $before) { $total++ }
  }
  [System.IO.File]::WriteAllText($file, $content, $enc)
  Write-Host "Fixed $total pattern(s) in: $(Split-Path $file -Leaf)"
}
Write-Host "Done."
