'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export { Icon as Iconify } from '@iconify/react';
export function TailwindIndicator() {
    if (process.env.NODE_ENV === 'production')
        return null;
    return (_jsxs("div", { className: 'fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white', children: [_jsx("div", { className: 'block sm:hidden', children: "xs" }), _jsx("div", { className: 'hidden sm:block md:hidden', children: "sm" }), _jsx("div", { className: 'hidden md:block lg:hidden', children: "md" }), _jsx("div", { className: 'hidden lg:block xl:hidden', children: "lg" }), _jsx("div", { className: 'hidden xl:block 2xl:hidden', children: "xl" }), _jsx("div", { className: 'hidden 2xl:block', children: "2xl" })] }));
}
