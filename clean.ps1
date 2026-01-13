# Clean Next.js build artifacts
# Run this script if you encounter EINVAL errors or build issues

Write-Host "Cleaning Next.js build artifacts..." -ForegroundColor Yellow

# Remove .next folder
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Removed .next folder" -ForegroundColor Green
} else {
    Write-Host "✓ .next folder doesn't exist" -ForegroundColor Green
}

# Remove node_modules/.cache if it exists
if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "✓ Removed node_modules/.cache" -ForegroundColor Green
}

Write-Host "`nCleanup complete! You can now run 'npm run dev'" -ForegroundColor Green
