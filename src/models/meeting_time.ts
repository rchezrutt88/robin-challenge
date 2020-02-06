interface findMeetingsInput {

}

interface Event {
    id: number
    title: string
    start: string
    end: string
}

interface Meeting {
    start: string
    end: string
    users: number[]
}

interface User {
    user_id: number
    time_zone: string
    working_hours: {
        start: string
        end: string
    }
    events: Event[]
}

interface MeetingRequest {
    users: number[]
    start: string
    end: string
}

interface MeetingResponse {
    meetings: Meeting[]
}

const findMeetings = (start: string, end: string, users: User[]): MeetingResponse[] => {

};

export default