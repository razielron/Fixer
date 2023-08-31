import { CreateChatCompletionRequestMessage } from "openai/resources/chat"

export default interface Message extends CreateChatCompletionRequestMessage {
    id: number
    createdAt: Date
}