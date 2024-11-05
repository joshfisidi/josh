'use client'

import Image from 'next/image'
import ImageSlider from '@/components/ImageSlider'
import LikeButton from '@/components/LikeButton'
import UploadButton from '@/components/UploadButton'
import { useState } from 'react'

export default function Home() {
  const [currentImageId, setCurrentImageId] = useState('slide1')

  return (
    <main>
      <ImageSlider onSlideChange={setCurrentImageId} />
      <LikeButton 
        imageId={currentImageId}
        onLike={(likes) => {
          console.log(`Image ${currentImageId} now has ${likes} likes`)
        }}
      />
      <UploadButton />
    </main>
  )
}
