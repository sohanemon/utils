"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSrc = exports.cssColorVariable = exports.kebabCase = exports.isNavActive = exports.cn = void 0;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
function isNavActive(href, path) {
    return href === '/' ? path === '/' : path === null || path === void 0 ? void 0 : path.includes(href);
}
exports.isNavActive = isNavActive;
function hexToHSLFormatted(hexColor) {
    var _a;
    const [r, g, b] = (_a = hexColor.match(/\w\w/g)) === null || _a === void 0 ? void 0 : _a.map((c) => parseInt(c, 16) / 255);
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
function kebabCase(camelCase) {
    return camelCase.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}
exports.kebabCase = kebabCase;
function cssColorVariable(colors) {
    const temp = {};
    Object.keys(colors).map((key) => {
        temp[`--${kebabCase(key)}`] = extractHSLValues(colors[key]);
    });
    return temp;
}
exports.cssColorVariable = cssColorVariable;
function cleanSrc(src) {
    if (src.includes('/public/'))
        return src.replace('/public/', '/');
    return src;
}
exports.cleanSrc = cleanSrc;
