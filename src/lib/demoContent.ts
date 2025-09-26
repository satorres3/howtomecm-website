import type { Category, Post, Tag, UserProfile } from '../types/content'

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
  },
  'amir-rahman': {
    id: 'amir-rahman',
    full_name: 'Amir Rahman',
    avatar_url: '/images/authors/amir-rahman.svg',
    email: 'amir@howtomecm.com',
    role: 'Modern Work Strategist',
    bio: 'Helps enterprises map Windows Autopilot and hybrid join transitions.'
  }
}

export const demoCategories: DemoCategory[] = [
  {
    id: 'demo-category-mecm',
    name: 'MECM deployment',
    slug: 'mecm-deployment',
    description: 'Baseline configuration, servicing rings, and distribution point strategies.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 12).toISOString(),
    icon: '🚀',
    accent: {
      from: '#2563EB',
      to: '#7C3AED'
    }
  },
  {
    id: 'demo-category-intune',
    name: 'Intune operations',
    slug: 'intune-operations',
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
    id: 'demo-category-autopilot',
    name: 'Windows Autopilot',
    slug: 'windows-autopilot',
    description: 'Deployment profiles, ESP tuning, and hybrid join guardrails.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 2, 15).toISOString(),
    icon: '🛫',
    accent: {
      from: '#F97316',
      to: '#FB923C'
    }
  },
  {
    id: 'demo-category-automation',
    name: 'Automation playbooks',
    slug: 'automation-playbooks',
    description: 'Reusable PowerShell and Graph patterns to keep estates predictable.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 3, 2).toISOString(),
    icon: '🤖',
    accent: {
      from: '#10B981',
      to: '#34D399'
    }
  }
]

const demoTags: Tag[] = [
  {
    id: 'tag-powershell',
    name: 'PowerShell',
    slug: 'powershell',
    description: 'PowerShell automation tips',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 0, 20).toISOString()
  },
  {
    id: 'tag-graph',
    name: 'Microsoft Graph',
    slug: 'microsoft-graph',
    description: 'Graph API integrations',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 1, 2).toISOString()
  },
  {
    id: 'tag-security',
    name: 'Security',
    slug: 'security',
    description: 'Security baselines and hardening',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 2, 9).toISOString()
  },
  {
    id: 'tag-intune',
    name: 'Intune',
    slug: 'intune',
    description: 'Microsoft Intune device management',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 3, 15).toISOString()
  },
  {
    id: 'tag-edge',
    name: 'Microsoft Edge',
    slug: 'microsoft-edge',
    description: 'Microsoft Edge browser configuration',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(now.getFullYear(), 3, 16).toISOString()
  }
]

const baseDomain = 'staging.howtomecm.com'

const sharedContentFooter = `
  <div class="mt-10 rounded-2xl bg-blue-50/60 dark:bg-blue-500/10 p-6">
    <h3>Try this next</h3>
    <ul>
      <li>📄 Review your pilot device readiness checklist</li>
      <li>🤖 Automate compliance drift detection with scheduled runbooks</li>
      <li>🎯 Share rollout metrics with stakeholders using Power BI</li>
    </ul>
  </div>
`

export const demoPosts: Array<Post & { category_name: string; tags: Tag[] }> = [
  {
    id: 'demo-post-edge-homepage',
    title: 'How to configure Microsoft Edge start & home page via Intune',
    slug: 'how-to-configure-microsoft-edge-start-home-page-intune',
    status: 'published',
    website_domain: baseDomain,
    is_published_to_domain: true,
    created_at: new Date(now.getFullYear(), 0, 12).toISOString(),
    updated_at: new Date(now.getFullYear(), 0, 15).toISOString(),
    author_id: 'saulo-alves',
    author: demoAuthors['saulo-alves'],
    content: `
      <p>Give users the same launch experience on every device by wiring Microsoft Edge start and home pages through Intune. The configuration lives in the Settings Catalog so changes are trackable, reportable, and staged like any other policy.</p>

      <div class="rounded-2xl bg-blue-50/80 p-5 text-sm text-blue-900 shadow-sm dark:bg-blue-500/10 dark:text-blue-100">
        <strong>Outcome-oriented goals</strong>
        <ul>
          <li>🧭 Direct everyone to the corporate start site the moment Edge opens.</li>
          <li>⚡ Reduce help desk tickets caused by stale bookmarks or accidental MSN load.</li>
          <li>📈 Capture telemetry on policy drift so remediation happens automatically.</li>
        </ul>
      </div>

      <h2>Prerequisites checklist</h2>
      <ul>
        <li>Devices are <strong>Intune enrolled</strong> (Hybrid Azure AD join or cloud native).</li>
        <li>Microsoft Edge version <strong>120 or later</strong> is deployed via servicing or WinGet.</li>
        <li>Azure AD security groups representing pilot, broad, and break-glass cohorts.</li>
        <li>Existing homepage HTML hosted on a resilient internal or external endpoint.</li>
      </ul>

      <h2>Step 1: Design the homepage experience</h2>
      <p>Start with what your users should see before discussing individual toggles. Capture the information architecture, navigation priorities, and call-to-action hierarchy.</p>
      <figure>
        <img src="/images/posts/edge-homepage-layout.svg" alt="Illustration of the configured Microsoft Edge start page layout" />
        <figcaption>Sketch the hero module, quick links, and dynamic tiles so stakeholders sign off on the experience.</figcaption>
      </figure>

      <h3>Decide on start behaviour</h3>
      <ul>
        <li><strong>RestoreOnStartup = 4</strong> loads a specific set of URLs every time Edge launches.</li>
        <li><strong>HomepageLocation</strong> sets the site the home button points to and that the user lands on when a new window opens.</li>
        <li><strong>NewTabPageLocation</strong> keeps the Microsoft news feed out of support-critical devices.</li>
      </ul>
      <blockquote>
        Align with Security before suppressing the Microsoft content feed if your organisation relies on native Microsoft 365 news cards.</blockquote>

      <h2>Step 2: Build the Intune configuration profile</h2>
      <ol>
        <li>Navigate to <em>Devices → Windows → Configuration profiles → Create profile</em>.</li>
        <li>Select <strong>Windows 10 and later</strong> with <strong>Settings catalog</strong> to access the latest Edge ADMX controls.</li>
        <li>Add the following settings: <em>Microsoft Edge &gt; Startup, home page and new tab page</em>.</li>
        <li>Populate the URLs, switch <em>Show home button</em> to Enabled, and lock the experience by toggling <em>Prevent users from changing home page</em>.</li>
        <li>Scope tags before saving so operations and security teams can audit changes.</li>
      </ol>

      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/PXk1te_FYJ8" title="Intune policy walk-through for Microsoft Edge" loading="lazy" allowfullscreen></iframe>
      </div>

      <h3>Key toggles for a polished launch</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Setting</th>
            <th scope="col">Recommended value</th>
            <th scope="col">Why it matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RestoreOnStartupURLs</td>
            <td><code>https://portal.contoso.com</code></td>
            <td>Guarantees the service portal is the first touch for every session.</td>
          </tr>
          <tr>
            <td>NewTabPageLocation</td>
            <td><code>https://news.contoso.com</code></td>
            <td>Keeps internal communications surfaced whenever users open new tabs.</td>
          </tr>
          <tr>
            <td>AllowHomeButton</td>
            <td>Enabled + <code>https://portal.contoso.com</code></td>
            <td>Gives muscle memory users a consistent way back to the intranet.</td>
          </tr>
        </tbody>
      </table>

      <pre><code class="language-json">{
  "HomePageLocation": "https://portal.contoso.com",
  "RestoreOnStartup": 4,
  "RestoreOnStartupURLs": [
    "https://portal.contoso.com",
    "https://status.contoso.com"
  ],
  "NewTabPageLocation": "https://news.contoso.com"
}</code></pre>

      <h2>Step 3: Assign and validate the policy</h2>
      <p>Roll through pilot, broad, then break-glass groups so your operations center can watch telemetry in real time.</p>
      <figure>
        <img src="/images/posts/edge-policy-architecture.svg" alt="Diagram showing Microsoft Intune delivering Edge homepage policies" />
        <figcaption>The policy flows from Intune to hybrid joined devices with reporting surfaced in compliance dashboards.</figcaption>
      </figure>

      <div class="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-5 text-sm text-blue-900 dark:border-blue-400/60 dark:bg-blue-500/10 dark:text-blue-100">
        <strong>Pilot timeline</strong>
        <ol>
          <li>Day 0 – Assign to IT and communications champions, capture screenshots.</li>
          <li>Day 2 – Expand to 5% of the production population, monitor policy conflicts.</li>
          <li>Day 5 – Publish broad rollout announcement with a link to opt-out support form.</li>
        </ol>
      </div>

      <h2>Operational cadence</h2>
      <h3>Monthly housekeeping</h3>
      <ul>
        <li>Review content owners for the homepage HTML and confirm backup administrators.</li>
        <li>Export Intune assignment report to validate devices still land in the right security groups.</li>
        <li>Refresh the quick links list so deprecated services drop off quickly.</li>
      </ul>

      <h3>Insights to collect</h3>
      <dl>
        <dt>Policy conflicts</dt>
        <dd>Look for overlapping baseline policies that touch Edge startup behaviour.</dd>
        <dt>Help desk signals</dt>
        <dd>Track tickets tagged with <code>edge-homepage</code> for two weeks after changes.</dd>
        <dt>Adoption metrics</dt>
        <dd>Use Microsoft 365 usage analytics to prove the new homepage drives traffic to strategic tools.</dd>
      </dl>

      <h2>FAQ</h2>
      <dl>
        <dt>Can we let power users customise their new tab page?</dt>
        <dd>Yes. Create a second configuration profile scoped to a dynamic group with the setting <em>OverwriteHomepage = Disabled</em>.</dd>
        <dt>How do we roll back?</dt>
        <dd>Flip the configuration profile to <em>Not configured</em> or assign an empty URL list—the change propagates during the next 8-hour sync window.</dd>
        <dt>What about kiosk or shared devices?</dt>
        <dd>Pair this policy with Edge kiosk mode so the homepage locks alongside session reset timers.</dd>
      </dl>

      ${sharedContentFooter}
    `,
    excerpt: 'Step-by-step workflow for locking the Microsoft Edge start and home pages with Intune while keeping operations informed.',
    featured_image: '/images/posts/edge-homepage-layout.svg',
    date: new Date(now.getFullYear(), 0, 12).toISOString(),
    category_id: demoCategories[1].id,
    category: demoCategories[1],
    category_slug: demoCategories[1].slug,
    category_name: demoCategories[1].name,
    tags: [demoTags[3], demoTags[4]],
    comments_enabled: true,
    view_count: 18420,
    share_count: 642,
    like_count: 518,
    reading_time: 9
  },
  {
    id: 'demo-post-security-copilot-agent',
    title: 'Security Copilot Vulnerability Remediation Agent Gets RBAC Updates and Identity Controls',
    slug: 'security-copilot-vulnerability-remediation-agent-rbac-updates-identity-controls',
    status: 'published',
    website_domain: baseDomain,
    is_published_to_domain: true,
    created_at: new Date(now.getFullYear(), 8, 22).toISOString(),
    updated_at: new Date(now.getFullYear(), 8, 22).toISOString(),
    author_id: 'natalie-woods',
    author: demoAuthors['natalie-woods'],
    content: `
      <p>Microsoft continues enhancing the Vulnerability Remediation Agent for Security Copilot in Intune with significant updates to role-based access control and identity management. These changes, part of the ongoing limited public preview, provide organizations with greater flexibility and control over security operations.</p>

      <div class="rounded-2xl bg-blue-50/80 p-5 text-sm text-blue-900 shadow-sm dark:bg-blue-500/10 dark:text-blue-100">
        <strong>Preview enhancement goals</strong>
        <ul>
          <li>🔐 Simplified RBAC configuration with clear guidance for unified and granular permissions.</li>
          <li>👤 Manual agent identity management for enhanced security and operational control.</li>
          <li>📊 Maintained run history across identity changes for audit and compliance tracking.</li>
        </ul>
      </div>

      <h2>What's new in this update</h2>
      <p>The September 2025 update introduces three key enhancements that address common deployment scenarios and operational requirements organizations face when implementing vulnerability remediation workflows.</p>

      <h3>Enhanced RBAC for Microsoft Defender integration</h3>
      <p>Microsoft has updated the role-based access control guidance to reflect current Microsoft Defender XDR implementations. The new documentation covers both unified RBAC and granular RBAC configurations.</p>

      <table>
        <thead>
          <tr>
            <th scope="col">RBAC Type</th>
            <th scope="col">Description</th>
            <th scope="col">Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Unified RBAC</strong></td>
            <td>Single set of permissions across all Microsoft security services</td>
            <td>Organizations with centralized security teams and consistent access patterns</td>
          </tr>
          <tr>
            <td><strong>Granular RBAC</strong></td>
            <td>Customized permissions per service with specific device group scoping</td>
            <td>Large enterprises with specialized security roles and complex organizational structures</td>
          </tr>
        </tbody>
      </table>

      <div class="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-5 text-sm text-amber-900 dark:border-amber-400/60 dark:bg-amber-500/10 dark:text-amber-100">
        <strong>⚠️ Granular RBAC scoping requirement</strong>
        <p>When using granular RBAC configurations, ensure the agent's identity is scoped in Microsoft Defender to include all relevant device groups. The agent cannot access or report on devices outside its assigned scope, which could create gaps in vulnerability coverage.</p>
      </div>

      <h3>Manual agent identity management</h3>
      <p>Organizations can now manually change the account that the Vulnerability Remediation Agent uses as its identity, providing better control over permissions and audit trails.</p>

      <h4>How to change agent identity</h4>
      <ol>
        <li>Navigate to the Vulnerability Remediation Agent in Security Copilot</li>
        <li>Select the agent's <strong>Settings</strong> tab</li>
        <li>Choose <strong>Choose another identity</strong> to open the sign-in prompt</li>
        <li>Enter and authenticate the new account credentials</li>
        <li>Verify the new account has sufficient permissions to access Microsoft Defender Vulnerability Remediation data</li>
      </ol>

      <blockquote>Changes to the agent's identity won't affect the agent's run history, which remains available for compliance and audit purposes.</blockquote>

      <h2>Implementation checklist</h2>
      <h3>Pre-deployment validation</h3>
      <ul>
        <li><strong>Permission audit</strong> - Verify the service account has appropriate Microsoft Defender XDR access</li>
        <li><strong>Device group scoping</strong> - Map device groups to ensure complete vulnerability coverage</li>
        <li><strong>RBAC model selection</strong> - Choose unified or granular based on organizational requirements</li>
        <li><strong>Identity strategy</strong> - Define the service account lifecycle and rotation policies</li>
      </ul>

      <h3>Configuration validation</h3>
      <ul>
        <li>Test vulnerability data access with the assigned identity</li>
        <li>Validate device group visibility across all managed endpoints</li>
        <li>Confirm remediation recommendations appear correctly in Security Copilot</li>
        <li>Document the configuration for compliance and change management</li>
      </ul>

      <h2>Operational considerations</h2>
      <h3>Identity management best practices</h3>
      <dl>
        <dt>Service account rotation</dt>
        <dd>Plan regular rotation cycles and test the identity change process during maintenance windows.</dd>
        <dt>Permission monitoring</dt>
        <dd>Set up alerts for permission changes that could affect the agent's ability to access vulnerability data.</dd>
        <dt>Audit trail maintenance</dt>
        <dd>Leverage the preserved run history to maintain compliance records across identity changes.</dd>
      </dl>

      <h3>RBAC optimization strategies</h3>
      <dl>
        <dt>Start with unified RBAC</dt>
        <dd>Begin with unified permissions and migrate to granular as organizational complexity increases.</dd>
        <dt>Device group alignment</dt>
        <dd>Align Microsoft Defender device groups with Intune device groups for consistent management.</dd>
        <dt>Regular access reviews</dt>
        <dd>Schedule quarterly reviews of agent permissions and device group scoping.</dd>
      </dl>

      <h2>Troubleshooting common scenarios</h2>
      <h3>Agent can't access some devices</h3>
      <p>Verify the agent's identity is properly scoped in Microsoft Defender to include all relevant device groups. Check that granular RBAC configurations haven't inadvertently excluded device groups from the agent's scope.</p>

      <h3>Identity change fails</h3>
      <p>Ensure the new account meets all permission requirements before attempting the change. Test the account's access to Microsoft Defender Vulnerability Remediation data independently.</p>

      <h3>Missing vulnerability data</h3>
      <p>Confirm the agent identity has read access to all necessary Microsoft Defender XDR components and that device groups are correctly configured in both services.</p>

      <h2>Next steps</h2>
      <p>Organizations currently using the Vulnerability Remediation Agent should review their RBAC configurations and consider whether the new identity management capabilities address current operational challenges.</p>

      <p>For organizations new to the preview, start with unified RBAC for simpler initial deployment, then evaluate granular RBAC as your vulnerability management program matures.</p>

      <p>Stay informed about additional preview updates by monitoring the <a href="https://docs.microsoft.com/en-us/microsoft-365/security/defender/vulnerability-management" target="_blank" rel="noopener noreferrer">Microsoft Defender Vulnerability Management documentation</a>.</p>

      ${sharedContentFooter}
    `,
    excerpt: 'Microsoft enhances the Security Copilot Vulnerability Remediation Agent with improved RBAC controls and manual identity management for better organizational control.',
    featured_image: '/images/posts/security-copilot-agent-updates.svg',
    date: new Date(now.getFullYear(), 8, 22).toISOString(),
    category_id: demoCategories[1].id,
    category: demoCategories[1],
    category_slug: demoCategories[1].slug,
    category_name: demoCategories[1].name,
    tags: [demoTags[3], demoTags[2], demoTags[1]],
    comments_enabled: true,
    view_count: 5420,
    share_count: 234,
    like_count: 189,
    reading_time: 7
  }
]

export function getDemoPosts(limit?: number): Array<Post & { category_name: string; tags: Tag[] }> {
  if (!limit) return demoPosts
  return demoPosts.slice(0, limit)
}

export function findDemoPost(slug: string) {
  return demoPosts.find(post => post.slug === slug)
}

export function getDemoCategories() {
  return demoCategories
}
