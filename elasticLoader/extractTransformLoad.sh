# #!/bin/bash

# Set Elastic search credentials and host
ES_USER=''
ES_KEY=''
ES_HOST=''
ES_ENDPOINT="https://$ES_USER:$ES_KEY@$ES_HOST/_bulk"

# Filter npi-data.csv to only include records with the state of NY
NPIPATH='/Users/henrychesnutt/Downloads/NPPES_Data_Dissemination_July_2018/npidata_pfile_20050523-20180708.csv'

# read headers into destination file
head -1 $NPIPATH > npi-data.csv

# pipe grep 'NY' into destination file
grep "\"NY\"" $NPIPATH >> npi-data.csv


echo 'Converting NPI csv file to json'
node csvToJSON.js


echo 'Spliting npi-data.json file into separate npi-split files'
cat npi-data.json | split -l 100000 - npi-split  # split the FILE into chunks of 20 lines each

echo 'Enriching each npi-split file with elasticsearch commands'
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
  echo 'Adding' $FILE 'to elasticsearch'
  curl -s -XPOST $ES_ENDPOINT --data-binary @$FILE -H 'Content-Type: application/json' > log.txt
  echo 'Done adding' $FILE 'to elasticsearch'
  rm -rf $FILE
  rm -rf log.txt
done

echo 'Complete'
