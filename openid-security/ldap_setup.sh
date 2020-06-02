# Use a prepackaged ldap
docker run --env LDAP_ORGANISATION="wildfly" --env LDAP_DOMAIN="wildfly.org" --env LDAP_ADMIN_PASSWORD="admin" -p 389:389 --detach osixia/openldap

# requires rpm: openldap-clients
sleep 5
ldapadd -x -c -H ldap://localhost:389 -D "cn=admin,dc=wildfly,dc=org" -w admin <ldap_input.ldif
ldapsearch -H ldap://localhost:389 -D "cn=admin,dc=wildfly,dc=org" -w admin -b "ou=roles,dc=wildfly,dc=org"  -s sub "(objectclass=*)"
