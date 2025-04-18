import { NextRequest, NextResponse } from 'next/server';
import { pinata } from '@/utils/pinata-config';
import { getUserId } from '@/app/actions/helpers/get-userId';

// Size limits in bytes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );  
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(fileType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'File type not supported. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const sizeInMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${sizeInMB}MB for ${isImage ? 'images' : 'videos'}.` },
        { status: 400 }
      );
    }

    // Make request to Pinata
    const {cid,mime_type} = await pinata.upload.public.file(file)
    const url = await pinata.gateways.public.convert(cid);


    // Return the Uploaded File Data
    return NextResponse.json({
      success: true,
      pinataUrl: url,
      fileType: mime_type,
      size: file.size
    });

  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to Pinata' },
      { status: 500 }
    );
  }
}