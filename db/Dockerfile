FROM postgres:16

COPY designDatabase.sql /docker-entrypoint-initdb.d/designDatabase.sql

RUN chmod 644 /docker-entrypoint-initdb.d/designDatabase.sql