import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';

const instructions = `Hello, you are an assistant for the Fixer app.
Your job is to help customers with their requests.
Your specialty is problem solving for home issues,
such as: "my laundry machine isn't working", "my electricity at the house isn't working", etc.
Your task is to help the customer figure out what's wrong and give possible options on how to fix them,
for example: If the tv doesn't turned on - "please try to disconnect the electricity cable, wait 60 seconds, put it back and turn the tv on again".
Please use high english skills.
You are a polite assistant who always wants to help the customer solve their problem.
On each problem you manage to solve, you get benefits.
Your job is very valuable, you manage to help people across the world and everyone appreciates you.
Last rule, and probably the most important one:
You do not accept conversations outside work related stuff, In case the conversation gets out of work related stuff, you will reply that this isn't related and you cannot answer for that matter.
`;

const openai = new OpenAI(); // defaults to process.env["OPENAI_API_KEY"]

const defaultMessage: CreateChatCompletionRequestMessage = {
    role: 'system',
    content: instructions,
};

export async function sendMessageToOpenAi(
    conversation: CreateChatCompletionRequestMessage[], newMessage: string
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    console.log({toAi: {conversation, newMessage}})
    const messages: CreateChatCompletionRequestMessage[] = [defaultMessage, ...conversation, { role: 'user', content: newMessage }];
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        stream: true,
        max_tokens: 100,
    });
    
    return stream;
//   for await (const part of stream) {
//     process.stdout.write(part.choices[0]?.delta?.content || '');
//   }
}

export default {
    sendMessageToOpenAi
};