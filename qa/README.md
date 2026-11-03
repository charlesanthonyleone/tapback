# QA
From the repo root: `python3 -m http.server 8931 &`, then
- `python3 qa/offline_mobile.py`: service-worker offline check + overflow at 360/390/768 + screenshots in qa/out
- `(cd qa && npm i axe-core@4) && python3 qa/axe_audit.py`: axe-core on every page
Requires `pip install playwright && playwright install chromium`.
