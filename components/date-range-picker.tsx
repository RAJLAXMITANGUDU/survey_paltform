"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  dateRange: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export default function DateRangePicker({ dateRange, onChange, className }: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    const from = new Date()

    switch (preset) {
      case "last7days":
        from.setDate(today.getDate() - 7)
        onChange({ from, to: today })
        break
      case "last30days":
        from.setDate(today.getDate() - 30)
        onChange({ from, to: today })
        break
      case "lastMonth":
        from.setMonth(today.getMonth() - 1)
        from.setDate(1)
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        onChange({ from, to: lastDayOfLastMonth })
        break
      case "thisMonth":
        from.setDate(1)
        onChange({ from, to: today })
        break
      case "allTime":
        from.setFullYear(2023)
        from.setMonth(0)
        from.setDate(1)
        onChange({ from, to: today })
        break
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row gap-2 p-3">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="allTime">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onChange(range || { from: undefined, to: undefined })
              if (range?.to) {
                setIsPopoverOpen(false)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
