/**
 * Appwrite Client Configuration
 * Singleton pattern for Appwrite SDK
 */
import { Client, Databases } from 'appwrite';
import * as sdk from 'node-appwrite';
import { config } from '../config/env';

// Client-side Appwrite client
let clientInstance: Client | null = null;

export function getAppwriteClient(): Client {
    if (!clientInstance) {
        clientInstance = new Client()
            .setEndpoint(config.appwrite.endpoint)
            .setProject(config.appwrite.projectId);
    }
    return clientInstance;
}

// Server-side Appwrite client (with API key) - for getAppwriteServerClient function
let serverClientInstance: sdk.Client | null = null;

export function getAppwriteServerClient(): sdk.Client {
    if (!serverClientInstance) {
        serverClientInstance = new sdk.Client()
            .setEndpoint(config.appwrite.endpoint)
            .setProject(config.appwrite.projectId)
            .setKey(config.appwrite.apiKey);
    }
    return serverClientInstance;
}

// Database instance
export function getAppwriteDatabase(useServerClient = false): Databases | sdk.Databases {
    if (useServerClient) {
        const client = getAppwriteServerClient();
        return new sdk.Databases(client);
    }
    const client = getAppwriteClient();
    return new Databases(client);
}
