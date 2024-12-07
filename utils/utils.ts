import Constants from 'expo-constants';
import {Message} from './interfaces'

export const initialMessages: Message[] = [
    {
      role: "assistant",
      id: "0",
      content:
        "Hi! I am your AI tour guide. I am here to answer questions on black events in London, Paris and Dubai.",
    },
  ];

  export const getSources = (data: any, role: string, index: number) => {
    if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
      const sourcesIndex = (index - 2) / 2;
      if (data[sourcesIndex] && data[sourcesIndex].sources) {
        return data[sourcesIndex].sources;
      }
    }
    return [];
  };

  export const generateAPIUrl = (relativePath: string) => {
    const origin = Constants.experienceUrl
      ? Constants.experienceUrl.replace('exp://', 'http://')
      : process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'; // Fallback for undefined
  
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    console.log("Generated Path:", path);
  
    if (process.env.NODE_ENV === 'development') {
      return origin.concat(path);
    }
  
    if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
      throw new Error(
        'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
      );
    }
  
    return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
  };