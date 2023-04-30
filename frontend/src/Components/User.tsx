export interface User {
    username: string,
    location: {
        coordinates: number[],
        type: string
    },
    university: string,
    courses: string[]
}