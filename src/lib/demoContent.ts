import type { Category, Post, Tag, UserProfile } from '../../types/content'

export interface DemoCategory extends Category {
  icon: string
  accent: {
    from: string
    to: string
  }
}

export interface DemoAuthor extends UserProfile {
  role?: string
  bio?: string
}

const now = new Date()

export const demoAuthors: Record<string, DemoAuthor> = {
  'saulo-alves': {
    id: 'saulo-alves',
    full_name: 'Saulo Alves Torres',
    avatar_url: '/images/authors/saulo-alves.svg',
    email: 'saulo@howtomecm.com',
    role: 'Principal Endpoint Engineer',
    bio: 'Designs and ships Microsoft endpoint solutions across global enterprises.'
  },
  'natalie-woods': {
    id: 'natalie-woods',
    full_name: 'Natalie Woods',
    avatar_url: '/images/authors/natalie-woods.svg',
    email: 'natalie@howtomecm.com',
    role: 'Automation Architect',
    bio: 'PowerShell enthusiast focused on packaging pipelines and compliance automation.'
  }
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'demo-category-intune',
    name: 'Intune',
    slug: 'intune',
    description: 'Real-world policy design, reporting, and zero trust alignment.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 1, 5).toISOString(),
    icon: '📱',
    accent: {
      from: '#0EA5E9',
      to: '#38BDF8'
    }
  },
  {
    id: 'demo-category-mecm',
    name: 'MECM',
    slug: 'mecm',
    description: 'Baseline configuration, servicing rings, and distribution point strategies.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 12).toISOString(),
    icon: '🚀',
    accent: {
      from: '#2563EB',
      to: '#7C3AED'
    }
  }
]

const demoTags: Tag[] = [
  {
    id: 'demo-tag-intune',
    name: 'Intune',
    slug: 'intune',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString()
  },
  {
    id: 'demo-tag-security',
    name: 'Security',
    slug: 'security',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString()
  },
  {
    id: 'demo-tag-microsoft-graph',
    name: 'Microsoft Graph',
    slug: 'microsoft-graph',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString()
  }
]

export const demoPosts: Post[] = [
  {
    id: 'demo-post-intune-2509',
    title: "What's New in Intune Service Release 2509: Device Security and Management Enhancements",
    slug: 'whats-new-in-intune-service-release-2509-highlights',
    excerpt: "Microsoft Intune's September 2025 service release introduces device security enhancements, expanded configuration options, and platform support updates for better enterprise management.",
    content: `<h2>Device Security Enhancements</h2>
<p>Microsoft Intune's September 2025 service release brings significant enhancements across device security, configuration management, and platform support. This update focuses on expanding control capabilities while improving the admin experience with better integration points and streamlined workflows.</p>

<h3>Vulnerability Remediation Agent Updates</h3>
<p>The Security Copilot Vulnerability Remediation Agent receives significant updates to role-based access control and identity management capabilities, providing organizations with more granular control over security operations.</p>

<h2>Device Configuration Advances</h2>
<p>New management capabilities for Android Enterprise devices include Private Space management and USB access controls, while the Settings Catalog receives expanded configuration options for iOS/iPadOS and macOS devices.</p>

<h2>Implementation Checklist</h2>
<ul>
<li>Review current Vulnerability Remediation Agent configuration and RBAC model</li>
<li>Test identity management changes in a pilot environment</li>
<li>Audit Apple device policies for new Settings Catalog options</li>
<li>Review Android Enterprise configurations for Private Space and USB controls</li>
</ul>`,
    featured_image: '/images/posts/whats-new-in-intune-service-release-2509-highlights-cover.jpeg',
    status: 'published',
    date: new Date(now.getFullYear(), 8, 26).toISOString(),
    created_at: new Date(now.getFullYear(), 8, 26).toISOString(),
    updated_at: new Date(now.getFullYear(), 8, 26).toISOString(),
    website_domain: 'staging.howtomecm.com',
    is_published_to_domain: true,
    author: demoAuthors['saulo-alves'],
    category: demoCategories[0],
    tags: [demoTags[0], demoTags[1], demoTags[2]],
    reading_time: 8,
    view_count: 156
  },
  {
    id: 'demo-post-edge-config',
    title: 'How to configure Microsoft Edge start & home page via Intune',
    slug: 'how-to-configure-microsoft-edge-start-home-page-intune',
    excerpt: 'Step-by-step workflow for locking the Microsoft Edge start and home pages with Intune while keeping operations informed.',
    content: `<h2>Overview</h2>
<p>Configuring Microsoft Edge browser settings through Intune allows IT administrators to standardize the browsing experience across an organization while maintaining security and compliance requirements.</p>

<h2>Configuration Steps</h2>
<p>This guide walks through the process of creating and deploying Edge browser policies using the Intune admin center, including setting start pages, home page URLs, and related browser behaviors.</p>

<h3>Prerequisites</h3>
<ul>
<li>Intune administrator access</li>
<li>Target device groups configured</li>
<li>Microsoft Edge browser deployed to target devices</li>
</ul>

<h2>Implementation</h2>
<p>Navigate to the Intune admin center and create a new device configuration profile using the Settings Catalog template for Microsoft Edge policies.</p>`,
    featured_image: '/images/posts/how-to-configure-microsoft-edge-start-home-page-intune-cover.png',
    status: 'published',
    date: new Date(now.getFullYear(), 0, 12).toISOString(),
    created_at: new Date(now.getFullYear(), 0, 12).toISOString(),
    updated_at: new Date(now.getFullYear(), 0, 12).toISOString(),
    website_domain: 'staging.howtomecm.com',
    is_published_to_domain: true,
    author: demoAuthors['saulo-alves'],
    category: demoCategories[0],
    tags: [demoTags[0]],
    reading_time: 9,
    view_count: 243
  },
  {
    id: 'demo-post-security-copilot',
    title: 'Security Copilot Vulnerability Remediation Agent Gets RBAC Updates and Identity Controls',
    slug: 'security-copilot-vulnerability-remediation-agent-rbac-updates-identity-controls',
    excerpt: 'Microsoft enhances the Security Copilot Vulnerability Remediation Agent with improved RBAC controls and manual identity management for better organizational control.',
    content: `<h2>Enhanced RBAC Controls</h2>
<p>Microsoft Security Copilot's Vulnerability Remediation Agent now includes enhanced role-based access control (RBAC) capabilities that provide organizations with more granular control over security operations and permissions.</p>

<h2>Manual Identity Management</h2>
<p>The latest update introduces manual identity management features, allowing administrators to have better control over the accounts and permissions used by the Vulnerability Remediation Agent during security operations.</p>

<h2>Key Benefits</h2>
<ul>
<li>Improved security posture through granular RBAC controls</li>
<li>Better compliance alignment with organizational security policies</li>
<li>Enhanced audit capabilities for security operations</li>
</ul>`,
    featured_image: '/images/posts/security-copilot-vulnerability-cover.jpg',
    status: 'published',
    date: new Date(now.getFullYear(), 8, 22).toISOString(),
    created_at: new Date(now.getFullYear(), 8, 22).toISOString(),
    updated_at: new Date(now.getFullYear(), 8, 22).toISOString(),
    website_domain: 'staging.howtomecm.com',
    is_published_to_domain: true,
    author: demoAuthors['natalie-woods'],
    category: demoCategories[0],
    tags: [demoTags[1], demoTags[2]],
    reading_time: 7,
    view_count: 89
  }
]

export const getDemoContent = () => ({
  posts: demoPosts,
  categories: demoCategories,
  authors: demoAuthors,
  tags: demoTags
})

// Helper functions for backward compatibility
export const getDemoPosts = () => demoPosts
export const getDemoCategories = () => demoCategories
export const getDemoAuthors = () => demoAuthors
export const getDemoTags = () => demoTags

export const findDemoPost = (slug: string) => {
  return demoPosts.find(post => post.slug === slug) || null
}

export default getDemoContent