import { NextResponse } from 'next/server';
import { getAllProductions, addProduction } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const data = await getAllProductions();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      date,
      totalHens = 0,
      eggsGood = 0,
      eggsBroken = 0,
      feedConsumptionKg = 0,
      mortalityCount = 0,
      notes,
    } = body;

    if (!date) {
      return NextResponse.json({ success: false, message: 'Tanggal produksi wajib diisi.' }, { status: 400 });
    }

    const good = Number(eggsGood) || 0;
    const broken = Number(eggsBroken) || 0;
    const total = good + broken;

    const newProd = await addProduction({
      date,
      totalHens: Number(totalHens) || 0,
      eggsGood: good,
      eggsBroken: broken,
      totalEggs: total,
      feedConsumptionKg: Number(feedConsumptionKg) || 0,
      mortalityCount: Number(mortalityCount) || 0,
      notes,
      recordedBy: user?.name || 'Mitra',
    });

    return NextResponse.json({ success: true, data: newProd });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
