# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Code Style
- Extract shared browser API observer logic into reusable hooks rather than inlining in components. Confidence: 0.65
- Group related configuration props into an `options` object (e.g., `options?: InViewOptions` with `rootMargin` and `once`) instead of flat standalone props. Confidence: 0.65
- Passthrough components (like `RenderInView`) should use `<>...</>` fragments, not wrapping elements with `className`/`style`. Confidence: 0.70
- Use `RefObject<T | null>` for ref parameters to explicitly signal nullability. Confidence: 0.60

