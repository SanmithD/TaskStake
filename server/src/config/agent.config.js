import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { verifyImage } from '../tools/agent.tool.js';

const model = new ChatOpenAI({
    model: 'chatgpt-4o-latest',
    apiKey: process.env.CLOSE_ROUTER_KEY,
    configuration: {
        baseURL: 'https://api.closerouter.com/v1'
    },
    temperature: 0.7,
    maxRetries: 10
});

export const agent = createReactAgent({
    llm: model,
    tools: [verifyImage]
})