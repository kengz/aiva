#!/bin/sh

# set from .env
eval "$(cat .env | sed 's/^/export /')"

# set your password the first time from the default neo4j:neo4j, or just pass
if [ "${NEO4J_AUTH:-}" == "none" ]; then
    echo "dbms.security.auth_enabled=false" >> /etc/neo4j/neo4j.conf
elif [[ "${NEO4J_AUTH:-}" == neo4j:* ]]; then
    password="${NEO4J_AUTH#neo4j:}"
    neo4j start

    end="$((SECONDS+10))"
    while true; do
        http_code="$(curl --silent --write-out %{http_code} --user "neo4j:${password}" --output /dev/null http://localhost:7474/db/data/ || true)"

        if [[ "${http_code}" = "200" ]]; then
            break;
        fi

        if [[ "${http_code}" = "403" ]]; then
            echo "changing default password"
            curl --fail --silent --show-error --user neo4j:neo4j \
                 --data '{"password": "'"${password}"'"}' \
                 --header 'Content-Type: application/json' \
                 http://localhost:7474/user/neo4j/password
            break;
        fi

        if [[ "${SECONDS}" -ge "${end}" ]]; then
            (echo "Neo4j failed to start" && exit 1)
        fi

        sleep 1
    done

    neo4j stop
elif [ -n "${NEO4J_AUTH:-}" ]; then
    echo "Invalid value for NEO4J_AUTH: '${NEO4J_AUTH}'"
    exit 1
fi