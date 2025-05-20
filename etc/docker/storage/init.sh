#!/bin/bash
set -e
echo 'executing custom script'
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    \c feed;
    \i /scripts/init.sql;
    \i /scripts/seed.sql;
EOSQL