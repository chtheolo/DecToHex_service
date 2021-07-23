SELECT 'CREATE DATABASE devdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'devdb')\gexec

\c devdb;

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

SELECT * FROM conversions;

-- SELECT api_count FROM conversions;

-- -- SORTING by ascending and descending order the values 

-- SELECT true_count FROM conversions ORDER BY true_count ASC;

-- SELECT true_count FROM conversions ORDER BY true_count DESC;

-- SELECT false_count FROM conversions ORDER BY false_count ASC;

-- SELECT false_count FROM conversions ORDER BY false_count DESC;

-- SELECT read_execution_time, write_execution_time, api_execution_time FROM conversions; 

-- SELECT read_execution_time, write_execution_time, api_execution_time FROM conversions ORDER BY read_execution_time, write_execution_time, api_execution_time;

-- SELECT read_execution_time, write_execution_time, api_execution_time FROM conversions ORDER BY read_execution_time, write_execution_time, api_execution_time DESC;

-- -- WHERE clause 

-- -- See how many executions of the file we had in one day
-- SELECT * FROM conversions WHERE dateline = '2021-07-17';

-- SELECT * FROM conversions WHERE dateline >= '2021-07-17';

-- SELECT true_count FROM conversions WHERE dateline >= '2021-07-17' ORDER BY true_count;

-- -- Get read_executions between specific time executions
-- SELECT * FROM conversions WHERE read_execution_time >= 100.000;

-- SELECT * FROM conversions WHERE read_execution_time >= 100.000 AND read_execution_time <=380.000;

-- -- SELECT * FROM conversions WHERE dateline >= '2021-07-17' AND read_execution_time >= 100.000 AND read_execution_time <=380.000;

-- SELECT * FROM conversions WHERE dateline >= '2021-07-17' AND read_execution_time BETWEEN 100.000 AND 380.000;

-- -- Agregation

-- SELECT AVG(write_execution_time) as avg_write_execution_time, AVG(read_execution_time) as avg_read_execution_time, AVG(api_execution_time) as avg_api_execution_time FROM conversions;

-- SELECT AVG(true_count) as avg_true_count, AVG(false_count) as avg_false_count FROM conversions;

-- SELECT SUM(write_execution_time + read_execution_time + api_execution_time) as overall_execution_time from conversions WHERE created_at = '2021-07-17 19:11:33.386246+03';

-- -- Summary of the execution time for every operation (read, write, api) in ASC order
-- SELECT * FROM (SELECT SUM(write_execution_time + read_execution_time + api_execution_time)as overall_execution_time FROM conversions GROUP BY id) as sum_time ORDER BY sum_time; 