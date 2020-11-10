#!/bin/sh

if [ -z "${WILDFLY_METRICS_URL}" ]; then
    echo "you must define \$WILDFLY_METRICS_URL"
    exit 1
fi

echo "patching config file: /tmp/prometheus.yml -> ${WILDFLY_METRICS_URL}"
sed -i "s;\$WILDFLY_METRICS_URL;${WILDFLY_METRICS_URL};g" /tmp/prometheus.yml

echo /bin/prometheus --config.file=/tmp/prometheus.yml --storage.tsdb.path=/prometheus --web.console.libraries=/usr/share/prometheus/console_libraries --web.console.templates=/usr/share/prometheus/consoles
/bin/prometheus --config.file=/tmp/prometheus.yml --storage.tsdb.path=/prometheus --web.console.libraries=/usr/share/prometheus/console_libraries --web.console.templates=/usr/share/prometheus/consoles
