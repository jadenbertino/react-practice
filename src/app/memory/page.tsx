'use client'

import Container from '@/components/ui/container'
import { cn } from '@/lib/utils'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

type Image = {
  id: string
  href: string
  isFlipped: boolean
}

const IMAGES = [
  'https://images.unsplash.com/photo-1626808642875-0aa545482dfb',
  'https://images.unsplash.com/photo-1546842931-886c185b4c8c',
  'https://images.unsplash.com/photo-1520763185298-1b434c919102',
  'https://images.unsplash.com/photo-1442458017215-285b83f65851',
  'https://images.unsplash.com/photo-1496483648148-47c686dc86a8',
  'https://images.unsplash.com/photo-1591181520189-abcb0735c65d',
] as const

const getInitialCards = async () => {
  const targetImages = _.shuffle([...IMAGES]).slice(0, 4)
  const allImages = _.shuffle([...targetImages, ...targetImages])
  console.log(allImages)
  return allImages.map((url) => ({
    id: v4(),
    href: url,
    isFlipped: false,
  }))
}

const MemoryPage = () => {
  const [images, setImages] = useState<Image[]>([])
  useEffect(() => {
    getInitialCards().then((result) => setImages(result))
  }, [])

  const [_, setSelectedIndexes] = useState<number[]>([])
  const [disabled, setDisabled] = useState(false)

  const handleSelect = (index: number) => {
    if (images[index]?.isFlipped || disabled) return
    console.log('click', index, images[index]?.href, images)
    flipImage(index)

    setSelectedIndexes((prev) => {
      const newSelected = [...prev, index]
      if (newSelected.length < 2) {
        return newSelected
      }

      // Match => reset select
      const selectedImages = newSelected.map((idx) => images[idx])
      const isMatch = selectedImages.every(
        (img) => img?.href === selectedImages[0]!.href,
      )
      if (isMatch) {
        console.log('match!')
        return []
      } else {
        console.log('no match', selectedImages)
      }

      // No match => reset select + flipped after 1 sec
      setTimeout(() => {
        setSelectedIndexes([])
        setImages((prev) => {
          const newImages = [...prev]
          newSelected.forEach((idx) => {
            newImages[idx]!.isFlipped = false
          })
          return newImages
        })
        setDisabled(false)
      }, 1 * 1000)
      setDisabled(true)
      return newSelected
    })
  }

  const flipImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages[index]!.isFlipped = true
      return newImages
    })
  }

  return (
    <Container className='pt-10'>
      <div className='grid grid-cols-4 grid-rows-2'>
        {images.map((image, index) => (
          <div
            className='p-4'
            key={image.id}
            onClick={() => handleSelect(index)}
          >
            {/* <p>{image.href.slice(34)}</p> */}
            {/* {index} */}
            <img
              alt={index.toString()}
              src={image.href}
              className={cn(
                'col-span-1 row-span-1',
                !image.isFlipped && 'opacity-0',
              )}
              suppressHydrationWarning
            />
          </div>
        ))}
      </div>
    </Container>
  )
}

export default MemoryPage

/*
STATE
- selected (pending, 2 at a time)
- flipped
- image URLs

CASES
- card is already selected => do nothing
- 0 or 1 other cards selected => flip it
  - 
*/
