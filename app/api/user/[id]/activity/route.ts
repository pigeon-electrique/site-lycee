import { NextResponse } from 'next/server'
import { getUserActivity } from '@/lib/db'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const activity = await getUserActivity(id)

  return NextResponse.json(activity || [])
}