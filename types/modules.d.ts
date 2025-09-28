declare module '@mdx-js/react' {
  import type { ComponentType, ReactNode } from 'react'

  export interface MDXProviderProps {
    children: ReactNode
    components?: Record<string, ComponentType<any>>
  }

  export const MDXProvider: ComponentType<MDXProviderProps>
}

declare module 'next-mdx-remote' {
  import type { ComponentType } from 'react'

  export interface MDXRemoteSerializeResult {
    compiledSource: string
    frontmatter?: Record<string, unknown>
    scope?: Record<string, unknown>
  }

  export interface MDXRemoteProps extends MDXRemoteSerializeResult {
    components?: Record<string, ComponentType<any>>
  }

  export function MDXRemote(props: MDXRemoteProps): JSX.Element
}

declare module 'next-mdx-remote/serialize' {
  import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

  export interface SerializeOptions {
    scope?: Record<string, unknown>
    mdxOptions?: Record<string, unknown>
  }

  export function serialize(
    source: string,
    options?: SerializeOptions
  ): Promise<MDXRemoteSerializeResult>
}

declare module 'gray-matter' {
  function matter(
    input: string,
    options?: Record<string, unknown>
  ): {
    content: string
    data: Record<string, unknown>
    excerpt?: string
    orig: {
      value: string
      stripped: string
    }
  }

  export = matter
}

declare module 'reading-time' {
  interface ReadingTimeOptions {
    wordsPerMinute?: number
  }

  interface ReadingTimeResult {
    text: string
    minutes: number
    time: number
    words: number
  }

  function readingTime(text: string, options?: ReadingTimeOptions): ReadingTimeResult

  export = readingTime
}
