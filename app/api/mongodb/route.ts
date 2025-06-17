import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/utils/db';
import TestModel from '@/app/models/TestModel';

export async function GET() {
  try {
    await connectToDatabase();
    const records = await TestModel.find({});
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch records' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 },
      );
    }

    const newTest = await TestModel.create({ name });
    return NextResponse.json({ success: true, data: newTest }, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create record' },
      { status: 500 },
    );
  }
}
