import Image from 'next/image'
import ImageSlider from '@/components/ImageSlider'
import LikeButton from '@/components/LikeButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            .vin because human souls age like fine wine...
          </h1>
          <div className="flex flex-col items-center gap-6 w-full">
            <ImageSlider />
            <div className="flex gap-4">
              <LikeButton imageId="slide1" />
              {/* Add more buttons here later */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
