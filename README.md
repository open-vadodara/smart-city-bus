# smart-city-bus

## Details / NOTES

### Getting Route Details
Given a time, get route stops + ETA

* URL = `http://14.98.182.250:4016/Route/GetRouteTripDetails`
* Req payload = `{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}`

**Sample `POST` Request**
```bash
curl 'http://14.98.182.250:4016/Route/GetRouteTripDetails' -X 'POST' -H 'Content-Type: application/json' -d '{TimeTableTripID: 1861, ScheduleDate: "09-Oct-2021"}'
```

**Sample `GET` Request**
```bash
14.98.182.250:4016/Route/GetRouteTripTimingDetails?Date=$date&RouteID=$id"
```

**Sample Response Data**

```javascript
[
  {
      "ROWID": 1,
      "ROUTE_CODE": "9CD",                // bus route number
      "SCHEDULE_DATE": "11-Oct-2021",     // date as input parameter
      "TIME_TABLE_TRIP_ID": 15633,        // timetable id for this route
      "TRIP_TIME": "06:20 AM",            // scheduled departure time from 1st stop (as mentioned in timetable data)
      "TRIP_END_TIME": "06:53 AM",        // scheduled arrival time at last stop (as mentioned in timetable data)
      "SEQNO": 0
  },
  ...  // more rows
]
```


### Getting A Route's Time Table Details
Given a route_id, get all timings for that route

* URL = `http://14.98.182.250:4016/Route/GetRouteTripTimingDetails`
* Req payload = `{RouteID: "15", Date: "09-Oct-2021"}`

**Sample `POST` Request**
```bash
curl 'http://14.98.182.250:4016/Route/GetRouteTripTimingDetails' -X 'POST' -H 'Content-Type: application/json' -d '{"RouteID": "15", "Date": "09-Oct-2021"}'
```

**Sample `GET` Request**
```bash
http://14.98.182.250:4016/Route/GetRouteTripDetails?TimeTableTripID=$timetable_id&ScheduleDate=$date
```

**Sample Response Data**

```javascript
{
  "Table": [
    {
      "POI_ID": 88,
      "POI_NAME": "CITY BUS STAND",                       // stop full name
      "REACH_TIME": "06:00 AM",                           // arrival time at this stop
      "ETA": "",
      "POI_SHORT_NAME": "CIBUST",
      "POI_CODE": "NS1",
      "POI_NAME_GUJRATI": "સિટી બસ સ્ટેન્ડ",
      "POI_NAME_HINDI": "सिटी बस स्टैंड",
      "POI_SEQUENCE_NO": 0,
      "NEXT_POI_TRAVEL_SCHEDULE_DISTANCE": 736.0,
      "NEXT_POI_TRAVEL_SCHEDULE_DISTANCE1": 736.0,
      "LATLAN": "73.182599236745915 22.309806741325158",  // longitude latitude
      "TRAVELPATH": "LINESTRING (22.309980000000003 73.18258, 22.30994 73.182600000000008, 22.309890000000003 73.18262, 22.309890000000003 73.18262, 22.309910000000002 73.182300000000012, ...)"   // (latitude longitude, ...) as a path
    },
    ... // more rows
  ],
  "Table1": [
    {
      "IS_ACTIVE": "N",
      "IS_CONNECTED": "Y",
      "ID": 64,
      "DEVICE_ID": "8956395992",
      "IS_GPS_FIX_OK": true,
      "LATITUDE": 22.3090133333333,
      "LONGITUDE": 73.1870316666667,
      "SPEED": 22.0,
      "ODOMETER": 2437.616,
      "DIRECTION": 96.0,
      "GPS_TIME": "2021-10-11T16:47:46",
      "UPDATE_TIME": "2021-10-11T16:47:46.837",
      "DEVICE_LOCATION": "INSIDE POI KAMATI BAUG SAYAJI GUNJ",
      "IDLE_START_TIME": null,
      "IDLE_DURATION": 0,
      "MOVING_START_TIME": "2021-10-11T16:47:46",
      "MOVING_DURATION": 0,
      "SPEED_LAST_ALERT_FLAG": true,
      "RD_LAST_ALERT_FLAG": null,
      "RD_LAST_ALERT_TIME": null,
      "IS_RD_MARKED_AFTER_LIMIT": null,
      "ASSIGNED_BUS_RTO_NO": "GJ06AZ0057"
    }
  ]
}
```

## Data

* All extrated and parsed data are stored in `route_details/` folder
* `<bus_no>.json` - files contains the respective bus route's timings
* `tt_<bus_no>.json` - files contains the respective bus route's bus-stop names, lat-long for each bus-stop as well as the sequece of lat-longs i.e. the path/route taken by the bus
