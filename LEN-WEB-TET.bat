@echo off
setlocal
cd /d "%~dp0"
echo === VinPrint: dua dot Tet 2027 len GitHub (nhanh agent-evolution/tet-2027) ===
git rev-parse --is-inside-work-tree >nul 2>&1 || (echo Khong phai thu muc git. & pause & exit /b 1)
git checkout -b agent-evolution/tet-2027 2>nul || git checkout agent-evolution/tet-2027 || (echo Khong chuyen duoc nhanh. & pause & exit /b 1)
git add -- "app/lib/seasonal-pages.ts" "app/lib/content-pages.ts" "app/lib/site-content.ts" "app/lib/business-info.ts" "app/components/content/ContentPage.tsx" "app/components/home/SeasonalBanner.tsx" "app/components/home/StructuredData.tsx" "app/page.tsx" "app/layout.tsx" "app/sitemap.ts" "app/llms.txt/route.ts" "tests/rendered-html.test.mjs" "tests/admin-nav.test.ts" "app/components/admin/admin-nav.ts" "app/components/admin/AdminShell.tsx" "app/admin/page.tsx" "app/admin/bai-viet/page.tsx" "app/admin/hinh-anh/page.tsx" "app/admin/noi-dung/page.tsx" "app/components/admin/BlogDashboard.tsx" "app/components/admin/ContentAdmin.tsx" "app/components/admin/HeroImageAdmin.tsx" "README.md" "KE-HOACH-SEO-TET-2027.md" "LEN-WEB-TET.bat" || (echo git add loi. & pause & exit /b 1)
git rm -q --ignore-unmatch -- "app/components/admin/AdminNav.tsx"
git commit -m "feat: trang mua Tet 2027, in tem Tet lay lien, sua dia chi An Phu Dong, FAQ + link lien quan, khung quan tri moi (sidebar, Ctrl+K, tong quan)" -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_017W34nZAZbBBniUXf5GwSLw" || (echo Khong co gi de commit hoac commit loi. & pause & exit /b 1)
git push -u origin agent-evolution/tet-2027 || (echo Push loi. & pause & exit /b 1)
echo.
echo XONG. Mo link duoi day, bam "Create pull request", cho dau tick xanh roi bam Merge:
echo https://github.com/cdrvietnam-tech/vinprint/compare/main...agent-evolution/tet-2027?expand=1
start "" "https://github.com/cdrvietnam-tech/vinprint/compare/main...agent-evolution/tet-2027?expand=1"
pause
