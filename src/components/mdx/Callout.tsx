import React from 'react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'important' | 'tip'
  title?: string
  children: React.ReactNode
}

const calloutStyles = {
  info: {
    container: 'callout-box callout-box--info',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
  warning: {
    container: 'callout-box callout-box--warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
  },
  important: {
    container: 'callout-box callout-box--important',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
  },
  tip: {
    container: 'callout-box callout-box--tip',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
      </svg>
    ),
  },
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = calloutStyles[type]

  return (
    <div className={style.container}>
      <div className="callout-box__header">
        <div className="callout-box__icon">{style.icon}</div>
        <span>{title || type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </div>
      <div className="callout-box__content">{children}</div>
    </div>
  )
}
