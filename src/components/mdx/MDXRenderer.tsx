'use client'

import { MDXRemote } from 'next-mdx-remote'
import { mdxComponents } from './index'

interface MDXRendererProps {
  source: any
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  )
}
