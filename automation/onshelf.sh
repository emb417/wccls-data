#!/usr/bin/env bash
working_dir='/Users/ebrous/github/personal/wccls-data'

# global variables
. $working_dir/automation/global.cfg

# array of titles
titles=$(<$onshelf_titles)

# Define a timestamp function
ts() {
  date +"%s"
}

for title in ${titles[@]}; do
  data_file=$working_dir/data/$(ts).json
  curl $protocol://$host:$port/\?size\=$os_size\&filter\=$os_avail_code\&keyword\=${title} -o $data_file
  file_size=$(wc -c <$data_file)  
  if [ $file_size -gt 2 ]; then
    echo $msg_to > $msg_file
    echo $(<$data_file) >> $msg_file
  fi
done

exit 0
