// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {sendMessageToOpenAi} from '@/src/services/openai';
import Message from '@/src/models/openaiModels';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';

function convertMessageToOpenAiMessage(message: Message) : CreateChatCompletionRequestMessage {
    return {
        role: message.role,
        content: message.content,
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const conversation = req.body?.conversation.map(convertMessageToOpenAiMessage) || [];

    if (req.method === 'POST'){
        console.log({body: req.body})
        let stream = await sendMessageToOpenAi(conversation, req.body.message);
        let newContent: string = '';

        for await (const part of stream) {
            newContent += (part.choices[0]?.delta?.content || '');
            console.log({newContent});
        }

        console.log({finished: newContent});
        res.status(200).json({message: newContent});
    }
}
