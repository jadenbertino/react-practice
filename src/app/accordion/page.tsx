'use client'

import Container from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

const AccordionPage = () => {
  return (
    <Container className='h-full flex flex-col justify-center items-stretch max-w-lg'>
      <Accordion items={[{ header: 'header', content: 'content' }]} />
    </Container>
  )
}

type AccordionProps = {
  items: AccordionItemProps[]
}

const Accordion = ({ items }: AccordionProps) => {
  return (
    <ul>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          {...item}
        />
      ))}
    </ul>
  )
}

type AccordionItemProps = {
  header: string
  content: ReactNode
}

const AccordionItem = ({ header, content }: AccordionItemProps) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen((prev) => !prev)

  return (
    <div>
      {/* Header */}
      <button
        className='flex w-full'
        onClick={toggleOpen}
      >
        <h3 className='flex-grow text-left'>{header}</h3>
        <span
          className={cn(
            'transition-transform duration-300 ease-in-out',
            open && '-rotate-90',
          )}
        >
          {'<'}
        </span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='p-4'>{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AccordionPage
