Add-Type -AssemblyName System.Drawing
$sourcePath = 'C:\Users\Owner\.gemini\antigravity\brain\5c7981ab-e04a-4887-a023-235e8781fc8f\slaty_refined_feature_graphic_v2_1772901216761.png'
$destPath = 'C:\Users\Owner\.gemini\antigravity\brain\5c7981ab-e04a-4887-a023-235e8781fc8f\slaty_feature_graphic_1024x500_exact.png'

$img = [System.Drawing.Image]::FromFile($sourcePath)

Write-Host "Original Dimensions: $($img.Width) x $($img.Height)"

$bmp = New-Object System.Drawing.Bitmap(1024, 500)
$gr = [System.Drawing.Graphics]::FromImage($bmp)
$gr.Clear([System.Drawing.Color]::Black)

# If the original is 1024x1024, we crop the middle 500 pixels vertically
$srcY = [math]::Max(0, [int](($img.Height - 500) / 2))
$srcX = [math]::Max(0, [int](($img.Width - 1024) / 2))

$destRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 500)
$gr.DrawImage($img, $destRect, $srcX, $srcY, 1024, 500, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gr.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Host "Successfully saved to $destPath"
