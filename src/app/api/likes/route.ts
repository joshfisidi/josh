import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageId = searchParams.get('imageId')

  try {
    if (imageId) {
      // Get likes for a specific image
      const count = await prisma.like.count({
        where: { imageId }
      })
      return NextResponse.json({ likes: count })
    } else {
      // Get likes for all images
      const images = await prisma.image.findMany({
        include: {
          _count: {
            select: { likes: true }
          }
        }
      });
      
      const likesMap = images.reduce((acc: Record<string, number>, curr: { id: string, _count: { likes: number } }) => {
        acc[curr.id] = curr._count.likes;
        return acc;
      }, {});
      
      return NextResponse.json({ likes: likesMap });
    }
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { imageId } = body

  if (!imageId) {
    return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
  }

  try {
    await prisma.like.create({
      data: { imageId }
    })
    const likes = await prisma.like.count({
      where: { imageId }
    })
    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageId = searchParams.get('imageId')

  if (!imageId) {
    return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
  }

  try {
    await prisma.like.deleteMany({
      where: { imageId }
    })
    const likes = await prisma.like.count({
      where: { imageId }
    })
    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Error deleting like:', error)
    return NextResponse.json({ error: 'Failed to delete like' }, { status: 500 })
  }
}