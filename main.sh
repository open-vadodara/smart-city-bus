#!/bin/bash

date=$(date '+%d-%b-%Y')
IFS='\n'
temp='temp'
tt='temp_tt'
json='route_details'
mkdir $temp
mkdir $tt
mkdir $json

echo "# Downloading route timings from website..."
while IFS= read -r line
do
  id=$(echo $line | cut -d "-" -f 1)
  route_no=$(echo $line | cut -d "-" -f 2)
  curl "14.98.182.250:4016/Route/GetRouteTripTimingDetails?Date=$date&RouteID=$id" --output "$temp/$route_no.txt"
done < bus_numbers.txt

echo "# Processing raw data and converting into json..."
node process.js $temp $json

echo "# Downloading timetables from website..."
while IFS= read -r line
do
  route_no=$(echo $line | cut -d "-" -f 1)
  timetable_id=$(echo $line | cut -d "-" -f 2)
  curl "http://14.98.182.250:4016/Route/GetRouteTripDetails?TimeTableTripID=$timetable_id&ScheduleDate=$date" --output "$temp/tt_$route_no.txt"
done < timetables.txt

echo "# Processing raw timetable data and converting into json..."
node process.js $tt $json true

echo "# Done..."

# rm -rf $temp
# rm -rf $tt