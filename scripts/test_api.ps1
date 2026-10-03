$bytes = [System.IO.File]::ReadAllBytes('d:\engl\vocakids\scripts\dog.wav')
$b64 = [Convert]::ToBase64String($bytes)
$bodyObj = @{
    audioBase64 = $b64
    mimeType = 'audio/wav'
    targetWord = 'dog'
    targetVi = 'Con chó'
}
$bodyJson = $bodyObj | ConvertTo-Json -Compress
$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/pronunciation' -Method POST -ContentType 'application/json' -Body $bodyJson
$res | ConvertTo-Json
