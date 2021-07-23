#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL

        CREATE TABLE IF NOT EXISTS conversions(
            id SERIAL PRIMARY KEY,
            decimal INT,
            hexadecimal VARCHAR,
            steps_count INT,
            execution_time FLOAT,
            no_number_error BOOLEAN,
            no_integer_error BOOLEAN,
            dateline DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
EOSQL