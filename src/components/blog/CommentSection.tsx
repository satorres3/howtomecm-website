'use client'

import { useState } from 'react'

// Simple HTML sanitization function
const sanitizeHTML = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

type Comment = {
  id: string
  name: string
  message: string
  createdAt: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
  parentId?: string
}

interface CommentSectionProps {
  postId: string
}

const initialComments: Comment[] = [
  {
    id: 'comment-1',
    name: 'Lena H.',
    message: 'Loved the automation walkthrough — the GitHub Actions snippet saved us a ton of trial and error.',
    createdAt: '2024-03-18T09:00:00Z',
    likes: 5,
    replies: [],
    isLiked: false
  },
  {
    id: 'comment-2',
    name: 'Jason M.',
    message: 'We applied the hybrid join checklist last week. Seeing far fewer Autopilot failures now.',
    createdAt: '2024-03-21T14:30:00Z',
    likes: 3,
    replies: [{
      id: 'reply-1',
      name: 'Sarah K.',
      message: 'Great to hear! Which part of the checklist was most helpful for you?',
      createdAt: '2024-03-21T16:45:00Z',
      likes: 1,
      replies: [],
      isLiked: false,
      parentId: 'comment-2'
    }],
    isLiked: false
  }
]

// Security validation functions
const validateComment = (name: string, message: string): { isValid: boolean; error?: string } => {
  // Check for spam words
  const spamWords = ['spam', 'buy now', 'click here', 'free money', 'viagra', 'casino']
  const messageContent = message.toLowerCase()
  const nameContent = name.toLowerCase()

  if (spamWords.some(word => messageContent.includes(word) || nameContent.includes(word))) {
    return { isValid: false, error: 'Your message contains prohibited content.' }
  }

  // Check for excessive caps (more than 50% uppercase)
  const uppercaseCount = (message.match(/[A-Z]/g) || []).length
  const letterCount = (message.match(/[a-zA-Z]/g) || []).length
  if (letterCount > 0 && uppercaseCount / letterCount > 0.5) {
    return { isValid: false, error: 'Please avoid excessive use of capital letters.' }
  }

  // Check for too many URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = message.match(urlRegex) || []
  if (urls.length > 2) {
    return { isValid: false, error: 'Comments cannot contain more than 2 links.' }
  }

  // Check minimum/maximum length
  if (message.trim().length < 10) {
    return { isValid: false, error: 'Comment must be at least 10 characters long.' }
  }
  if (message.trim().length > 1000) {
    return { isValid: false, error: 'Comment cannot exceed 1000 characters.' }
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' }
  }

  return { isValid: true }
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [formState, setFormState] = useState({ name: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)
  const [validationError, setValidationError] = useState<string>('')

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        }
      }
      // Handle replies
      if (comment.replies.some(reply => reply.id === commentId)) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                }
              : reply
          )
        }
      }
      return comment
    }))
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
    setFormState({ name: '', message: '' })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError('')

    if (!formState.name.trim() || !formState.message.trim()) {
      setValidationError('Please fill in all required fields.')
      return
    }

    // Rate limiting - prevent rapid successive posts (30 seconds)
    const now = Date.now()
    if (now - lastSubmitTime < 30000) {
      setValidationError('Please wait a moment before posting again.')
      return
    }

    // Security validation
    const validation = validateComment(formState.name, formState.message)
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid comment.')
      return
    }

    setIsSubmitting(true)

    // Simulated network delay so the form feels responsive without a backend.
    await new Promise(resolve => setTimeout(resolve, 600))

    const newComment: Comment = {
      id: `${postId}-${Date.now()}`,
      name: formState.name.trim(),
      message: formState.message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      parentId: replyingTo || undefined
    }

    if (replyingTo) {
      // Add as reply to existing comment
      setComments(prev => prev.map(comment =>
        comment.id === replyingTo
          ? { ...comment, replies: [...comment.replies, newComment] }
          : comment
      ))
      setReplyingTo(null)
    } else {
      // Add as new top-level comment
      setComments(prev => [newComment, ...prev])
    }

    setFormState({ name: '', message: '' })
    setIsSubmitting(false)
    setLastSubmitTime(now)
  }

  return (
    <section className="mt-16 space-y-10" aria-labelledby="comments-title">
      <header>
        <h2 id="comments-title" className="text-2xl font-semibold text-gray-900 dark:text-white">
          Join the discussion
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Leave a question or share what worked for you — the community riffs on every deployment scenario.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900/70">
        {replyingTo && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <span>Replying to comment</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        )}
        {validationError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {validationError}
          </div>
        )}
        <div>
          <label htmlFor="comment-name" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Name
          </label>
          <input
            id="comment-name"
            name="author"
            value={formState.name}
            onChange={event => setFormState(state => ({ ...state, name: event.target.value }))}
            className="input-modern mt-2"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="comment-message" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
            {replyingTo ? 'Reply' : 'Comment'}
          </label>
          <textarea
            id="comment-message"
            name="message"
            value={formState.message}
            onChange={event => setFormState(state => ({ ...state, message: event.target.value }))}
            className="input-modern mt-2"
            rows={4}
            placeholder={replyingTo ? "Write your reply..." : "What stood out to you?"}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900"
        >
          {isSubmitting ? 'Sending…' : (replyingTo ? 'Post reply' : 'Post comment')}
        </button>
      </form>

      <ul className="space-y-4">
        {comments.map(comment => (
          <li key={comment.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.name) }}
              />
              <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={comment.createdAt}>
                {new Date(comment.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
            <p
              className="mt-2 text-sm text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.message) }}
            />

            {/* Like and Reply buttons */}
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  comment.isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
                }`}
              >
                <svg className="h-4 w-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
              </button>

              <button
                onClick={() => handleReply(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
                Reply
              </button>

              {comment.replies.length > 0 && (
                <span className="text-xs text-gray-400">
                  {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                </span>
              )}
            </div>

            {/* Nested replies */}
            {comment.replies.length > 0 && (
              <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-600 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(reply.name) }}
                      />
                      <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={reply.createdAt}>
                        {new Date(reply.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    <p
                      className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(reply.message) }}
                    />

                    <div className="mt-2 flex items-center gap-4">
                      <button
                        onClick={() => handleLike(reply.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          reply.isLiked
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
                        }`}
                      >
                        <svg className="h-3 w-3" fill={reply.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        {reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
