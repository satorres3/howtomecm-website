import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How to MeCM',
  description: 'Learn about our privacy practices, data collection, and how we protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - How to MeCM',
    description: 'Learn about our privacy practices, data collection, and how we protect your personal information.',
    type: 'website',
    url: 'https://howtomecm.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white section-padding">

        <div className="container-modern relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="card-modern p-6 mb-12 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Last Updated</h3>
                  <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none animate-slide-up">
              {/* Introduction */}
              <div className="card-modern p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  How to MeCM (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By accessing our website or using our services, you agree to this Privacy Policy. If you do not agree with the terms
                  of this privacy policy, please do not access the site.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Fill out contact forms on our website</li>
                  <li>Subscribe to our newsletter or blog updates</li>
                  <li>Request information about our services</li>
                  <li>Participate in surveys or feedback forms</li>
                  <li>Contact us directly via email or phone</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Automatically Collected Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website or source</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Sending you information about our services and updates</li>
                  <li>Improving our website and user experience</li>
                  <li>Analyzing website traffic and usage patterns</li>
                  <li>Complying with legal obligations</li>
                  <li>Protecting against fraud and security threats</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-3">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing and Disclosure</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To service providers who assist us in operating our website or conducting our business</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer, merger, or acquisition</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access,
                  alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
              </div>

              {/* Cookies and Tracking */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files
                  stored on your device that help us:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Improve our website functionality</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling cookies may affect
                  some website functionality.
                </p>
              </div>

              {/* Your Rights */}
              <div className="card-modern p-8 mb-8 animate-slide-up stagger-delay-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access: Request a copy of the personal information we hold about you</li>
                  <li>Correction: Request correction of inaccurate or incomplete information</li>
                  <li>Deletion: Request deletion of your personal information</li>
                  <li>Portability: Request transfer of your data to another service provider</li>
                  <li>Opt-out: Unsubscribe from marketing communications</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="card-modern p-8 bg-gradient-to-br from-blue-50 to-purple-50 animate-slide-up stagger-delay-7">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a href="mailto:privacy@howtomecm.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        privacy@howtomecm.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact Page</h3>
                      <a href="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">
                        Visit our contact page
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}