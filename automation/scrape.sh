#!/usr/bin/env bash

working_dir='/Users/eric/github/wccls-data'
unholdables=('ghost%20in%20the%20shell' 'logan')
onshelves=('ps4' 'bluray')

for u in ${unholdables[@]}; do
  curl http://127.0.0.1:1337/\?size\=10\&keyword\=${u} -o $working_dir/logs/${u}.json
done

for o in ${onshelves[@]}; do
  curl http://127.0.0.1:1337/\?branch\=39\&size\=500\&keyword\=${o} -o $working_dir/logs/${o}.json
done

exit 0
