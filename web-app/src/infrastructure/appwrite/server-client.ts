/**
 * Server-side Appwrite Client Configuration
 * Only for use in API routes and server components
 */
import { Client, Databases, Users, Storage } from 'node-appwrite';

export const serverClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

export const databases = new Databases(serverClient);
export const users = new Users(serverClient);
export const storage = new Storage(serverClient);
