'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const LIQUID_FILTER = `
<svg style="position:absolute;width:0;height:0">
  <defs>
    <filter id="liquid-glass" primitiveUnits="objectBoundingBox">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur"/>
      <feDisplacementMap in="blur" in2="SourceGraphic" scale="0.08" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>`;

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-5 h-5">
        <path fill="currentColor" fillRule="evenodd" d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd" />
        <path fill="currentColor" d="M17 6.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 7.742a1 1 0 1 1 1.618 1.176L24.1 11.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 13.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM29.722 20.795a1 1 0 0 1-.619 1.902l-2.853-.927a1 1 0 1 1 .618-1.902l2.854.927ZM25.862 27.159a1 1 0 0 1-1.618 1.175l-1.763-2.427a1 1 0 1 1 1.618-1.175l1.763 2.427ZM19 30.038a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0v3ZM11.755 28.334a1 1 0 0 1-1.618-1.175l1.764-2.427a1 1 0 1 1 1.618 1.175l-1.764 2.427ZM6.896 22.697a1 1 0 1 1-.618-1.902l2.853-.927a1 1 0 1 1 .618 1.902l-2.853.927ZM6.278 15.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 8.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-5 h-5">
        <path fill="currentColor" d="M12.5 8.473a10.968 10.968 0 0 1 8.785-.97 7.435 7.435 0 0 0-3.737 4.672l-.09.373A7.454 7.454 0 0 0 28.732 20.4a10.97 10.97 0 0 1-5.232 7.125l-.497.27c-5.014 2.566-11.175.916-14.234-3.813l-.295-.483C5.53 18.403 7.13 11.93 12.017 8.77l.483-.297Zm4.234.616a8.946 8.946 0 0 0-2.805.883l-.429.234A9 9 0 0 0 10.206 22.5l.241.395A9 9 0 0 0 22.5 25.794l.416-.255a8.94 8.94 0 0 0 2.167-1.99 9.433 9.433 0 0 1-2.782-.313c-5.043-1.352-8.036-6.535-6.686-11.578l.147-.491c.242-.745.573-1.44.972-2.078Z" />
    </svg>
);

const DimIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-5 h-5">
        <path fill="currentColor" d="M5 21a1 1 0 0 1 1-1h24a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM12 25a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1ZM15 29a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM18 13a6 6 0 0 1 5.915 7h-2.041A4.005 4.005 0 0 0 18 15a4 4 0 0 0-3.874 5h-2.041A6 6 0 0 1 18 13ZM17 7.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 8.742a1 1 0 1 1 1.618 1.176L24.1 12.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 14.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM6.278 16.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 9.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z" />
    </svg>
);

const themes = [
    { value: 'light', label: 'Light', Icon: SunIcon },
    { value: 'dark', label: 'Dark', Icon: MoonIcon },
    { value: 'dim', label: 'Dim', Icon: DimIcon },
];

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-9 w-28 rounded-full bg-secondary-100 dark:bg-white/10 animate-pulse" />;

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: LIQUID_FILTER }} />
            <div
                role="radiogroup"
                aria-label="Choose theme"
                className="relative flex items-center gap-1 rounded-full p-1"
                style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
            >
                {/* Sliding indicator */}
                <div
                    className="absolute top-1 h-7 w-7 rounded-full transition-all duration-300 ease-out"
                    style={{
                        left: `calc(${themes.findIndex(t => t.value === theme) * (28 + 4)}px + 4px)`,
                        background: theme === 'light'
                            ? 'rgba(255,255,255,0.9)'
                            : 'rgba(50,118,66,0.85)',
                        boxShadow: theme === 'light'
                            ? '0 1px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
                            : '0 1px 8px rgba(50,118,66,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                />
                {themes.map(({ value, label, Icon }) => {
                    const isActive = theme === value;
                    return (
                        <button
                            key={value}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={label}
                            title={label}
                            onClick={() => setTheme(value)}
                            className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200"
                            style={{
                                color: isActive
                                    ? (theme === 'light' ? '#1a1a1a' : '#fff')
                                    : 'rgba(100,100,100,0.7)',
                                filter: isActive ? 'url(#liquid-glass)' : 'none',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            <Icon />
                        </button>
                    );
                })}
            </div>
        </>
    );
}
