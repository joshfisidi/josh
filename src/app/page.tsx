'use client'

import ImageSlider from '@/components/ImageSlider'
import LikeButton from '@/components/LikeButton'
import UploadButton from '@/components/UploadButton'
import { useState } from 'react'

interface SlideImage {
  src: string
  caption: string
  id: string
}

export default function Home() {
  const [currentImageId, setCurrentImageId] = useState('slide1')
  const [images, setImages] = useState<SlideImage[]>([
    { src: '/fisidian.png', caption: 'Slide 1', id: 'slide1' },
    { src: '/fisidi.jpg', caption: 'Slide 2', id: 'slide2' },
    { src: '/freek.png', caption: 'Slide 3', id: 'slide3' },
  ])

  const handleUploadSuccess = (url: string, id: string) => {
    setImages(prev => [...prev, {
      src: url,
      caption: `Uploaded Image ${prev.length + 1}`,
      id
    }])
  }

  return (
    <main>
      <ImageSlider 
        images={images}
        onSlideChange={setCurrentImageId} 
      />
      <LikeButton 
        imageId={currentImageId}
        onLike={(likes: number) => {
          console.log(`Image ${currentImageId} now has ${likes} likes`)
        }}
      />
      <UploadButton onUploadSuccess={handleUploadSuccess} />
    </main>
  )
}
