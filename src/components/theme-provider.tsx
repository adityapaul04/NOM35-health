import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem(storageKey)
        if (stored === "light" || stored === "dark") return stored
        return defaultTheme
    })

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    const value = { theme, setTheme }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
