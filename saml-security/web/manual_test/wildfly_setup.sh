# Originally tested with a local Wildfly installation using mvn wildfly:deploy
# after initial keycloak adapter installation, but it seems to work in Docker too
# settings for confbox ldap, access, tic
# if ldap/web have real dns names you can use those instead of ip address
if [ -z "$IDP_HOST" -a -z "$IDP_URL" ]; then
    IDP_HOST=$(ip route get 8.8.8.8 | head -1 | cut -d' ' -f7)
    echo 'Warning: no ${IDP_HOST} or ${IDL_URL} using default '${IDP_HOST}
fi

export IDP_URL=${IDP_URL:-http://${IDP_HOST}:8081/auth/}
echo "Using IdP $IDP_URL"

#mvn clean package wildfly:deploy
cp src/main/webapp/WEB-INF/keycloak_template.json src/main/webapp/WEB-INF/keycloak.json
sed -i "s;http://IDP_HOST:.*/auth/;${IDP_URL};g" src/main/webapp/WEB-INF/keycloak.json
mvn clean package
docker build --tag=wildfly-saml-security .
docker run -p 8080:8080 -p 9990:9990 -it wildfly-saml-security
