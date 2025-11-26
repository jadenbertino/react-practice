'use client'

import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Http } from '@/lib/http'
import { serialize } from '@/lib/logs/shared'
import { useQuery } from '@tanstack/react-query'
import { useState, type Dispatch, type SetStateAction } from 'react'
import z from 'zod'

/**
 * @see https://reactpractice.dev/exercise/build-a-public-holidays-app/?utm_source=calendar.reactpractice.dev&utm_medium=social&utm_campaign=calendar-v1
 */
export default function WeatherPage() {
  const [country, setCountry] = useState('hi')

  return (
    <Container>
      <CountriesList
        country={country}
        setCountry={setCountry}
      />
    </Container>
  )
}

type CountriesListProps = {
  country: string
  setCountry: Dispatch<SetStateAction<string>>
}

const CountriesList = ({ country, setCountry }: CountriesListProps) => {
  const { data: countries } = useQuery({
    queryKey: ['countries', 'list'],
    queryFn: async () => {
      const data = await holidaysApi.get('/Countries', {
        params: {
          languageIsoCode: 'en',
        },
        schema: z.array(CountrySchema),
      })
      const countries = data.map((item) => item.name[0]?.text).filter(Boolean)
      return countries
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Countries</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='max-h-[400px]'>
        {country && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>{country}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        {countries?.map((country) => (
          <DropdownMenuItem
            key={country}
            onSelect={() => setCountry(country!)}
          >
            {country}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CountrySchema = z.object({
  name: z
    .array(
      z.object({
        text: z.string().describe('The name of the country'),
      }),
    )
    .nonempty(),
})

// {"isoCode":"AD","name":[ {"language":"EN","text":"Andorra"}],"officialLanguages":["CA"]},

const holidaysApi = new Http({
  baseURL: 'https://openholidaysapi.org',
})
