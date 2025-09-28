export { default as Callout } from './Callout'
export { default as TopicSection } from './TopicSection'
export { default as CodeBlock } from './CodeBlock'

// MDX Components mapping for providers
import Callout from './Callout'
import TopicSection from './TopicSection'
import CodeBlock from './CodeBlock'

export const mdxComponents = {
  Callout,
  TopicSection,
  CodeBlock,
  // Simplified pre component - let the BlogPostContent handle copy buttons
  pre: ({ children, ...props }: any) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-6 font-mono text-sm text-gray-100"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: any) => {
    // For inline code, use default styling
    if (!className) {
      return (
        <code
          className="rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800"
          {...props}
        >
          {children}
        </code>
      )
    }
    // For code blocks, this will be handled by the pre component above
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}
