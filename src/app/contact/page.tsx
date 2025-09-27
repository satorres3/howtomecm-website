import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - How to MeCM',
  description: 'Get in touch with our Microsoft technology experts for consulting services, training, and enterprise solutions.',
  openGraph: {
    title: 'Contact - How to MeCM',
    description: 'Get in touch with our Microsoft technology experts for consulting services, training, and enterprise solutions.',
    type: 'website',
    url: 'https://howtomecm.com/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white section-padding">

        <div className="container-modern relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Get in touch with our experts
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Whether you need Microsoft Configuration Manager consulting, Azure migration guidance,
              or PowerShell automation solutions, our team of certified experts is here to help.
            </p>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Modern Contact Options */}
      <section className="section-padding bg-white/95 dark:bg-slate-950">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Let&apos;s discuss your project
              </h2>
              <div className="space-y-8">
                <div className="card-modern dark:bg-slate-900 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">Email us</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Send us a detailed message about your project requirements and we&apos;ll get back to you within 24 hours.
                      </p>
                      <a href="mailto:contact@howtomecm.com" className="inline-flex items-center text-blue-600 hover:text-blue-400 font-semibold transition-colors duration-200 group-hover:translate-x-2">
                        contact@howtomecm.com
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-modern dark:bg-slate-900 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 group animate-slide-up stagger-delay-1">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">Connect with us</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Follow our latest insights and engage with our community on professional platforms.
                      </p>
                      <div className="flex space-x-6">
                        <a href="https://linkedin.com/in/sauloalvestorres" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-500 hover:text-purple-300 font-semibold transition-all duration-200 hover:scale-105">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                          LinkedIn
                        </a>
                        <a href="https://youtube.com/@howtomecm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-500 hover:text-purple-300 font-semibold transition-all duration-200 hover:scale-105">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Contact Form */}
            <div className="card-modern dark:bg-slate-900 dark:border-slate-800 p-8 lg:p-10 animate-slide-up stagger-delay-2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Send us a message
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                      First name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="input-modern dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                      Last name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="input-modern dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                    Email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-modern dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="input-modern dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                    placeholder="Your organization"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="input-modern dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="mecm-consulting">MECM/SCCM Consulting</option>
                    <option value="azure-migration">Azure Migration</option>
                    <option value="intune-implementation">Intune Implementation</option>
                    <option value="powershell-automation">PowerShell Automation</option>
                    <option value="training">Training Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="input-modern resize-none dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
                    placeholder="Tell us about your project, challenges, or requirements..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12l6 6 6-6M12 18V6" />
                    </svg>
                    Send message
                  </span>
                  <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Services Overview */}
    </main>
  )
}
