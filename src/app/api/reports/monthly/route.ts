import { NextResponse } from 'next/server';
import { getAllReports, getReportByPeriod, getDashboardData } from '@/lib/dataStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period');

    if (period) {
      let report = await getReportByPeriod(period);
      if (!report) {
        const summary = await getDashboardData(period);
        report = summary.currentReport;
      }
      return NextResponse.json({ success: true, data: report });
    }

    const reports = await getAllReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
