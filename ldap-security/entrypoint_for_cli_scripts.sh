#!/bin/sh
# This is modified wildfly docker non accepted pull request:
# https://github.com/jboss-dockerfiles/wildfly/pull/40/files
set -e

wait-for-url() {
    echo "Waiting: $1"
    timeout -s TERM 45 bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo -n "." && sleep 2;\
    done' ${1} && echo "OK"
    #curl -I $1
}

consider-cli-scripts() {
    #/init directory exists and contain cli scripts
    if [ -d /init ] && [ $(find /init -name "*.cli" | wc -l) -gt 0 ]; then
        #start standalone server in admin only mode
        $JBOSS_HOME/bin/standalone.sh --admin-only &
        #wait for cli to be available
        wait-for-url http://localhost:9900
        for s in /init/*.cli; do
            #execute cli script
            $JBOSS_HOME/bin/jboss-cli.sh --connect --file=$s
        done
        #shutdown admin only server
        $JBOSS_HOME/bin/jboss-cli.sh --connect --command=shutdown
    fi
}

# Special case when using this in Dockerfiles and not as an entry point
if [ "$1" -eq "--only-run-cli" ]; then
    consider-cli-scripts
#docker run [COMMAND] not provided, only entrypoint
elif [ "$#" -eq 0 ]; then
    consider-cli-scripts
    # start real server (like the normal wildfly docker RUN command do)
    $JBOSS_HOME/bin/standalone.sh -b 0.0.0.0
else
    #docker run [COMMAND] is provided, execute it (e.g. bash)
    exec "$@"
fi
