FROM jboss/wildfly

# Install keycloak adapter
COPY keycloak-wildfly-adapter-dist-10.0.1.tar.gz /tmp/
RUN cd /opt/jboss/wildfly && tar zxf /tmp/keycloak-wildfly-adapter-dist-10.0.1.tar.gz &&  ./bin/jboss-cli.sh --file=bin/adapter-elytron-install-offline.cli

# Install demo app
COPY target/saml-security.war /opt/jboss/wildfly/standalone/deployments/

#RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent
RUN /opt/jboss/wildfly/bin/add-user.sh admin Admin#70365 --silent
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]