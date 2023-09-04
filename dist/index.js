import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function isNavActive(href, path) {
    return href === '/' ? path === '/' : path?.includes(href);
}
function hexToHSLFormatted(hexColor) {
    const [r, g, b] = hexColor.match(/\w\w/g)?.map((c) => parseInt(c, 16) / 255);
    const maxVal = Math.max(r, g, b), minVal = Math.min(r, g, b);
    const lightness = (maxVal + minVal) / 2;
    const delta = maxVal - minVal;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    let hue = delta !== 0
        ? maxVal === r
            ? ((g - b) / delta + (g < b ? 6 : 0)) * 60
            : maxVal === g
                ? ((b - r) / delta + 2) * 60
                : ((r - g) / delta + 4) * 60
        : 0;
    if (hue < 0)
        hue += 360;
    return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}
function extractHSLValues(input) {
    if (input.includes('#'))
        return hexToHSLFormatted(input);
    const matches = input.match(/hsla?\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*[\d.]+)?\)/);
    if (!matches)
        throw new Error(`Invalid HSL format: ${input}`);
    return `${matches[1]} ${matches[2]}% ${matches[3]}%`;
}
export function kebabCase(camelCase) {
    return camelCase.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}
export function cssColorVariable(colors) {
    const temp = {};
    Object.keys(colors).map((key) => {
        temp[`--${kebabCase(key)}`] = extractHSLValues(colors[key]);
    });
    return temp;
}
export function cleanSrc(src) {
    if (src.includes('/public/'))
        return src.replace('/public/', '/');
    return src;
}
export function tailwindColorObject(input) {
    const transformed = {};
    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            if (key.endsWith('Foreground')) {
                const baseKey = key.replace(/Foreground$/, '');
                if (!transformed[baseKey]) {
                    // @ts-ignore
                    transformed[baseKey] = {};
                }
                // @ts-ignore
                transformed[baseKey].foreground = `hsl(var(--${key}))`;
            }
            else {
                if (!transformed[key]) {
                    transformed[key] = { DEFAULT: `hsl(var(--${key}))` };
                }
                else {
                    // @ts-ignore
                    transformed[key].DEFAULT = `hsl(var(--${key}))`;
                }
            }
        }
    }
    return transformed;
}
