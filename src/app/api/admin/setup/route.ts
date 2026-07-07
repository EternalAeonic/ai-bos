import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), 'prisma', 'setup_rls.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // We split by ';' but wait, DO $$ ... END $$; has ';' inside it.
    // executeRawUnsafe can execute the whole block if passed directly.
    await prisma.$executeRawUnsafe(sql);

    return NextResponse.json({ success: true, message: "RLS Policies Applied Successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
