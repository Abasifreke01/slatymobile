Add-Type -AssemblyName System.Drawing
$sourcePath = 'C:\Users\Owner\.gemini\antigravity\brain\5c7981ab-e04a-4887-a023-235e8781fc8f\slaty_official_play_store_icon_1772899909826.png'
$destPath = 'C:\Users\Owner\.gemini\antigravity\brain\5c7981ab-e04a-4887-a023-235e8781fc8f\slaty_play_icon_512x512_exact.png'

$img = [System.Drawing.Image]::FromFile($sourcePath)

Write-Host "Original Dimensions: $($img.Width) x $($img.Height)"

$bmp = New-Object System.Drawing.Bitmap(512, 512)
$gr = [System.Drawing.Graphics]::FromImage($bmp)
$gr.Clear([System.Drawing.Color]::Black)

# Center the image
$srcY = [math]::Max(0, [int](($img.Height - 512) / 2))
$srcX = [math]::Max(0, [int](($img.Width - 512) / 2))

$destRect = New-Object System.Drawing.Rectangle(0, 0, 512, 512)
$gr.DrawImage($img, $destRect, $srcX, $srcY, 512, 512, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gr.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Host "Successfully saved to $destPath"
