import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - How to MeCM',
  description: 'Learn about our team of Microsoft technology experts and our mission to provide world-class consulting services for enterprise environments.',
  openGraph: {
    title: 'About - How to MeCM',
    description: 'Learn about our team of Microsoft technology experts and our mission to provide world-class consulting services for enterprise environments.',
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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About How to MeCM
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We are a team of Microsoft technology experts dedicated to helping organizations
              navigate the complexities of modern IT infrastructure and device management.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower organizations with expert knowledge and practical solutions for Microsoft
                Configuration Manager (MECM), Azure cloud technologies, and modern device management.
                We bridge the gap between complex enterprise requirements and effective implementation strategies.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through comprehensive consulting, training, and thought leadership, we help IT professionals
                and organizations achieve their technology goals while maintaining security, compliance, and operational efficiency.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                  <div className="text-sm text-gray-600">Enterprise Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">99%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in Microsoft enterprise technologies and provide end-to-end solutions
              for organizations of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Configuration Manager Expertise
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Deep expertise in MECM/SCCM deployment, configuration, troubleshooting, and optimization.
                From greenfield installations to complex environment upgrades and migrations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Azure Cloud Solutions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Strategic cloud migration planning, Azure infrastructure design, and hybrid
                cloud implementations that align with business objectives and security requirements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Modern Device Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Microsoft Intune implementation, co-management strategies, and modern workplace
                solutions that enable secure, productive remote and hybrid work environments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                PowerShell Automation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Custom PowerShell script development, Desired State Configuration (DSC) implementation,
                and automation solutions that reduce manual effort and improve consistency.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Training & Knowledge Transfer
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive training programs, workshops, and knowledge transfer sessions
                to empower your internal teams with the skills they need for ongoing success.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Security & Compliance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Implementation of security best practices, compliance frameworks, and governance
                strategies that protect your organization while enabling business productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Organizations Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine deep technical expertise with practical business understanding
              to deliver solutions that work in the real world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certified Expertise</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team holds multiple Microsoft certifications and maintains cutting-edge
                knowledge of the latest technologies and best practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Track record of successful implementations across diverse industries and
                environments, from small businesses to global enterprises.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Partnership Approach</h3>
              <p className="text-gray-600 leading-relaxed">
                We work as an extension of your team, focusing on knowledge transfer and
                long-term success rather than just project completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your IT Infrastructure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Let's discuss how our expertise can help you achieve your Microsoft technology goals.
            Get in touch for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Contact Us
            </a>
            <a
              href="/blog"
              className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Read Our Blog
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}