#!/usr/bin/env bash

working_dir='/Users/eric/github/wccls-data'

# Define a timestamp function
ts() {
  date +"%s"
}

onshelves=('ps4')
os_size='250'
os_avail_code='In'

protocol='http'
host='127.0.0.1'
port='1337'

msg_to='6123847749'
msg_file=$working_dir/notify/message.txt

for o in ${onshelves[@]}; do
  data_file=$working_dir/data/$(ts).json
  curl $protocol://$host:$port/\?size\=$os_size\&filter\=$os_avail_code\&keyword\=${o} -o $data_file
  echo $msg_to > $msg_file
  echo $(<$data_file) >> $msg_file
done

exit 0
