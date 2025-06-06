"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  ClipboardCheck,
  Home,
  PlusCircle,
  Settings,
  LogOut,
  Users,
  FileText,
  LayoutTemplate,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import HelpVideoModal from "@/components/help-video-modal"

export default function TopNavbar() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Don't show navbar on login page
  if (pathname === "/login") {
    return null
  }

  const navItems = [
    { href: "/", label: "My Survey Hub", icon: Home },
    { href: "/surveys", label: "My Surveys", icon: FileText },
    { href: "/surveys/create", label: "Create Survey", icon: PlusCircle },
    { href: "/surveys/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/respondents", label: "Respondents", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 mr-4">
            <ClipboardCheck className="h-6 w-6" />
            <Link href="/" className="font-bold text-xl hidden md:inline-block text-foreground">
              SurveyPro
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors
                    ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile navigation */}
          {showMobileMenu && (
            <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden z-50">
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                        ${
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}

          {/* Right side items */}
          <div className="ml-auto flex items-center gap-2">
            {showSearch ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] md:w-[300px] bg-background pl-8"
                  onBlur={() => setShowSearch(false)}
                  autoFocus
                />
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowHelpModal(true)}>
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 gap-2 pl-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <HelpVideoModal open={showHelpModal} onOpenChange={setShowHelpModal} />
    </>
  )
}
