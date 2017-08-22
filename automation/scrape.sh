#!/usr/bin/env bash

# Define a timestamp function
ts() {
  date +"%s"
}

unholdables=('ghost%20in%20the%20shell' 'passengers')
un_size='10'
un_avail_code='In%20%2D%2D%20Not%20Holdable'
filter='[]'

onshelves=('ps4')
os_size='250'
os_avail_code='In'

branch='39'

protocol='http'
host='127.0.0.1'
port='1337'
working_dir='/Users/eric/github/wccls-data'
msg_to='6123847749'
msg_file=$working_dir/notify/message.txt

for u in ${unholdables[@]}; do
  data_file=$working_dir/data/${u}__$(ts).json
  curl $protocol://$host:$port/\?size\=$un_size\&filter\=$un_avail_code\&keyword\=${u} -o $data_file
  if [ $(<$data_file) == "[]" ]; then
    echo $msg_to > $msg_file
    echo $(<$data_file) >> $msg_file
  fi
done

for o in ${onshelves[@]}; do
  curl $protocol://$host:$port/\?branch\=$branch\&size\=$os_size\&filter\=$os_avail_code\&keyword\=${o} -o $working_dir/data/${o}__$(ts).json
done

exit 0
