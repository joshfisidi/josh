'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import LikeButton from './LikeButton'

interface SlideImage {
  src: string
  caption: string
  id: string
}

const images: SlideImage[] = [
  { src: '/fisidian.png', caption: 'Slide 1', id: 'slide1' },
  { src: '/fisidi.jpg', caption: 'Slide 2', id: 'slide2' },
  { src: '/ethereum.png', caption: 'Slide 3', id: 'slide3' },
]

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleSlideChange = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    handleSlideChange((currentSlide + 1) % images.length)
  }, [currentSlide, handleSlideChange])

  const prevSlide = useCallback(() => {
    handleSlideChange((currentSlide - 1 + images.length) % images.length)
  }, [currentSlide, handleSlideChange])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsTouching(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsTouching(false)
    const swipeThreshold = 50
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  useEffect(() => {
    if (!isTouching) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [nextSlide, isTouching])

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl">
      {/* Background blur layer */}
      {images.map((image, index) => (
        <div
          key={`bg-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt=""
            fill
            className="object-cover scale-110 blur-2xl brightness-75"
            priority={index === currentSlide}
          />
        </div>
      ))}

      {/* Foreground images */}
      <div className="absolute inset-0 z-10">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0'
                : index === (currentSlide + 1) % images.length
                ? 'opacity-0 translate-x-full'
                : 'opacity-0 -translate-x-full'
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.caption}
                  fill
                  className="object-contain"
                  priority={index === currentSlide}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Hidden on Mobile */}
      <div className="hidden sm:block">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full z-10"
          disabled={isAnimating}
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full z-10"
          disabled={isAnimating}
        >
          →
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-4 sm:w-6 bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider