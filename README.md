## Simple Scheduling App

This is a simple Express app for determining times when a set of users are all available to meet.

It has one endpoint `GET /available_times`, which expects a request body of the form: 

```
{
    user_ids: [...ids],
    start: <ISO 8601 datetime>,
    end: <ISO 8601 datetime>
}
```

...and which returns a response in the form: 

```
    [
        ...{
                end_time: <ISO 8601 datetime>,
                start_time: <ISO 8601 datetime>
            }
    ]
```

...representing possible times when all users are free to meet.