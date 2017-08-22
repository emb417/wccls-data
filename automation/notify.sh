#!/usr/bin/env bash

working_dir='/Users/eric/github/wccls-data'

message=$(</Users/eric/github/wccls-data/notify/message.txt)

$working_dir/automation/imessage.sh $message
