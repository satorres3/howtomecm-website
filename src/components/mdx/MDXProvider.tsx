'use client'

import { MDXProvider as NextMDXProvider } from '@mdx-js/react'
import { mdxComponents } from './index'

interface MDXProviderProps {
  children: React.ReactNode
}

export default function MDXProvider({ children }: MDXProviderProps) {
  return <NextMDXProvider components={mdxComponents}>{children}</NextMDXProvider>
}
