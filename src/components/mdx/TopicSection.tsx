import React from 'react'

interface TopicSectionProps {
  number?: number
  title: string
  children: React.ReactNode
  variant?: 'numbered' | 'plain'
}

export default function TopicSection({
  number,
  title,
  children,
  variant = 'numbered',
}: TopicSectionProps) {
  return (
    <div className="topic-section">
      <div className="topic-section__header">
        {variant === 'numbered' && number && <div className="topic-section__number">{number}</div>}
        <h3 className="topic-section__title">{title}</h3>
      </div>
      <div className="topic-section__content">{children}</div>
    </div>
  )
}
