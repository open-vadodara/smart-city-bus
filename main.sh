#!/bin/bash

date=$(date '+%d-%b-%Y')
IFS='\n'
temp='temp'
json='route_details'
mkdir $temp
mkdir $json

echo "# Downloading from website..."
while IFS= read -r line
do
  id=$(echo $line | cut -d "-" -f 1)
  route_no=$(echo $line | cut -d "-" -f 2)
  curl "14.98.182.250:4016/Route/GetRouteTripTimingDetails?Date=$date&RouteID=$id" --output "$temp/$route_no.txt"
done < bus_numbers.txt

echo "# Processing raw data and converting into json"
node process.js $temp $json

echo "# Done!"

rm -rf $temp