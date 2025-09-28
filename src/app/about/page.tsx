import { Metadata } from 'next'
import Image from 'next/image'

import { getAboutPageContent } from '../../lib/content'
import type { AboutPageContent } from '@/types/site-content'

export const metadata: Metadata = {
  title: 'About - Saulo Alves Torres | Microsoft Technology Expert',
  description: 'Learn about Saulo Alves Torres, a Microsoft technology expert with 15+ years of experience in MECM, Azure, and enterprise solutions.',
  keywords: 'Saulo Alves Torres, Microsoft expert, MECM consultant, Azure specialist, IT professional',
  openGraph: {
    title: 'About Saulo Alves Torres - Microsoft Technology Expert',
    description: 'Microsoft technology expert with 15+ years of experience in MECM, Azure, and enterprise solutions.',
    type: 'profile',
    url: 'https://howtomecm.com/about',
  },
}

export default async function AboutPage() {
  const aboutContentResult = await getAboutPageContent()
  const aboutContent: AboutPageContent | null = aboutContentResult.success ? aboutContentResult.data : null
  const hero = aboutContent?.hero
  const story = aboutContent?.story
  const defaultExpertise = [
    {
      icon: '🚀',
      title: 'Microsoft MECM/SCCM',
      description:
        'Advanced configuration, deployment strategies, and troubleshooting techniques for enterprise environments.'
    },
    {
      icon: '☁️',
      title: 'Azure Cloud Solutions',
      description: 'Cloud migration strategies, hybrid configurations, and modern device management with Intune.'
    },
    {
      icon: '🔧',
      title: 'Enterprise IT Solutions',
      description:
        'Comprehensive IT infrastructure design, automation, and best practices for large-scale deployments.'
    }
  ]
  const expertise = aboutContent?.expertise && aboutContent.expertise.length > 0
    ? aboutContent.expertise
    : defaultExpertise
  const connect = aboutContent?.connect

  const heroLogo = hero?.logo || 'https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif'
  const heroName = hero?.name || 'Saulo Alves Torres'
  const heroTitle = hero?.title || 'Microsoft Technology Expert & IT Consultant'
  const heroLocation = hero?.location || 'Global Remote'
  const heroExperience = hero?.experience || '15+ Years Experience'

  const storyParagraphs = story?.paragraphs && story.paragraphs.length > 0
    ? story.paragraphs
    : [
        "Hi! I'm Saulo, a passionate Microsoft technology enthusiast with over 15 years of hands-on experience in enterprise environments. My journey began with a curiosity about how technology could solve real-world business challenges.",
        "Throughout my career, I've specialized in Microsoft Configuration Manager (MECM), Azure cloud technologies, and enterprise device management solutions. I've helped organizations of all sizes modernize their IT infrastructure and embrace cloud-first strategies.",
        "What drives me is the opportunity to share knowledge and help fellow IT professionals navigate the ever-evolving Microsoft ecosystem. Through this blog and my YouTube channel, I aim to provide practical, real-world solutions that you can implement immediately."
      ]

  const origin = story?.origin
  const originLogo = origin?.logo || heroLogo
  const originTitle = origin?.title || 'How to MeCM'
  const originBody = origin?.body ||
    'Born from the need to demystify Microsoft Configuration Manager and share practical solutions with the IT community.'
  const originStats = origin?.stats && origin.stats.length > 0
    ? origin.stats
    : [
        { label: 'Professionals Helped', value: '10K+' },
        { label: 'Tutorials Created', value: '50+' }
      ]

  const connectLinks = connect?.links || []
  const connectFooter = connect?.footer || '💡 “Technology is best when it brings people together” - Let\'s build something amazing!'

  const renderConnectIcon = (linkId: string) => {
    switch (linkId) {
      case 'linkedin':
        return (
          <svg className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'youtube':
        return (
          <svg className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      default:
        return (
          <svg className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.414-1.414m1.172-3.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.414 1.414" />
          </svg>
        )
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Section with Animated Effects */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-300">
                  <Image
                    src={heroLogo}
                    alt={`${heroName} avatar`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain rounded-full"
                    priority
                  />
                </div>
                {/* Floating accent elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
                {heroName}
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {heroTitle}
              </p>
              <div className="flex items-center justify-center space-x-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center text-blue-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {heroLocation}
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {heroExperience}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section with Enhanced Design */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {story?.heading || 'My Journey in Technology'}
                </h2>
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="relative animate-slide-right">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <Image
                      src={originLogo}
                      alt={`${originTitle} logo`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain mx-auto mb-6 bg-white rounded-xl p-2"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{originTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {originBody}
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      {originStats.map(stat => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Expertise Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Areas of Expertise
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Specializing in Microsoft technologies with deep expertise across enterprise solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {expertise.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Connect Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {connect?.heading || "Let's Connect"}
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              {connect?.body ||
                "I'm always excited to connect with fellow IT professionals, share experiences, and collaborate on innovative solutions. Whether you have questions about Microsoft technologies or want to discuss industry trends, I'd love to hear from you."}
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {connectLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: link.background || '#2563EB' }}
                >
                  {renderConnectIcon(link.id)}
                  <h3 className="text-xl font-bold mb-2">{link.label}</h3>
                  <p className="text-blue-200 text-sm">{link.description}</p>
                </a>
              ))}
            </div>

            <div className="mt-12 text-blue-200 text-sm">
              <p>{connectFooter}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
