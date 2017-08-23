#!/usr/bin/env bash
working_dir='/Users/ebrous/github/personal/wccls-data'

message=$(<$working_dir/notify/message.txt)

$working_dir/automation/imessage.sh $message
