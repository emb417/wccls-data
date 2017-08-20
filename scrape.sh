#!/usr/bin/env bash

KEYWORDS=('ghost%20in%20the%20shell' 'logan')

for k in ${KEYWORDS[@]}; do
  curl http://127.0.0.1:1337/\?size\=10\&keyword\=${k} -o /Users/eric/github/wccls-data/logs/${k}.json
done
exit 0
