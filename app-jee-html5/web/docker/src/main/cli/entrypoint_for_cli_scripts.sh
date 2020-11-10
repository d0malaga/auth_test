#!/bin/sh
# This is modified wildfly docker non accepted pull request:
# https://github.com/jboss-dockerfiles/wildfly/pull/40/files
#
# Will apply all *.cli scripts in the same dir as this script
# (note that this assumes a standalone wildfly)

set -e

wait_for_url() {
    echo "Waiting: $1"
    timeout -s TERM 45 bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo -n "." && sleep 2;\
    done' ${1} && echo "OK"
    #curl -I $1
}

consider_cli_scripts() {
    #/init directory exists and contain cli scripts
    if [ -d ${1} ] && [ $(find ${1} -name "*.cli" | wc -l) -gt 0 ]; then

	# Make sure cli values from env are not expanded, the whole point
	# is to insert env variables that can be used in runtime
	sed -i "s:<resolve-parameter-values>.*</resolve-parameter-values>:<resolve-parameter-values>false</resolve-parameter-values>:g" $JBOSS_HOME/bin/jboss-cli.xml
        # store env so Java can read them
	printenv > /tmp/env.properties
	
	#start standalone server in admin only mode without deploying any war files
	mv $JBOSS_HOME/standalone/deployments $JBOSS_HOME/standalone/deployments_not_yet
        $JBOSS_HOME/bin/standalone.sh --admin-only &
        #wait for cli to be available
        wait_for_url http://localhost:9990
        for s in ${1}/*.cli; do
            #execute cli script
	    echo "Running cli: $s"
            $JBOSS_HOME/bin/jboss-cli.sh --connect --properties=/tmp/env.properties --file=$s 
        done
        #shutdown admin only server
        $JBOSS_HOME/bin/jboss-cli.sh --connect --command=shutdown
	mv $JBOSS_HOME/standalone/deployments_not_yet $JBOSS_HOME/standalone/deployments
    fi
}

# Special case when using this in Dockerfiles and not as an entry point
if [ "$1" = "--only-run-cli" ]; then
    consider_cli_scripts $(dirname $0)
    echo Done
#docker run [COMMAND] not provided, only entrypoint
elif [ "$#" -eq 0 ]; then
    consider_cli_scripts $(dirname $0)
    # start real server (like the normal wildfly docker RUN command do)
    $JBOSS_HOME/bin/standalone.sh -b 0.0.0.0
else
    #docker run [COMMAND] is provided, execute it (e.g. bash)
    exec "$@"
fi
