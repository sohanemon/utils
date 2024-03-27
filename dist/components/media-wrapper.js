"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { useMediaQuery } from "../hooks";
export function MediaWrapper({ breakpoint, as = "div", ...props }) {
    const overMedia = useMediaQuery(breakpoint.split("-").pop());
    const isMax = breakpoint.startsWith("max");
    const Wrapper = overMedia === isMax ? React.Fragment : as;
    return _jsx(Wrapper, { ...props });
}
