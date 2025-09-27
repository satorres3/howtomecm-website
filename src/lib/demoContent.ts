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
    bio: 'Designs and ships Microsoft endpoint solutions across global enterprises.',
  },
  'natalie-woods': {
    id: 'natalie-woods',
    full_name: 'Natalie Woods',
    avatar_url: '/images/authors/natalie-woods.svg',
    email: 'natalie@howtomecm.com',
    role: 'Automation Architect',
    bio: 'PowerShell enthusiast focused on packaging pipelines and compliance automation.',
  },
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
      to: '#38BDF8',
    },
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
      to: '#7C3AED',
    },
  },
]

const demoTags: Tag[] = [
  {
    id: 'demo-tag-intune',
    name: 'Intune',
    slug: 'intune',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString(),
  },
  {
    id: 'demo-tag-security',
    name: 'Security',
    slug: 'security',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString(),
  },
  {
    id: 'demo-tag-microsoft-graph',
    name: 'Microsoft Graph',
    slug: 'microsoft-graph',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 1).toISOString(),
  },
]

export const demoPosts: Post[] = [
  {
    id: 'demo-post-intune-2509',
    title: "What's New in Intune Service Release 2509: Device Security and Management Enhancements",
    slug: 'whats-new-in-intune-service-release-2509-highlights',
    excerpt:
      "Microsoft Intune's September 2025 service release introduces device security enhancements, expanded configuration options, and platform support updates for better enterprise management.",
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
    view_count: 156,
  },
  {
    id: 'demo-post-edge-config',
    title: 'How to configure Microsoft Edge start & home page via Intune',
    slug: 'how-to-configure-microsoft-edge-start-home-page-intune',
    excerpt:
      'Step-by-step workflow for locking the Microsoft Edge start and home pages with Intune while keeping operations informed.',
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
    featured_image:
      '/images/posts/how-to-configure-microsoft-edge-start-home-page-intune-cover.png',
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
    view_count: 243,
  },
  {
    id: 'demo-post-security-copilot',
    title:
      'Security Copilot Vulnerability Remediation Agent Gets RBAC Updates and Identity Controls',
    slug: 'security-copilot-vulnerability-remediation-agent-rbac-updates-identity-controls',
    excerpt:
      'Microsoft enhances the Security Copilot Vulnerability Remediation Agent with improved RBAC controls and manual identity management for better organizational control.',
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
    view_count: 89,
  },
  {
    id: 'demo-post-office365-macos',
    title: 'How to Deploy Microsoft 365 Apps to macOS and Windows Devices with Microsoft Intune',
    slug: 'how-to-deploy-microsoft-365-apps-to-macos-and-windows-devices-with-intune',
    excerpt:
      'Complete step-by-step guide to deploy Microsoft 365 apps (Word, Excel, PowerPoint, Outlook, OneNote, Teams, and OneDrive) to both macOS and Windows devices using Microsoft Intune.',
    content: `<h2>Overview</h2>
<p>Deploying Microsoft 365 apps through Microsoft Intune streamlines software management and ensures your organization has consistent, secure access to essential productivity tools across both macOS and Windows devices. This comprehensive guide walks you through the entire process of setting up Microsoft 365 apps using Intune's built-in app suite functionality for both platforms.</p>

<p>By using this app type, you can install Word, Excel, PowerPoint, Outlook, OneNote, Teams, and OneDrive as a single deployment. The apps come with Microsoft AutoUpdate (MAU) for macOS or Click-to-Run updates for Windows to help keep them secure and up to date, and they appear as one app in the list of apps in the Intune admin center.</p>

<p>This guide covers deployment to both platforms with detailed configuration options, monitoring capabilities, and best practices for enterprise rollouts.</p>

<div class="callout-box callout-box--important">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </div>
    <span>Important macOS Version Requirements</span>
  </div>
  <div class="callout-box__content">
    <p>With Office for Mac update (16.67), macOS Big Sur 11 or later is required to receive updates to Office for Mac. If you continue with an older version of macOS, your Microsoft 365 apps will still work, but you'll no longer receive any updates, including security updates. The October 2022 Office for Mac update (16.66) was the last build to support macOS Catalina 10.15.</p>
  </div>
</div>

<h2>Prerequisites</h2>
<p>Before you begin deploying Microsoft 365 apps to your devices, ensure you have the following requirements in place:</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Licensing Requirements</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Microsoft Intune Subscription:</strong> Active Intune licensing for device management</li>
    <li><strong>Microsoft 365 Licenses:</strong> Appropriate licenses that include Microsoft 365 Apps for enterprise:
      <ul>
      <li>Microsoft 365 E3 or E5</li>
      <li>Microsoft 365 Business Premium</li>
      <li>Office 365 E3 or E5</li>
      <li>Microsoft 365 Apps for enterprise (standalone)</li>
      </ul>
    </li>
    </ul>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">2</div>
    <h3 class="topic-section__title">Administrative Requirements</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Intune Administrator Role:</strong> Or Application Manager role in Azure AD</li>
    <li><strong>Azure AD Groups:</strong> Pre-configured user or device groups for targeting deployment</li>
    <li><strong>Global Administrator:</strong> May be required for initial setup and consent</li>
    </ul>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">3</div>
    <h3 class="topic-section__title">Device Requirements</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>macOS Devices:</strong> Running macOS 10.14 or later, enrolled in Intune</li>
    <li><strong>Windows Devices:</strong> Windows 10/11 devices enrolled in Intune</li>
    <li><strong>Network Connectivity:</strong> Internet access for app downloads and license activation</li>
    <li><strong>Storage Space:</strong> Sufficient disk space for Microsoft 365 apps installation</li>
    </ul>
  </div>
</div>

<div class="callout-box callout-box--warning">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </div>
    <span>Important Data Protection Notice</span>
  </div>
  <div class="callout-box__content">
    <p>If any Microsoft 365 apps are open when Intune installs the app suite, users might lose data from unsaved files. Always communicate deployment schedules to end users and recommend saving work before installation windows.</p>
  </div>
</div>

<div class="callout-box callout-box--info">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    </div>
    <span>Note</span>
  </div>
  <div class="callout-box__content">
    <p>Microsoft Office 365 ProPlus has been renamed to <strong>Microsoft 365 Apps for enterprise</strong>. In documentation, it's commonly referred to as <strong>Microsoft 365 Apps</strong>.</p>
  </div>
</div>

<h2>Step 1: Select Microsoft 365 Apps</h2>
<p>Begin the deployment process by accessing the Intune admin center and navigating to the app creation wizard.</p>

<ol class="step-list">
<li>Sign in to the <a href="https://go.microsoft.com/fwlink/?linkid=2109431" target="_blank">Microsoft Intune admin center</a></li>
<li>Select <strong>Apps</strong> > <strong>All Apps</strong> > <strong>Create</strong></li>
<li>Select <strong>macOS</strong> in the <strong>Microsoft 365 Apps</strong> section of the <strong>Select app type</strong> pane</li>
<li>Click <strong>Select</strong>. The <strong>Add Microsoft 365 Apps</strong> steps are displayed</li>
</ol>

<h2>Step 2: App Suite Information</h2>
<p>In this step, you provide information about the app suite. This information helps you identify the app suite in Intune and helps users find the app suite in the company portal.</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Configure Basic Information</h3>
  </div>
  <div class="topic-section__content">
    <p>In the <strong>App suite information</strong> page, you can confirm or modify the default values:</p>

    <ul>
    <li><strong>Suite Name:</strong> Enter the name of the app suite as it is displayed in the company portal. Make sure that all suite names that you use are unique</li>
    <li><strong>Suite Description:</strong> Enter a description for the app suite. For example, you could list the apps you've selected to include</li>
    <li><strong>Publisher:</strong> Microsoft appears as the publisher</li>
    <li><strong>Category:</strong> Optionally, select one or more of the built-in app categories or a category that you created</li>
    </ul>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">2</div>
    <h3 class="topic-section__title">Advanced Configuration Options</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Show this as a featured app in the Company Portal:</strong> Select this option to display the app suite prominently on the main page</li>
    <li><strong>Information URL:</strong> Optionally, enter the URL of a website that contains information about this app</li>
    <li><strong>Privacy URL:</strong> Optionally, enter the URL of a website that contains privacy information for this app</li>
    <li><strong>Developer:</strong> Microsoft appears as the developer</li>
    <li><strong>Owner:</strong> Microsoft appears as the owner</li>
    <li><strong>Notes:</strong> Enter any notes that you want to associate with this app</li>
    <li><strong>Logo:</strong> The Microsoft 365 Apps logo is displayed with the app when users browse the company portal</li>
    </ul>

    <p>Click <strong>Next</strong> to display the <strong>Scope tags</strong> page.</p>
  </div>
</div>

<h2>Step 3: Select Scope Tags (Optional)</h2>
<p>You can use scope tags to determine who can see client app information in Intune. Scope tags are particularly useful for distributed IT environments where different administrators need access to different sets of resources.</p>

<ol>
<li>Click <strong>Select scope tags</strong> to optionally add scope tags for the app suite</li>
<li>Click <strong>Next</strong> to display the <strong>Assignments</strong> page</li>
</ol>

<h2>Step 4: Assignments</h2>
<p>Configure how the Microsoft 365 apps will be deployed to your macOS devices.</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Choose Assignment Type</h3>
  </div>
  <div class="topic-section__content">
    <p>Select the <strong>Required</strong> or <strong>Available for enrolled devices</strong> group assignments for the app suite:</p>

    <ul>
    <li><strong>Required:</strong> Apps are automatically installed on devices in the assigned groups</li>
    <li><strong>Available for enrolled devices:</strong> Apps appear in the Company Portal for users to install on demand</li>
    </ul>
  </div>
</div>

<div class="callout-box callout-box--warning">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    </div>
    <span>Important Limitation</span>
  </div>
  <div class="callout-box__content">
    <p>You cannot uninstall the 'Microsoft 365 apps for macOS' app suite through Intune. Once deployed, the apps remain on the device until manually removed.</p>
  </div>
</div>

<p>Click <strong>Next</strong> to display the <strong>Review + create</strong> page.</p>

<h2>Step 5: Review + Create</h2>
<p>Complete the deployment process by reviewing your configuration and creating the app assignment.</p>

<ol>
<li>Review the values and settings you entered for the app suite</li>
<li>When you are done, click <strong>Create</strong> to add the app to Intune</li>
<li>The <strong>Overview</strong> blade is displayed. The suite appears in the list of apps as a single entry</li>
</ol>

<div class="summary-box">
  <h4>macOS Deployment Complete</h4>
  <p>Your Microsoft 365 apps are now configured for deployment to macOS devices. The apps will be delivered according to your assignment settings, and devices will receive automatic updates through Microsoft AutoUpdate.</p>
</div>

<h2>Windows Deployment Process</h2>
<p>For Windows devices, the process includes additional configuration options and settings that provide more granular control over the deployment.</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Navigate to Windows Apps</h3>
  </div>
  <div class="topic-section__content">
    <ol>
    <li>In the Intune admin center, go to <strong>Apps</strong> > <strong>Windows</strong></li>
    <li>Click <strong>+ Add</strong> button</li>
    <li>Under "Microsoft 365 Apps", select <strong>Windows 10 and later</strong></li>
    <li>Click <strong>Select</strong></li>
    </ol>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">2</div>
    <h3 class="topic-section__title">Configure App Suite Settings</h3>
  </div>
  <div class="topic-section__content">
    <p>Windows deployments offer advanced configuration options:</p>

    <ul>
    <li><strong>Configuration settings format:</strong> Choose "Configuration designer" for guided setup or "XML" for advanced configurations</li>
    <li><strong>Select Office apps:</strong> Choose specific apps (Excel, Outlook, PowerPoint, Word, etc.) - deploy only what users need</li>
    <li><strong>Architecture:</strong> Select "64-bit" (recommended) or "32-bit" based on your environment</li>
    <li><strong>Update channel:</strong> Choose from:
      <ul>
      <li><strong>Current Channel:</strong> Latest features immediately (monthly updates)</li>
      <li><strong>Monthly Enterprise Channel:</strong> Latest features with more predictability</li>
      <li><strong>Semi-Annual Enterprise Channel:</strong> Most stable, updated twice yearly</li>
      </ul>
    </li>
    <li><strong>Remove other versions:</strong> Select "Yes" to automatically remove older MSI versions</li>
    <li><strong>Version to install:</strong> Typically "Latest" unless specific version required</li>
    <li><strong>Shared computer activation:</strong> Enable for kiosk or lab environments (requires special licensing)</li>
    <li><strong>Accept EULA automatically:</strong> Select "Yes" for seamless deployment</li>
    <li><strong>Languages:</strong> Additional languages installed based on Windows locale settings</li>
    </ul>
  </div>
</div>

<div class="callout-box callout-box--info">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    </div>
    <span>Update Channel Recommendation</span>
  </div>
  <div class="callout-box__content">
    <p>For most enterprise environments, <strong>Monthly Enterprise Channel</strong> provides the best balance of new features and stability. Current Channel is ideal for early adopters, while Semi-Annual Enterprise Channel suits risk-averse organizations.</p>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">3</div>
    <h3 class="topic-section__title">Advanced Assignment Options</h3>
  </div>
  <div class="topic-section__content">
    <p>Windows deployments offer enhanced assignment controls:</p>

    <ul>
    <li><strong>Required Deployments:</strong> Apps install automatically with configurable installation deadlines</li>
    <li><strong>Available Deployments:</strong> Users can install from Company Portal on-demand</li>
    <li><strong>End User Notifications:</strong> Configure before/during installation alerts</li>
    <li><strong>Installation Deadline:</strong> Set specific date/time for required installations</li>
    <li><strong>Grace Period:</strong> Allow users to delay installation for specified time</li>
    </ul>
  </div>
</div>

<h2>Monitoring and Troubleshooting</h2>
<p>After deployment, comprehensive monitoring helps ensure successful rollout and quick issue resolution.</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Monitoring Deployment Status</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Installation Overview:</strong> Navigate to <strong>Apps</strong> > <strong>Windows</strong> or <strong>macOS</strong> and click on your Microsoft 365 Apps suite</li>
    <li><strong>Device Install Status:</strong> Review installation progress across all targeted devices</li>
    <li><strong>User Install Status:</strong> Monitor installation status per user assignment</li>
    <li><strong>Installation Timeline:</strong> Track installation completion rates over time</li>
    <li><strong>Error Reports:</strong> Identify devices with failed installations for troubleshooting</li>
    </ul>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">2</div>
    <h3 class="topic-section__title">Common Issues and Resolutions</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Installation Failures:</strong>
      <ul>
      <li>Verify device compliance with system requirements</li>
      <li>Check network connectivity and firewall settings</li>
      <li>Ensure sufficient disk space for installation</li>
      <li>Validate user/device group assignments</li>
      </ul>
    </li>
    <li><strong>License Activation Issues:</strong>
      <ul>
      <li>Confirm users have appropriate Microsoft 365 licenses assigned</li>
      <li>Check Azure AD synchronization status</li>
      <li>Verify license activation limits haven't been exceeded</li>
      </ul>
    </li>
    <li><strong>Update Problems:</strong>
      <ul>
      <li>Review update channel configuration</li>
      <li>Check Microsoft AutoUpdate (macOS) or Click-to-Run (Windows) status</li>
      <li>Verify network access to Microsoft update servers</li>
      </ul>
    </li>
    </ul>
  </div>
</div>

<div class="callout-box callout-box--tip">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/></svg>
    </div>
    <span>Pro Tip</span>
  </div>
  <div class="callout-box__content">
    <p>Use the <strong>Troubleshoot + Support</strong> section in Intune to access device-specific logs and diagnostic information for faster issue resolution.</p>
  </div>
</div>

<h2>Best Practices and Recommendations</h2>
<p>Follow these enterprise-tested practices to ensure a successful Microsoft 365 deployment.</p>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">1</div>
    <h3 class="topic-section__title">Pilot Testing Strategy</h3>
  </div>
  <div class="topic-section__content">
    <ul>
    <li><strong>Start Small:</strong> Begin with a pilot group of 5-10 devices from different departments</li>
    <li><strong>Test Scenarios:</strong> Validate installation, licensing, updates, and uninstallation processes</li>
    <li><strong>Document Issues:</strong> Track any problems encountered and resolution steps</li>
    <li><strong>User Feedback:</strong> Collect feedback on performance and functionality</li>
    <li><strong>Expand Gradually:</strong> Roll out to broader groups based on pilot success</li>
    </ul>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">2</div>
    <h3 class="topic-section__title">Phased Rollout Approach</h3>
  </div>
  <div class="topic-section__content">
    <ol>
    <li><strong>Phase 1:</strong> IT Department and early adopters (Week 1)</li>
    <li><strong>Phase 2:</strong> Department leaders and power users (Week 2-3)</li>
    <li><strong>Phase 3:</strong> Department by department rollout (Week 4-8)</li>
    <li><strong>Phase 4:</strong> Remaining users and devices (Week 9-12)</li>
    </ol>
    <p>Allow 1-2 weeks between phases to address any issues and gather feedback.</p>
  </div>
</div>

<div class="topic-section">
  <div class="topic-section__header">
    <div class="topic-section__number">3</div>
    <h3 class="topic-section__title">Communication Template</h3>
  </div>
  <div class="topic-section__content">
    <p>Keep users informed with clear communication:</p>
    <ul>
    <li><strong>Pre-deployment:</strong> Announce timeline, benefits, and required actions</li>
    <li><strong>During deployment:</strong> Provide installation status updates and support contacts</li>
    <li><strong>Post-deployment:</strong> Share training resources and feedback channels</li>
    <li><strong>Key Messages:</strong> Emphasize improved security, new features, and ongoing support</li>
    </ul>
  </div>
</div>

<div class="callout-box callout-box--important">
  <div class="callout-box__header">
    <div class="callout-box__icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    </div>
    <span>Deployment Success Criteria</span>
  </div>
  <div class="callout-box__content">
    <p>Consider your deployment successful when you achieve: 95%+ installation success rate, minimal user-reported issues, successful license activation across all devices, and positive user feedback on performance and functionality.</p>
  </div>
</div>

<h2>Advanced Configuration Options</h2>
<p>Enhance your Microsoft 365 deployment with these additional security and compliance features:</p>

<ul>
<li><strong>App Protection Policies:</strong> Configure data loss prevention and mobile application management</li>
<li><strong>Conditional Access:</strong> Implement location, device, and risk-based access controls</li>
<li><strong>Compliance Policies:</strong> Ensure devices meet security requirements before app access</li>
<li><strong>Update Rings:</strong> Create staged update deployment groups for controlled feature rollouts</li>
<li><strong>App Configuration Policies:</strong> Pre-configure Office apps with organizational settings</li>
</ul>

<h2>Related Resources</h2>
<p>Expand your Microsoft 365 and Intune knowledge with these resources:</p>

<ul>
<li><a href="https://learn.microsoft.com/en-us/intune/apps/" target="_blank">Microsoft Intune App Management Documentation</a></li>
<li><a href="https://learn.microsoft.com/en-us/deployoffice/" target="_blank">Microsoft 365 Apps Deployment Guide</a></li>
<li><a href="https://learn.microsoft.com/en-us/intune/protect/conditional-access" target="_blank">Conditional Access with Intune</a></li>
<li><a href="https://techcommunity.microsoft.com/t5/microsoft-intune/bd-p/Microsoft-Intune" target="_blank">Microsoft Intune Tech Community</a></li>
</ul>

<div class="summary-box">
  <h4>Deployment Complete</h4>
  <p>Your Microsoft 365 apps are now configured for deployment across both macOS and Windows devices. The apps will be delivered according to your assignment settings, with automatic updates ensuring ongoing security and feature access. Remember to monitor deployment progress and address any issues promptly for the best user experience.</p>
</div>`,
    featured_image:
      '/images/posts/how-to-deploy-microsoft-365-apps-to-macos-devices-with-intune-cover.png',
    status: 'published',
    date: new Date(now.getFullYear(), 8, 27).toISOString(),
    created_at: new Date(now.getFullYear(), 8, 27).toISOString(),
    updated_at: new Date(now.getFullYear(), 8, 27).toISOString(),
    website_domain: 'staging.howtomecm.com',
    is_published_to_domain: true,
    author: demoAuthors['saulo-alves'],
    category: demoCategories[0],
    tags: [demoTags[0]],
    reading_time: 18,
  },
]

export const getDemoContent = () => ({
  posts: demoPosts,
  categories: demoCategories,
  authors: demoAuthors,
  tags: demoTags,
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
