# curl -d "client_id=app-jee-html5-wildfly"  -d "username=appuser" -d "password=abcd123" -d "grant_type=password" "http://localhost:8081/auth/realms/auth_test/protocol/openid-connect/token"

# Non protected url
curl http://localhost:8080/service-jee-jaxrs/public

# Get a Bearer token
export access_token=$(\
curl -d "client_id=app-jee-html5-wildfly"  -d "username=appuser" -d "password=abcd123" -d "grant_type=password" "http://localhost:8081/auth/realms/auth_test/protocol/openid-connect/token" | jq --raw-output '.access_token' \
 )

# protected url
curl http://localhost:8080/service-jee-jaxrs/secured -H "Authorization: Bearer "$access_token

