# smart-city-bus

## Details / NOTES

* BASE URL = http://14.98.182.250:4016/

* Given a route_id, get all timings for that route
* POST Request
* http://14.98.182.250:4016/Route/GetRouteTripTimingDetails
* Req payload => `{RouteID: "15", Date: "09-Oct-2021"}`
* SAMPLE Request =
```
curl 'http://14.98.182.250:4016/Route/GetRouteTripTimingDetails' -X 'POST' -H 'Content-Type: application/json' -d '{"RouteID": "15", "Date": "09-Oct-2021"}'
```


* Given a time, get route stops + ETA
* POST Request
* http://14.98.182.250:4016/Route/GetRouteTripDetails
* Req payload => `{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}`
* SAMPLE Request =
```curl
curl 'http://14.98.182.250:4016/Route/GetRouteTripDetails' -X 'POST' -H 'Content-Type: application/json' -d '{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}'
```