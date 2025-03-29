"use client"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type ThemeOption = {
  name: string
  value: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  bgColor: string
}

export const themes: ThemeOption[] = [
  {
    name: "Modern",
    value: "modern",
    primaryColor: "rgb(244, 63, 94)", // rose-500
    secondaryColor: "rgb(253, 232, 232)", // rose-50
    fontFamily: "sans-serif",
    bgColor: "rgb(253, 242, 248)", // rose-50
  },
  {
    name: "Traditional",
    value: "traditional",
    primaryColor: "rgb(180, 83, 9)", // amber-700
    secondaryColor: "rgb(254, 243, 199)", // amber-100
    fontFamily: "serif",
    bgColor: "rgb(255, 251, 235)", // amber-50
  },
  {
    name: "Islamic",
    value: "islamic",
    primaryColor: "rgb(21, 128, 61)", // green-700
    secondaryColor: "rgb(220, 252, 231)", // green-100
    fontFamily: "serif",
    bgColor: "rgb(240, 253, 244)", // green-50
  },
  {
    name: "Minimalist",
    value: "minimalist",
    primaryColor: "rgb(17, 24, 39)", // gray-900
    secondaryColor: "rgb(243, 244, 246)", // gray-100
    fontFamily: "sans-serif",
    bgColor: "rgb(249, 250, 251)", // gray-50
  },
]

interface ThemeSelectorProps {
  currentTheme: ThemeOption
  onThemeChange: (theme: ThemeOption) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: currentTheme.primaryColor }} />
          {currentTheme.name} Theme
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onThemeChange(theme)}
          >
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
            <span>{theme.name}</span>
            {currentTheme.value === theme.value && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

