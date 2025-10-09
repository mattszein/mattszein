import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 className="font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-bold italic">{children}</h2>

    ),
    h3: ({ children }) => (
      <h3 className="italic underline">{children}</h3>
    ),
  }
}
