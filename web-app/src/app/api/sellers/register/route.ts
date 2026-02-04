/**
 * API Route: Seller Registration
 * Creates Appwrite account and seller profile
 */
import { NextRequest, NextResponse } from 'next/server';
import { CreateSellerDTO } from '@/core/entities/Seller';
import { AppwriteSellerRepository } from '@/infrastructure/appwrite/AppwriteSellerRepository';
import { AppwriteSellerSettingsRepository } from '@/infrastructure/appwrite/AppwriteSellerSettingsRepository';
import { FIELD_TEMPLATES } from '@/core/entities/SellerSettings';
import { ID } from 'node-appwrite';
import { getAppwriteServerClient } from '@/infrastructure/appwrite/client';
import * as sdk from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        const data: CreateSellerDTO & { password: string } = await request.json();

        // Validate required fields
        if (!data.companyName || !data.ownerName || !data.email || !data.gstNumber || !data.password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate GST number format
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(data.gstNumber)) {
            return NextResponse.json(
                { message: 'Invalid GST number format' },
                { status: 400 }
            );
        }

        const sellerRepo = new AppwriteSellerRepository();
        const settingsRepo = new AppwriteSellerSettingsRepository();

        // Check if email or GST already exists
        const existingEmail = await sellerRepo.findByEmail(data.email);
        if (existingEmail) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 409 }
            );
        }

        const existingGST = await sellerRepo.findByGSTNumber(data.gstNumber);
        if (existingGST) {
            return NextResponse.json(
                { message: 'GST number already registered' },
                { status: 409 }
            );
        }

        // Create Appwrite account
        const client = getAppwriteServerClient();
        const account = new sdk.Account(client);
        const users = new sdk.Users(client);

        let userId: string;
        try {
            // Create user account
            const user = await users.create(
                ID.unique(),
                data.email,
                undefined, // phone
                data.password,
                data.ownerName
            );
            userId = user.$id;

            // Update user preferences with company info
            await users.updatePrefs(userId, {
                companyName: data.companyName,
                setupCompleted: false,
            });

        } catch (error: any) {
            console.error('Appwrite account creation error:', error);
            return NextResponse.json(
                { message: 'Failed to create account: ' + error.message },
                { status: 500 }
            );
        }

        // Create seller profile in database
        const seller = await sellerRepo.create(data);

        // Create default settings based on business type
        const template = (FIELD_TEMPLATES as any)[data.businessType] || FIELD_TEMPLATES.general_store;

        await settingsRepo.create({
            sellerId: seller.id,
            enabledFields: template.enabledFields.map((field: string, index: number) => ({
                fieldName: field,
                isRequired: false,
                displayOrder: index,
            })),
            customFields: template.customFields.map((field: any, index: number) => ({
                id: `custom_${index}`,
                name: field.name,
                type: field.type,
                isRequired: field.isRequired,
                displayOrder: index,
            })),
            aiImageEnabled: true,
            aiDescriptionEnabled: true,
            currency: 'INR',
            taxSettings: {
                defaultGstRate: 18,
                includeTaxInPrice: false,
                gstCategories: [
                    { name: '5% GST', rate: 5 },
                    { name: '12% GST', rate: 12 },
                    { name: '18% GST', rate: 18 },
                    { name: '28% GST', rate: 28 },
                ],
            },
        });

        return NextResponse.json({
            message: 'Registration successful! Please login with your credentials.',
            seller: {
                id: seller.id,
                companyName: seller.companyName,
                email: seller.email,
            },
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: error.message || 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
