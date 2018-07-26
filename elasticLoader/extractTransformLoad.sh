#!/bin/bash

# Set Elastic search credentials and host
ES_USER=''
ES_KEY=''
ES_HOST=''
ES_ENDPOINT='https://$ES_USER:$ES_KEY@$ES_HOST/_bulk'


echo 'split start'
cat npi-data.json | split -l 250000 - npi-split  # split the FILE into chunks of 20 lines each
echo 'split done'

n=1
for FILE in npi-split* # for each split file 
do
  sed -e 's/^/{ "index" : { "_index": "doctors", "_type": "_doc" } }\
  /' $FILE > npi-ready-${n}.json # find the beginning of a line and add elastic search commands
  rm -rf $FILE # remove split file
  ((n++)) # Increment name of output
done
echo 'enrichment done'

for FILE in npi-ready*
do
  echo 'Adding' $FILE
  curl -s -XPOST $ES_ENDPOINT --data-binary @$FILE -H 'Content-Type: application/json' > log.json
  echo 'Done adding' $FILE
  rm -rf $FILE
  rm -rf log.json
done

echo 'Complete'
