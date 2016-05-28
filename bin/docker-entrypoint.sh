#!/bin/sh

# set from .env
eval "$(cat /opt/aiva/.env | sed 's/^/export /')"

# set your password the first time from the default neo4j:neo4j, or just pass
if [ "${NEO4J_AUTH:-}" == "none" ]; then
    echo "dbms.security.auth_enabled=false" >> /etc/neo4j/neo4j.conf
elif [[ "${NEO4J_AUTH:-}" == neo4j:* ]]; then
    password="${NEO4J_AUTH#neo4j:}"
    echo "Using NEO4J_AUTH: '$NEO4J_AUTH' and $password"
    neo4j start

    echo "Attempting to verify/set your NEO4J_AUTH..."
    end="$((SECONDS+30))"
    while true; do
        http_code="$(curl --silent --write-out %{http_code} --user "neo4j:${password}" --output /dev/null http://localhost:7474/db/data/ || true)"

        if [[ "${http_code}" = "200" ]]; then
            echo "NEO4J_AUTH valid, auth successful"
            break;
        fi

        if [[ "${http_code}" =~ ^4.* ]]; then
            echo "Changing default Neo4j password"
            curl --fail --silent --show-error --user neo4j:neo4j \
                 --data '{"password": "'"${password}"'"}' \
                 --header 'Content-Type: application/json' \
                 http://localhost:7474/user/neo4j/password
            # break;
        fi

        if [[ "${SECONDS}" -ge "${end}" ]]; then
            echo "End of Neo4j auth attempts, Neo4j failed to start."
            echo "This may due to a process was ran from docker-machine. Try shutting down your VM if you're running on the host machine."
            break;
        fi

        sleep 1
    done

    # neo4j stop
elif [ -n "${NEO4J_AUTH:-}" ]; then
    echo "Invalid value for NEO4J_AUTH: '${NEO4J_AUTH}'"
    exit 1
fi

$SHELL