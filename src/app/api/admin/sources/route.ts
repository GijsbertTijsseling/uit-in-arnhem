import { NextRequest, NextResponse } from 'next/server';
import { getAgendaSources, saveAgendaSource } from '@/lib/supabase/api';

export async function GET() {
  try {
    const sources = await getAgendaSources();
    return NextResponse.json(sources);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug || !body.url) {
      return NextResponse.json({ error: 'Naam, slug en URL zijn verplicht' }, { status: 400 });
    }

    const { data, error } = await saveAgendaSource(body);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

