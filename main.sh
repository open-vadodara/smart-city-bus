#!/bin/bash

buses=$(<bus_numbers.txt)
export IFS='\n'

for i in $buses; do
  # curl "http://14.98.182.250:4016/Route?RouteID=27"
  echo "<<< $i asdf"
done

# for i in $buses; do
#   for eb in $i; do
#     echo "$eb <><><><\n\n"
#   done
# done


# for i in $buses; do
#   read -ra arr <<< "$i"
#   for val in "${arr[@]}"; do
#     printf "name = $val\n"
#   done
# done
