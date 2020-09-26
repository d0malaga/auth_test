#!/bin/bash
#set -eux

export URL=${URL:-http://localhost}

wait-for-url() {
    echo "Waiting: $1"
    timeout -s TERM 45 bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo -n "." && sleep 2;\
    done' ${1} && echo "OK"
    #curl -I $1
}
wait-for-url ${URL}
