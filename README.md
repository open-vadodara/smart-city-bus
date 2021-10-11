# smart-city-bus

## Details / NOTES

* BASE URL = http://14.98.182.250:4016/

### Getting Route Details
Given a time, get route stops + ETA

* URL = `http://14.98.182.250:4016/Route/GetRouteTripDetails`
* Req payload = `{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}`

Sample `POST` Request
```bash
curl 'http://14.98.182.250:4016/Route/GetRouteTripDetails' -X 'POST' -H 'Content-Type: application/json' -d '{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}'
```

Sample `GET` Request
```bash
14.98.182.250:4016/Route/GetRouteTripTimingDetails?Date=$date&RouteID=$id"
```

### Getting A Route's Time Table Details
Given a route_id, get all timings for that route

* URL = `http://14.98.182.250:4016/Route/GetRouteTripTimingDetails`
* Req payload = `{RouteID: "15", Date: "09-Oct-2021"}`

SAMPLE `POST` Request
```bash
curl 'http://14.98.182.250:4016/Route/GetRouteTripTimingDetails' -X 'POST' -H 'Content-Type: application/json' -d '{"RouteID": "15", "Date": "09-Oct-2021"}'
```

SAMPLE `GET` Request
```bash
http://14.98.182.250:4016/Route/GetRouteTripDetails?TimeTableTripID=$timetable_id&ScheduleDate=$date
```

## Data

* All extrated and parsed data are stored in `route_details/` folder
* `<bus_no>.json` - files contains the respective bus route's timings
* `tt_<bus_no>.json` - files contains the respective bus route's bus-stop names, lat-long for each bus-stop as well as the sequece of lat-longs i.e. the path/route taken by the bus