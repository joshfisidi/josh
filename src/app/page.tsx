'use client'

import ImageSlider from '@/components/ImageSlider'
import LikeButton from '@/components/LikeButton'
import UploadButton from '@/components/UploadButton'
import { useState, useEffect } from 'react'

interface SlideImage {
  src: string
  caption: string
  id: string
}

export default function Home() {
  const [currentImageId, setCurrentImageId] = useState<string | null>(null)
  const [images, setImages] = useState<SlideImage[]>([])

  // Fetch images from the database
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images')
        const data = await res.json()
        setImages(data.images)
        if (data.images.length > 0) {
          setCurrentImageId(data.images[0].id)
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    fetchImages()
  }, [])

  const handleUploadSuccess = (url: string, id: string) => {
    setImages(prev => [...prev, {
      src: url,
      caption: `Uploaded Image ${prev.length + 1}`,
      id
    }])
    setCurrentImageId(id)
  }

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <ImageSlider 
        images={images}
        onSlideChange={setCurrentImageId} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full max-w-md">
        <LikeButton 
          imageId={currentImageId}
          onLike={(likes: number) => {
            console.log(`Image ${currentImageId} now has ${likes} likes`)
          }}
        />
        <UploadButton onUploadSuccess={handleUploadSuccess} />
      </div>
    </main>
  )
}
