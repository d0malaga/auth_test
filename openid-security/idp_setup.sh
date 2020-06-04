# Use a prepackaged keycloak
KEYCLOAK_IMAGE=quay.io/keycloak/keycloak:10.0.2

#
# Script to launch a keycloak IdP docker with a new realm
# (admin UI: http://localhost:8080/auth/admin/)
# See https://hub.docker.com/r/jboss/keycloak/

# settings for confbox ldap, access, tic
# if ldap/web have real dns names you can use those instead of ip address
if [ -z "$WEB_HOST" -a -z "$WEB_URL" ]; then
    WEB_HOST=$(ip route get 8.8.8.8 | head -1 | cut -d' ' -f7)
    echo 'Warning: no ${WEB_HOST} or ${WEB_URL} using default '${WEB_HOST}
fi

LDAP_HOST=${LDAP_HOST:-${WEB_HOST}}
export WEB_URL=${WEB_URL:-http://${WEB_HOST}:8080/openid-security}
export LDAP_URL=${LDAP_URL:-ldap://${LDAP_HOST}:389}

echo "Patching realm file:"
echo $LDAP_URL
echo $WEB_URL
KEYCLOAK_REALM_FILE=/tmp/realm_data.json
cp idp_realm_auth_test.json ${KEYCLOAK_REALM_FILE}
sed -i "s;http://WEB_HOST:8080/openid-security;${WEB_URL};g" ${KEYCLOAK_REALM_FILE}
sed -i "s;ldap://LDAP_HOST:389;${LDAP_URL};g" ${KEYCLOAK_REALM_FILE}

# Import predefined realm. Do not detach, log is useful for troubleshooting
docker run --rm -p 8081:8080 --name keycloak_idp -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -e  KEYCLOAK_IMPORT=/tmp/realm_data.json -v ${KEYCLOAK_REALM_FILE}:/tmp/realm_data.json ${KEYCLOAK_IMAGE}

# A realm can be configured manually and then exported using commands like:

# Start an empty Idp, mount an export dir
# mkdir tmp
# docker run --rm -d -p 8180:8080 --name kc_tmp -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -v $(pwd)/tmp:/tmp $IMAGE

# Manually define a new realm called auth_test and export it from the docker
# docker exec -it kc_tmp /opt/jboss/keycloak/bin/standalone.sh -Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.usersExportStrategy=REALM_FILE -Dkeycloak.migration.realmName=auth_test -Dkeycloak.migration.file=/tmp/export_realm.json
