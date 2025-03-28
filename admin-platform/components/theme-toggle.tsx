"use client"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

interface ThemeToggleProps {
  size?: "default" | "large"
}

export function ThemeToggle({ size = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const iconSize = size === "large" ? "h-6 w-6" : "h-5 w-5"
  const buttonSize = size === "large" ? "h-10 w-10" : "h-9 w-9"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={`relative rounded-full ${buttonSize}`}>
          <motion.div
            initial={false}
            animate={{
              rotate: theme === "dark" ? 0 : 180,
              opacity: theme === "dark" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <Moon className={`${iconSize} text-foreground`} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              rotate: theme === "light" ? 0 : -180,
              opacity: theme === "light" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <Sun className={`${iconSize} text-foreground`} />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center">
            <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </span>
          <span>System</span>
          {theme === "system" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

