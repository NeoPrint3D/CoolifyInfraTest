docker run --name postgres-container \
  --env-file .env.local \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:16