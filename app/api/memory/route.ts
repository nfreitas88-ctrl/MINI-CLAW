import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const memoryPath = path.join(process.cwd(), 'mini-claw', 'memory', 'memory.json');
  
  try {
    if (fs.existsSync(memoryPath)) {
      const data = fs.readFileSync(memoryPath, 'utf8').trim();
      if (!data) return NextResponse.json([]);
      
      try {
        const memory = JSON.parse(data);
        return NextResponse.json(memory.history || []);
      } catch (parseError) {
        console.error('API Memory Parse Error:', parseError);
        return NextResponse.json({ error: 'Corrupted memory file' }, { status: 500 });
      }
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('API Memory Error:', error);
    return NextResponse.json({ error: 'Failed to read memory' }, { status: 500 });
  }
}
