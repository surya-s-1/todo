import { createContext, useContext, ReactNode, useState } from "react"

interface WrappedComponent {
    children: ReactNode
}

type ThemeType = 'light' | 'dark'

type ModeContextType = {
    theme: ThemeType
    setTheme: (type: ThemeType) => void
}

const ModeContext = createContext<ModeContextType>({ theme: 'light', setTheme: (val: ThemeType) => {}})

export const useSystemTheme = () => {
    return useContext(ModeContext)
}

export default function DarkModeWrapper({ children }: WrappedComponent) {
    const [theme, setTheme] = useState<ThemeType>('light')

    return(
        <ModeContext.Provider value={{theme, setTheme}}>
            {children}
        </ModeContext.Provider>
    )
}