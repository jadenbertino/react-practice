'use client'

import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Http } from '@/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useState, type Dispatch, type SetStateAction } from 'react'
import z from 'zod'

const CountrySchema = z.object({
  isoCode: z.string(),
  name: z
    .array(
      z.object({
        text: z.string().describe('The name of the country'),
      }),
    )
    .nonempty()
    .transform((items) => items[0]!.text),
})

type Country = z.infer<typeof CountrySchema>
type SelectedCountry = Country | undefined

const HolidaySchema = z
  .object({
    id: z.string(),
    startDate: z.string().transform((s) => new Date(s)),
    endDate: z.string().transform((s) => new Date(s)),
    name: z
      .array(
        z.object({
          text: z.string().describe('The name of the holiday'),
        }),
      )
      .nonempty()
      .transform((items) => items[0]!.text),
  })
  .loose()

/**
 * @see https://reactpractice.dev/exercise/build-a-public-holidays-app/?utm_source=calendar.reactpractice.dev&utm_medium=social&utm_campaign=calendar-v1
 */
export default function WeatherPage() {
  const [country, setCountry] = useState<SelectedCountry>()

  return (
    <Container>
      <CountriesList
        country={country}
        setCountry={setCountry}
      />
      <Holidays country={country} />
    </Container>
  )
}

const Holidays = ({ country }: { country: SelectedCountry }) => {
  const { data: holidays, error } = useQuery({
    queryKey: ['countries', 'list', country],
    queryFn: async () => {
      const holidays = await holidaysApi.get('/PublicHolidays', {
        params: {
          countryIsoCode: country?.isoCode,
          validFrom: '2023-01-01',
          validTo: '2023-12-31',
          languageIsoCode: 'en',
        },
        schema: z.array(HolidaySchema),
      })
      return holidays.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      )
    },
    enabled: Boolean(country),
  })

  if (error) {
    console.log(error)
    return <div>error</div>
  }

  if (!country) return

  return (
    <div>
      <h1 className='font-bold'>Holidays for {country.name} </h1>
      <ul className='pl-4'>
        {holidays?.map((holiday) => (
          <li
            key={holiday.id}
            className='list-disc'
          >
            [{holiday.startDate.toLocaleDateString()}] {holiday.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

type CountriesListProps = {
  country: SelectedCountry
  setCountry: Dispatch<SetStateAction<SelectedCountry>>
}

const CountriesList = ({ country, setCountry }: CountriesListProps) => {
  const { data: countries } = useQuery({
    queryKey: ['countries', 'list'],
    queryFn: async () => {
      return await holidaysApi.get('/Countries', {
        params: {
          languageIsoCode: 'en',
        },
        schema: z.array(CountrySchema),
      })
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
            <DropdownMenuLabel>{country.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        {countries?.map((country) => (
          <DropdownMenuItem
            key={country.isoCode}
            onSelect={() => setCountry(country!)}
          >
            {country.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const holidaysApi = new Http({
  baseURL: 'https://openholidaysapi.org',
})
