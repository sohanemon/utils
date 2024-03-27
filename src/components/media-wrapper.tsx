"use client";
import * as React from "react";
import { useMediaQuery } from "../hooks";
type BreakPoints =
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "max-sm"
	| "max-md"
	| "max-lg"
	| "max-xl"
	| "max-2xl";
type MediaWrapperProps = React.ComponentProps<"div"> & {
	breakpoint: BreakPoints;
	as?: React.ElementType;
};

export function MediaWrapper({
	breakpoint,
	as = "div",
	...props
}: MediaWrapperProps) {
	const overMedia = useMediaQuery(breakpoint.split("-").pop() as `()`);
	const isMax = breakpoint.startsWith("max");
	const Wrapper = overMedia === isMax ? React.Fragment : as;

	return <Wrapper {...props} />;
}
