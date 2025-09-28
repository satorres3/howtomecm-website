import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How to MeCM',
  description:
    'Learn about our privacy practices, data collection, and how we protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - How to MeCM',
    description:
      'Learn about our privacy practices, data collection, and how we protect your personal information.',
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
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container-modern relative z-10">
          <div className="animate-fade-in mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">Privacy Policy</h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
              We are committed to protecting your privacy and ensuring the security of your personal
              information.
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

      {/* Privacy Content */}
      <section className="section-padding">
        <div className="container-modern">
          <div className="mx-auto max-w-4xl">
            {/* Last Updated */}
            <div className="card-modern animate-fade-in mb-12 p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Last Updated</h3>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg animate-slide-up max-w-none">
              {/* Introduction */}
              <div className="card-modern mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Introduction</h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  How to MeCM (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
                  committed to protecting your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website or use
                  our services.
                </p>
                <p className="leading-relaxed text-gray-600">
                  By accessing our website or using our services, you agree to this Privacy Policy.
                  If you do not agree with the terms of this privacy policy, please do not access
                  the site.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="card-modern animate-slide-up stagger-delay-1 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Information We Collect</h2>

                <h3 className="mb-4 text-xl font-semibold text-gray-900">Personal Information</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
                  <li>Fill out contact forms on our website</li>
                  <li>Subscribe to our newsletter or blog updates</li>
                  <li>Request information about our services</li>
                  <li>Participate in surveys or feedback forms</li>
                  <li>Contact us directly via email or phone</li>
                </ul>

                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Automatically Collected Information
                </h3>
                <p className="leading-relaxed text-gray-600">
                  When you visit our website, we automatically collect certain information about
                  your device, including:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website or source</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="card-modern animate-slide-up stagger-delay-2 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  How We Use Your Information
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Sending you information about our services and updates</li>
                  <li>Improving our website and user experience</li>
                  <li>Analyzing website traffic and usage patterns</li>
                  <li>Complying with legal obligations</li>
                  <li>Protecting against fraud and security threats</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="card-modern animate-slide-up stagger-delay-3 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Information Sharing and Disclosure
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties except in the following circumstances:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>With your explicit consent</li>
                  <li>
                    To service providers who assist us in operating our website or conducting our
                    business
                  </li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer, merger, or acquisition</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="card-modern animate-slide-up stagger-delay-4 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Data Security</h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction. These
                  measures include:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
              </div>

              {/* Cookies and Tracking */}
              <div className="card-modern animate-slide-up stagger-delay-5 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Cookies and Tracking Technologies
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  We use cookies and similar tracking technologies to enhance your browsing
                  experience. Cookies are small files stored on your device that help us:
                </p>
                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-600">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Improve our website functionality</li>
                </ul>
                <p className="leading-relaxed text-gray-600">
                  You can control cookie settings through your browser preferences. However,
                  disabling cookies may affect some website functionality.
                </p>
              </div>

              {/* Your Rights */}
              <div className="card-modern animate-slide-up stagger-delay-6 mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  Depending on your location, you may have certain rights regarding your personal
                  information:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600">
                  <li>Access: Request a copy of the personal information we hold about you</li>
                  <li>Correction: Request correction of inaccurate or incomplete information</li>
                  <li>Deletion: Request deletion of your personal information</li>
                  <li>Portability: Request transfer of your data to another service provider</li>
                  <li>Opt-out: Unsubscribe from marketing communications</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="card-modern animate-slide-up stagger-delay-7 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Contact Us</h2>
                <p className="mb-6 leading-relaxed text-gray-600">
                  If you have any questions about this Privacy Policy or wish to exercise your
                  privacy rights, please contact us:
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a
                        href="mailto:privacy@howtomecm.com"
                        className="text-blue-600 transition-colors hover:text-blue-800"
                      >
                        privacy@howtomecm.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact Page</h3>
                      <a
                        href="/contact"
                        className="text-blue-600 transition-colors hover:text-blue-800"
                      >
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
