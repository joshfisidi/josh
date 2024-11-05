'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  { src: '/images/image1.jpg', caption: 'Slide 1' },
  { src: '/images/image2.jpg', caption: 'Slide 2' },
  { src: '/images/image3.jpg', caption: 'Slide 3' },
]

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center overflow-hidden w-full max-w-lg mx-auto">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="min-w-full flex-shrink-0 relative">
            <Image
              src={image.src}
              alt={`Slide ${index + 1}`}
              width={800}
              height={600}
              className="rounded-lg object-cover w-full h-72"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md">
              {image.caption}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
          onClick={prevSlide}
        >
          ‹
        </button>
        <button
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
          onClick={nextSlide}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default ImageSlider