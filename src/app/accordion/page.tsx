'use client'

import { Accordion } from '@/components/ui/accordion'
import Container from '@/components/ui/container'

const AccordionPage = () => {
  return (
    <Container className='h-full flex flex-col justify-center items-stretch max-w-lg'>
      <Accordion.Root>
        <Accordion.Header>
          <h3 className='flex-grow text-left'>header</h3>
        </Accordion.Header>
        <Accordion.Content>content</Accordion.Content>
      </Accordion.Root>
    </Container>
  )
}

export default AccordionPage
