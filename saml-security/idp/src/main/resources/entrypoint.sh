#!/bin/bash
#
# Script to launch a keycloak IdP docker with a new realm
# (admin UI: http://localhost:8080/auth/admin/)
# See https://hub.docker.com/r/jboss/keycloak/

if [ -z "$LDAP_URL" -o -z "$WEB_URL" ]; then
    echo 'Error: both ${LDAP_URL}='$LDAP_URL' and ${WEB_URL}='$WEB_URL' must be defined.'
    echo 'Aborting IdP startup'
    exit 1
fi

KEYCLOAK_REALM_FILE=/tmp/config/realm_data.json
echo "Patching realm file: $KEYCLOAK_REALM_FILE"
echo $LDAP_URL
echo $WEB_URL
sed -i "s;http.*/saml-security-wildfly;${WEB_URL};g" ${KEYCLOAK_REALM_FILE}
sed -i "s;ldap://.*:389;${LDAP_URL};g" ${KEYCLOAK_REALM_FILE}

# From base image docs, will load this on start
# consider docker startup overrides
export KEYCLOAK_IMPORT=${KEYCLOAK_IMPORT:-${KEYCLOAK_REALM_FILE}}

# Set these to have a known admin user, just like in the parent readme
export KEYCLOAK_USER=${KEYCLOAK_USER:-admin}
export KEYCLOAK_PASSWORD=${KEYCLOAK_PASSWORD:-admin}

# Original entry point
echo "Starting keycloak docker, see more at https://hub.docker.com/r/jboss/keycloak/"
echo "Settings:"
export | grep KEYC
/opt/jboss/tools/docker-entrypoint.sh
