FROM postgres:alpine
ENV POSTGRES_DB feed
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
RUN mkdir -p /scripts/
COPY ./etc/docker/storage/sql/*.sql /scripts/
COPY ./etc/docker/storage/init.sh /docker-entrypoint-initdb.d/
