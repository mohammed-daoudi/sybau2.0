import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs'; // Ensure this runs on the Node.js runtime

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Generate a unique filename
  const ext = (file as File).name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, filename);

  // Ensure the uploads directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Save the file
  const arrayBuffer = await (file as File).arrayBuffer();
  await fs.writeFile(filePath, new Uint8Array(arrayBuffer));

  // Return the public URL
  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}
