#!/usr/bin/env bash

# Define a timestamp function
ts() {
  date +"%s"
}

unholdables=('ghost%20in%20the%20shell' 'logan')
un_size='10'
un_avail_code='In%20%2D%2D%20Not%20Holdable'

onshelves=('ps4' 'bluray')
os_size='250'
os_avail_code='In'

branch='39'

protocol='http'
host='127.0.0.1'
port='1337'
working_dir='/Users/eric/github/wccls-data'

for u in ${unholdables[@]}; do
  curl $protocol://$host:$port/\?size\=$un_size\&filter\=$un_avail_code\&keyword\=${u} -o $working_dir/data/${u}__$(ts).json
done

for o in ${onshelves[@]}; do
  curl $protocol://$host:$port/\?branch\=$branch\&size\=$os_size\&filter\=$os_avail_code\&keyword\=${o} -o $working_dir/data/${o}__$(ts).json
done

exit 0
