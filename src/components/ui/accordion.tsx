import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

const AccordionRoot = ({
  children,
  initialOpen = false,
}: {
  children?: ReactNode
  initialOpen?: boolean
}) => {
  const [open, setOpen] = useState(initialOpen)

  return (
    <AccordionContext.Provider value={{ open, setOpen }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionHeader = ({ children }: { children?: ReactNode }) => {
  const { open, setOpen } = useAccordionContext()
  const toggleOpen = () => setOpen((prev) => !prev)

  return (
    <button
      className='flex w-full'
      onClick={toggleOpen}
    >
      {children}
      <span
        className={cn(
          'transition-transform duration-300 ease-in-out',
          open && '-rotate-90',
        )}
      >
        {'<'}
      </span>
    </button>
  )
}

const AccordionContent = ({ children }: { children?: ReactNode }) => {
  const { open } = useAccordionContext()

  return (
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
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type AccordionContextProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const AccordionContext = createContext<AccordionContextProps | null>(null)

const useAccordionContext = () => {
  const ctx = useContext(AccordionContext)
  if (!ctx) {
    throw new Error(
      'useAccordionContext must be called with an AccordionContext.Provider',
    )
  }
  return ctx
}

const Accordion = {
  Root: AccordionRoot,
  Header: AccordionHeader,
  Content: AccordionContent,
}

export { Accordion }
