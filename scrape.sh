#!/usr/bin/env bash

curl http://127.0.0.1:1337/\?size\=5\&keyword\=ghost%20in%20the%20shell -o logs/ghost%20in%20the%20shell.json

curl http://127.0.0.1:1337/\?size\=5\&keyword\=logan -o logs/logan.json
