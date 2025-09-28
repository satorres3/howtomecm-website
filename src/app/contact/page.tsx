import { Metadata } from 'next'

import { getContactPageContent } from '../../lib/content'
import type { ContactFormField, ContactPageContent } from '@/types/site-content'

export const metadata: Metadata = {
  title: 'Contact - How to MeCM',
  description:
    'Get in touch with our Microsoft technology experts for consulting services, training, and enterprise solutions.',
  openGraph: {
    title: 'Contact - How to MeCM',
    description:
      'Get in touch with our Microsoft technology experts for consulting services, training, and enterprise solutions.',
    type: 'website',
    url: 'https://howtomecm.com/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
}

function fieldColumnClass(field: ContactFormField): string {
  if (['firstName', 'lastName', 'timeline', 'budget'].includes(field.id)) {
    return 'md:col-span-1'
  }
  return 'md:col-span-2'
}

function renderMethodIcon(id: string) {
  switch (id) {
    case 'email':
      return (
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )
    case 'network':
      return (
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      )
    default:
      return (
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8m-2 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
      )
  }
}

const methodGradients: Record<string, string> = {
  email: 'from-blue-500 to-blue-600',
  network: 'from-purple-500 to-purple-600',
}

const defaultMethods: ContactPageContent['methods'] = [
  {
    id: 'email',
    title: 'Email us',
    description:
      "Send us a detailed message about your project requirements and we'll get back to you within 24 hours.",
    action: {
      label: 'contact@howtomecm.com',
      href: 'mailto:contact@howtomecm.com',
    },
    icon: 'email',
  },
  {
    id: 'network',
    title: 'Connect with us',
    description:
      'Follow our latest insights and engage with our community on professional platforms.',
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/sauloalvestorres',
      },
      {
        label: 'YouTube',
        href: 'https://youtube.com/@howtomecm',
      },
    ],
    icon: 'network',
  },
]

const defaultForm: ContactPageContent['form'] = {
  title: 'Send us a message',
  description: "Tell us about your project and we'll get back to you within 24 hours.",
  fields: [
    { id: 'firstName', label: 'First name', type: 'text', required: true, placeholder: 'John' },
    { id: 'lastName', label: 'Last name', type: 'text', required: true, placeholder: 'Doe' },
    {
      id: 'email',
      label: 'Email address',
      type: 'email',
      required: true,
      placeholder: 'john.doe@company.com',
    },
    { id: 'company', label: 'Company', type: 'text', required: false, placeholder: 'Contoso' },
    {
      id: 'projectType',
      label: 'Project type',
      type: 'select',
      required: true,
      options: [
        'Microsoft Intune',
        'Microsoft MECM',
        'Automation & PowerShell',
        'Azure Infrastructure',
        'Training & Workshops',
        'Other',
      ],
    },
    {
      id: 'message',
      label: 'How can we help?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your project goals, timelines, and any key constraints.',
    },
    {
      id: 'timeline',
      label: 'Project timeline',
      type: 'select',
      required: false,
      options: [
        'Urgent (0-30 days)',
        'Near term (30-60 days)',
        'Planning (60-90 days)',
        'Researching options',
      ],
    },
    {
      id: 'budget',
      label: 'Estimated budget',
      type: 'select',
      required: false,
      options: ['Under $10k', '$10k - $25k', '$25k - $50k', '$50k+', 'Unsure'],
    },
  ],
  consent:
    'By submitting this form, you agree to our privacy policy and consent to being contacted about your inquiry.',
  submit: 'Submit message',
}

export default async function ContactPage() {
  const contactContentResult = await getContactPageContent()
  const contactContent: ContactPageContent | null = contactContentResult.success
    ? contactContentResult.data
    : null
  const hero = contactContent?.hero
  const methods =
    contactContent?.methods && contactContent.methods.length > 0
      ? contactContent.methods
      : defaultMethods
  const form = contactContent?.form || defaultForm

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern Hero Section */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container-modern relative z-10">
          <div className="animate-fade-in mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {hero?.title || 'Get in touch with our experts'}
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
              {hero?.subtitle ||
                'Whether you need Microsoft Configuration Manager consulting, Azure migration guidance, or PowerShell automation solutions, our team of certified experts is here to help.'}
            </p>

            {/* Floating Elements */}
            <div className="absolute left-10 top-10 h-20 w-20 animate-pulse rounded-full bg-white/10 blur-xl"></div>
            <div
              className="absolute bottom-10 right-10 h-32 w-32 animate-pulse rounded-full bg-purple-300/20 blur-2xl"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Modern Contact Options */}
      <section className="section-padding bg-white/95 dark:bg-slate-950">
        <div className="container-modern">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="animate-slide-up">
              <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Let&apos;s discuss your project
              </h2>
              <div className="space-y-8">
                {methods.map((method, index) => {
                  const gradient = methodGradients[method.id] || 'from-blue-500 to-blue-600'
                  return (
                    <div
                      key={method.id}
                      className={`card-modern group p-6 transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${index > 0 ? 'animate-slide-up stagger-delay-1' : ''}`}
                    >
                      <div className="flex items-start space-x-6">
                        <div
                          className={`h-16 w-16 bg-gradient-to-br ${gradient} flex flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}
                        >
                          {renderMethodIcon(method.id)}
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-400 dark:text-white">
                            {method.title}
                          </h3>
                          <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                            {method.description}
                          </p>
                          {method.action ? (
                            <a
                              href={method.action.href}
                              className="inline-flex items-center font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-400 group-hover:translate-x-2"
                            >
                              {method.action.label}
                              <svg
                                className="ml-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </a>
                          ) : null}
                          {method.links ? (
                            <div className="mt-4 flex space-x-6">
                              {method.links.map(link => (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center font-semibold text-blue-500 transition-all duration-200 hover:scale-105 hover:text-blue-300"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modern Contact Form */}
            <div className="card-modern animate-slide-up stagger-delay-2 p-8 dark:border-slate-800 dark:bg-slate-900 lg:p-10">
              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  {form.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
              </div>

              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {form.fields.map(field => (
                    <div key={field.id} className={fieldColumnClass(field)}>
                      <label
                        htmlFor={field.id}
                        className="mb-3 block text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        {field.label}
                        {field.required ? ' *' : ''}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          name={field.id}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="input-modern dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                          rows={4}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.id}
                          name={field.id}
                          required={field.required}
                          className="input-modern dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            {field.placeholder || 'Select an option'}
                          </option>
                          {(field.options || []).map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'email' ? 'email' : 'text'}
                          id={field.id}
                          name={field.id}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="input-modern dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    className="mr-3 mt-1"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-300">
                    {form.consent}
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
                >
                  {form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
