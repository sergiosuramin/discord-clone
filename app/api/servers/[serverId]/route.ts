import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

type EditServerPatchParamsProps = {
  params: {
    serverId: string
  }
}

export async function DELETE(_req: Request, { params }: EditServerPatchParamsProps) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id, // ensure sure only admin can do this
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: EditServerPatchParamsProps) {
  try {
    const profile = await currentProfile()
    const { name, imageUrl } = await req.json()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, // ensure sure only admin can do this
        // no need to check the role, because we already validate the UI
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
