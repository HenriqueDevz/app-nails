import { useState, useEffect } from "react";

export function useTheme() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    useEffect (() => {
        const html = document.documentElement
        if(isDark) {
            html.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            html.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])
    
    function toggleTheme () {
        setIsDark(prev => !prev)
    }

    return { isDark, toggleTheme}
}