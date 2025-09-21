'use client'

interface CopyButtonProps {
  text: string
  className?: string
  children: React.ReactNode
}

export default function CopyButton({ text, className = '', children }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <button
      onClick={handleCopy}
      className={className}
    >
      {children}
    </button>
  )
}