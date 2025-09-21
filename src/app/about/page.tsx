import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Saulo Torres - Microsoft Expert & Blogger',
  description: 'Meet Saulo Torres, a Microsoft technology expert sharing insights about MECM, Azure, and modern device management through practical tutorials and real-world experiences.',
  openGraph: {
    title: 'About Saulo Torres - Microsoft Expert & Blogger',
    description: 'Meet Saulo Torres, a Microsoft technology expert sharing insights about MECM, Azure, and modern device management through practical tutorials and real-world experiences.',
    type: 'website',
    url: 'https://howtomecm.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Clean Hero Section */}
      <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              About Saulo Torres
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Microsoft technology expert sharing practical insights about MECM, Azure, and modern device management through real-world experiences and tutorials.
            </p>

            {/* LinkedIn CTA */}
            <a
              href="https://linkedin.com/in/sauloalvestorres"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 rounded-lg font-medium transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                My Journey
              </h2>
              <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                <p className="text-lg leading-relaxed mb-6">
                  I'm a Microsoft technology expert with over 15 years of experience helping organizations navigate the complexities of modern IT infrastructure and device management. My passion lies in translating complex technical concepts into practical, actionable solutions.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Through this blog, I share real-world insights, tutorials, and lessons learned from working with Microsoft Configuration Manager (MECM), Azure cloud technologies, and modern device management solutions. My goal is to help IT professionals overcome challenges I've faced throughout my career.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  When I'm not writing or consulting, you can find me exploring the latest Microsoft technologies, contributing to the IT community, and continuously learning about emerging trends in enterprise technology.
                </p>
                <p className="text-lg leading-relaxed">
                  Feel free to connect with me on LinkedIn to discuss Microsoft technologies, share experiences, or just say hello. I'm always interested in connecting with fellow IT professionals and learning from different perspectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics I Cover */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Topics I Cover
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Practical insights and tutorials on Microsoft enterprise technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                MECM/SCCM
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Configuration Manager deployment, troubleshooting, and optimization strategies from real-world implementations.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Azure Cloud
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cloud migration strategies, Azure infrastructure design, and hybrid cloud implementations.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Modern Device Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Microsoft Intune, co-management, and modern workplace solutions for hybrid environments.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Interested in discussing Microsoft technologies or sharing experiences? I'd love to connect with fellow IT professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="https://linkedin.com/in/sauloalvestorres"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#0077B5] hover:bg-[#005885] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300"
              >
                Read the Blog
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}