import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

import { requireAdmin } from '@/lib/auth';
import { getBindings, getImageBaseUrl } from '@/lib/env';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: image/jpeg, image/png, image/webp, image/avif` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB` },
        { status: 400 }
      );
    }

    const { IMAGES } = getBindings();
    if (!IMAGES) {
      return NextResponse.json({ error: 'Image storage unavailable' }, { status: 500 });
    }

    const key = `products/${randomBytes(8).toString('hex')}_${Date.now()}.${ext}`;

    await IMAGES.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=3600',
      },
    });

    return NextResponse.json({ url: `${getImageBaseUrl()}/${key}` });
  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
