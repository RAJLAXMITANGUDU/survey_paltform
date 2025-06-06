"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, PlusCircle, Search, Menu, Home, BarChart3, Users, Settings, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HelpButton } from "@/components/help-button"

export default function DashboardHeader() {
  const [showSearch, setShowSearch] = useState(false)

  const navItems = [
    { name: "My Survey Hub", href: "/", icon: Home },
    { name: "Surveys", href: "/surveys", icon: FileText },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Respondents", href: "/respondents", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="size-4 text-primary" />
              </div>
              <span className="font-semibold text-lg text-foreground">SurveyMaster</span>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="size-4 text-primary" />
          </div>
          <span className="font-semibold text-lg text-foreground">SurveyMaster</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 mx-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5"
          >
            <item.icon className="size-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex flex-1 items-center gap-4 md:ml-auto">
        {showSearch ? (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px]"
              onBlur={() => setShowSearch(false)}
              autoFocus
            />
          </div>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8 md:hidden" onClick={() => setShowSearch(true)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        )}
        <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[300px] bg-background pl-8" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <HelpButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New response to "Customer Satisfaction Survey"</DropdownMenuItem>
            <DropdownMenuItem>Survey "Product Feedback" is trending</DropdownMenuItem>
            <DropdownMenuItem>Weekly report is available</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/surveys/create">
          <Button size="sm" className="hidden md:flex">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Survey
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/abstract-geometric-shapes.png?height=32&width=32&query=user" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
