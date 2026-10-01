# Backend of MDL
## .env fields
 - ORIGINS=origin1,origin2
 - SKIP_ALREADY_DOWNLOADED=true / false (skips songs you already downloaded in the past)

start dev:
```bash
uvicorn main:app --reload
```