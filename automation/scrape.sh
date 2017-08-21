#!/usr/bin/env bash

# Define a timestamp function
ts() {
  date +"%s"
}

unholdables=('ghost%20in%20the%20shell' 'logan')
un_size='10'

onshelves=('ps4' 'bluray')
os_size='250'
os_avail_code='In'

branch='39'
avail_codes=(
  'In'
  'Out'
  'Lost'
  'Missing'
  'Transferred'
  'In-Transit'
  'Held'
  '-- Not Holdable'
  'On-Order'
  'In-Repair'
  'Unavailable')

protocol='http'
host='127.0.0.1'
port='1337'
working_dir='/Users/eric/github/wccls-data'

for u in ${unholdables[@]}; do
  curl $protocol://$host:$port/\?size\=$un_size\&keyword\=${u} -o $working_dir/logs/${u}__$(ts).json
done

for o in ${onshelves[@]}; do
  curl $protocol://$host:$port/\?branch\=$branch\&size\=$os_size\&filter\=$os_avail_code\&keyword\=${o} -o $working_dir/logs/${o}__$(ts).json
done

exit 0
