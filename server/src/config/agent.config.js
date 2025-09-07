import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { analyzeImage, verifyImage } from '../tools/agent.tool.js';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',  
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.3,  
  maxRetries: 3,
  configuration: {
        baseURL: 'https://api.closerouter.com/v1'
    },
});

export const agent = createReactAgent({
  llm: model,
  tools: [verifyImage,
    analyzeImage
  ]
});
