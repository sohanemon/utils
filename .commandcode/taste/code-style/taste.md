# Code Style
- Extract shared browser API observer logic into reusable hooks rather than inlining in components. Confidence: 0.65
- Group related configuration props into an `options` object (e.g., `options?: InViewOptions` with `rootMargin` and `once`) instead of flat standalone props. Confidence: 0.65
- Passthrough components (like `RenderInView`) should use `<>...</>` fragments, not wrapping elements with `className`/`style`. Confidence: 0.70
- Use `RefObject<T | null>` for ref parameters to explicitly signal nullability. Confidence: 0.60
- Hooks that observe DOM elements should accept a ref as an input parameter rather than creating and returning one. Confidence: 0.65
- Keep ref type parameters generic (`T extends Element`) rather than narrowing to specific element types like `HTMLDivElement`. Confidence: 0.70
