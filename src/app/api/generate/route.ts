import { NextRequest, NextResponse } from 'next/server';
import { MiniAppGenerator } from '@/generator/index';
import { MiniAppConfig } from '@/types';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const config: MiniAppConfig = await request.json();

    const generator = new MiniAppGenerator(config);
    const files = await generator.generateFiles('');

    // Create a zip file
    const zip = new JSZip();

    // Add all files to the zip with proper directory structure
    for (const file of files) {
      zip.file(file.path, file.content);
    }

    // Generate the zip file as a buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Create a safe filename from the app name
    const safeName = config.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const filename = `${safeName || 'miniapp'}.zip`;

    // Return the zip file as a response
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating Mini App:', error);
    return NextResponse.json(
      { error: 'Failed to generate Mini App' },
      { status: 500 }
    );
  }
}
