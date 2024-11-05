import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ],
        maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
      }),
      onUploadCompleted: async ({ blob }) => {
        try {
          await prisma.image.create({
            data: {
              url: blob.url,
            },
          });
          console.log(`Image saved to database with URL: ${blob.url}`);
        } catch (dbError) {
          console.error('Error saving image to database:', dbError);
          // Optionally, you can delete the uploaded blob if DB save fails
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    );
  }
}