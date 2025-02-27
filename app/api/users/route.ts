import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await db
      .selectFrom('user')
      .where('id' , '=' , '01d905a5-c770-49a3-a30b-ec12cb545b12')
      .selectAll()
      .executeTakeFirst()

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}