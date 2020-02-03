## Problem Description

## Challenges
You will be building a JSON REST API. The endpoints and returned data can be of your own choosing. API design is part of the challenge, so think carefully about your routes and how you decide to return data.

### Parameters
You can expect to be given a list of user ids and a time range as part of the API request.

### Challenge 1
Find times where users could meet given user ids and a time range, without considering working hours.
### Challenge 2
Find times where users could meet given user ids and a time range, within their working hours.

### Response
Construct an appropriate JSON response body that you think best represents the data.

`user_id` is the user's id
`time_zone` is the user's IANA timezone
`working_hours` are the hours that the user will be in the office. Usually the working hours of someone in the US are from 9 am - 5 pm, for example.
`events` is a list of the user's events. All datetimes are represented in ISO 8601 format with a GMT timezone.