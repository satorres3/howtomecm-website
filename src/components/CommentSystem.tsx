'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  createdAt: string
  replies?: Comment[]
  isApproved?: boolean
}

interface CommentSystemProps {
  postId: string
  postTitle: string
  moderationEnabled?: boolean
  allowReplies?: boolean
  className?: string
}

export default function CommentSystem({
  postId,
  postTitle,
  moderationEnabled = true,
  allowReplies = true,
  className = ''
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState({
    author: { name: '', email: '' },
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Load comments (in a real implementation, this would fetch from an API)
  useEffect(() => {
    // Mock data for demonstration
    const mockComments: Comment[] = [
      {
        id: '1',
        author: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
        },
        content: 'Great article! Very helpful for understanding MECM co-management.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isApproved: true,
        replies: [
          {
            id: '2',
            author: {
              name: 'Sarah Smith',
              email: 'sarah@example.com',
              avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random'
            },
            content: 'I agree! The section on hybrid cloud management was particularly insightful.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isApproved: true
          }
        ]
      }
    ]
    setComments(mockComments)
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.author.name.trim() || !newComment.author.email.trim() || !newComment.content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would send to an API
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          ...newComment.author,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newComment.author.name)}&background=random`
        },
        content: newComment.content,
        createdAt: new Date().toISOString(),
        isApproved: !moderationEnabled,
        replies: []
      }

      if (replyingTo) {
        // Add as reply
        setComments(prev => prev.map(c =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        ))
      } else {
        // Add as new comment
        setComments(prev => [comment, ...prev])
      }

      setNewComment({ author: { name: '', email: '' }, content: '' })
      setReplyingTo(null)
      setSubmitStatus('success')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-start space-x-4">
          <img
            src={comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=random`}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
              </div>
              {!comment.isApproved && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending approval
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {comment.content}
            </p>
            {allowReplies && !isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.map(reply => renderComment(reply, true))}

      {/* Reply form */}
      {replyingTo === comment.id && (
        <div className="ml-8 mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Replying to {comment.author.name}
            </h4>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newComment.author.name}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    author: { ...prev.author, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={newComment.author.email}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    author: { ...prev.author, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <textarea
                placeholder="Your reply..."
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.filter(c => c.isApproved).length})
      </h3>

      {/* Comment form */}
      {!replyingTo && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave a Comment
          </h4>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={newComment.author.name}
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={newComment.author.email}
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  author: { ...prev.author, email: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>
            <textarea
              placeholder="Your comment..."
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
              {submitStatus === 'success' && (
                <span className="text-green-600 dark:text-green-400 text-sm">
                  {moderationEnabled ? 'Comment submitted for approval!' : 'Comment posted!'}
                </span>
              )}
              {submitStatus === 'error' && (
                <span className="text-red-600 dark:text-red-400 text-sm">
                  Error posting comment. Please try again.
                </span>
              )}
            </div>
          </form>
          {moderationEnabled && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Comments are moderated and may take some time to appear.
            </p>
          )}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.filter(c => c.isApproved).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.filter(c => c.isApproved).map(comment => renderComment(comment))
        )}
      </div>
    </div>
  )
}