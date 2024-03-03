'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
export const ResponsiveIndicator = () => {
    const [viewportWidth, setViewportWidth] = React.useState(window.innerWidth);
    const [position, setPosition] = React.useState(0); // State to manage button position
    React.useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Function to handle button click
    const handleClick = () => {
        setPosition((prevPosition) => (prevPosition + 1) % 4); // Cycle through positions
    };
    let text = '';
    if (viewportWidth < 640) {
        text = 'xs';
    }
    else if (viewportWidth >= 640 && viewportWidth < 768) {
        text = 'sm';
    }
    else if (viewportWidth >= 768 && viewportWidth < 1024) {
        text = 'md';
    }
    else if (viewportWidth >= 1024 && viewportWidth < 1280) {
        text = 'lg';
    }
    else if (viewportWidth >= 1280 && viewportWidth < 1536) {
        text = 'xl';
    }
    else {
        text = '2xl';
    }
    // Define positions
    const positions = [
        { bottom: '2rem', left: '2rem' },
        { bottom: '2rem', right: '2rem' },
        { top: '2rem', right: '2rem' },
        { top: '2rem', left: '2rem' }, // Top left
    ];
    const buttonStyle = {
        position: 'fixed',
        zIndex: 50,
        display: 'grid',
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '50%',
        placeContent: 'center',
        backgroundColor: '#2d3748',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '1rem',
        color: '#ffffff',
        border: '2px solid #4a5568',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '0.5rem',
        transition: 'all 0.2s ease-in-out',
        ...positions[position], // Apply the current position
    };
    if (process.env.NODE_ENV === 'production')
        return null;
    return (_jsx("button", { style: buttonStyle, onClick: handleClick, children: text }));
};
