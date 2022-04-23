FROM postgres:13

COPY 00_create_tables.sql /docker-entrypoint-initdb.d/
COPY 01_insert_exercises.sql /docker-entrypoint-initdb.d/
COPY 02_insert_muscle_groups.sql /docker-entrypoint-initdb.d/
COPY 03_insert_exercise_muscle_groups.sql /docker-entrypoint-initdb.d/
# COPY extensions.sql /docker-entrypoint-initdb.d/
