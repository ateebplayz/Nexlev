import { Job } from "./types"

export const botColor = 0x1b9ee6
export const zeroJob: Job = {
    id: "",
    userId: "",
    jobType: "Paid",
    userTag: "",
    title: "",
    description: "",
    budget: "",
    deadline: "",
    reference: "",
    skill: "Writing",
    message: {
        id: "",
        url: ""
    },
    proposals: [],
    creationDate: 0,
    bumpDate: 0
}
export const guildId = '1236733198491324537'