'use client'

import { useState, useEffect } from 'react'

interface LikeButtonProps {
  imageId: string
  initialLikes?: number
  onLike?: (likes: number) => void
}

const LikeButton = ({ imageId, initialLikes = 0, onLike }: LikeButtonProps) => {
  const [likes, setLikes] = useState<number>(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check localStorage after component mounts
    setIsLiked(!!localStorage.getItem(`liked-${imageId}`))
    
    // Fetch initial likes count
    fetch(`/api/likes?imageId=${imageId}`)
      .then(res => res.json())
      .then(data => setLikes(data.likes || 0))
      .catch(error => console.error('Error fetching likes:', error))
  }, [imageId])

  const handleLike = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    try {
      const method = isLiked ? 'DELETE' : 'POST'
      const url = isLiked ? `/api/likes?imageId=${imageId}` : '/api/likes'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: isLiked ? null : JSON.stringify({ imageId }),
      })

      if (!res.ok) throw new Error('Failed to update like')
      
      const data = await res.json()
      setLikes(data.likes)
      setIsLiked(!isLiked)

      if (!isLiked) {
        localStorage.setItem(`liked-${imageId}`, 'true')
      } else {
        localStorage.removeItem(`liked-${imageId}`)
      }
    } catch (error) {
      console.error('Error updating like:', error)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all 
        ${isLiked 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
        ${isAnimating ? 'scale-95' : 'scale-100'}
      `}
      disabled={isAnimating}
    >
      <svg
        className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-125' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  )
}

export default LikeButton
