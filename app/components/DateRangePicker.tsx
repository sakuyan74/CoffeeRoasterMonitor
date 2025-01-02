'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function DateRangePicker({
  className,
  onDateRangeChange
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateRangeChange: (range: DateRange | undefined) => void
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30), // 変更箇所
    to: new Date(),
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y', { locale: ja })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: ja })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: ja })
              )
            ) : (
              <span>日付を選択してください</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              onDateRangeChange(newDate)
            }}
            numberOfMonths={2}
            locale={ja}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
