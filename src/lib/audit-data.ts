// Demo data for the Accessibility Validator app.

export type AuditStatus = "Passed" | "Failed" | "In Progress";
export type Severity = "Critical" | "Serious" | "Moderate" | "Minor";
export type DefectStatus = "Active" | "Resolved";
export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface AuditRow {
  id: string;
  name: string;
  targetUrl: string;
  standards: string[];
  score: number;
  defectsFound: number;
  defectsFixed: number;
  status: AuditStatus;
  date: string;
  /** Defect counts by severity — sum equals defectsFound */
  severityCounts: Record<Severity, number>;
  /** Compliance pie split, percentages that total 100 */
  complianceBreakdown: { compliant: number; nonCompliant: number; notApplicable: number };
  /** Outstanding items awaiting human verification */
  pendingVerification: number;
}

export interface Defect {
  id: string;
  title: string;
  severity: Severity;
  status: DefectStatus;
  locationFile: string;
  locationLine: number;
  standards: string[];
  whatIsWrong: string;
  whyItMatters: string;
  violatedStandard: string;
  impact: string;
  recommendedFix: string;
  currentCode: string;
  recommendedCode: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  locationFile: string;
  locationLine: number;
  actionRequired: string;
  status: ReviewStatus;
}

export const auditHistory: AuditRow[] = [
  {
    id: "a1", name: "Marketing Site", targetUrl: "https://www.example.com", standards: ["WCAG 2.1 AA", "EN 301 549"],
    score: 88, defectsFound: 47, defectsFixed: 31, status: "Passed", date: "Apr 24, 2025", pendingVerification: 4,
    severityCounts: { Critical: 12, Serious: 18, Moderate: 11, Minor: 6 },
    complianceBreakdown: { compliant: 92, nonCompliant: 6, notApplicable: 2 },
  },
  {
    id: "a2", name: "Customer Portal", targetUrl: "https://portal.example.com", standards: ["EN 301 549", "WCAG 2.2 AA"],
    score: 76, defectsFound: 62, defectsFixed: 28, status: "Failed", date: "Apr 20, 2025", pendingVerification: 9,
    severityCounts: { Critical: 20, Serious: 24, Moderate: 12, Minor: 6 },
    complianceBreakdown: { compliant: 84, nonCompliant: 13, notApplicable: 3 },
  },
  {
    id: "a3", name: "Product Docs", targetUrl: "https://docs.example.com", standards: ["WCAG 2.1 AA", "Section 508"],
    score: 92, defectsFound: 18, defectsFixed: 17, status: "Passed", date: "Apr 15, 2025", pendingVerification: 1,
    severityCounts: { Critical: 3, Serious: 7, Moderate: 5, Minor: 3 },
    complianceBreakdown: { compliant: 96, nonCompliant: 2, notApplicable: 2 },
  },
  {
    id: "a4", name: "Mobile App (Web)", targetUrl: "https://app.example.com", standards: ["Section 508", "WCAG 2.1 AA"],
    score: 68, defectsFound: 104, defectsFixed: 52, status: "In Progress", date: "Apr 10, 2025", pendingVerification: 14,
    severityCounts: { Critical: 34, Serious: 38, Moderate: 22, Minor: 10 },
    complianceBreakdown: { compliant: 74, nonCompliant: 22, notApplicable: 4 },
  },
  {
    id: "a5", name: "Support Center", targetUrl: "https://support.example.com", standards: ["WCAG 2.2 AA", "EN 301 549"],
    score: 81, defectsFound: 38, defectsFixed: 20, status: "Passed", date: "Mar 28, 2025", pendingVerification: 5,
    severityCounts: { Critical: 9, Serious: 14, Moderate: 10, Minor: 5 },
    complianceBreakdown: { compliant: 87, nonCompliant: 10, notApplicable: 3 },
  },
  {
    id: "a6", name: "Investor Relations", targetUrl: "https://investors.example.com", standards: ["EN 301 549", "Section 508"],
    score: 58, defectsFound: 91, defectsFixed: 40, status: "Failed", date: "Mar 12, 2025", pendingVerification: 17,
    severityCounts: { Critical: 32, Serious: 31, Moderate: 19, Minor: 9 },
    complianceBreakdown: { compliant: 66, nonCompliant: 30, notApplicable: 4 },
  },
  {
    id: "a7", name: "Careers", targetUrl: "https://careers.example.com", standards: ["WCAG 2.1 AA", "EN 301 549"],
    score: 85, defectsFound: 29, defectsFixed: 25, status: "Passed", date: "Feb 26, 2025", pendingVerification: 3,
    severityCounts: { Critical: 5, Serious: 10, Moderate: 9, Minor: 5 },
    complianceBreakdown: { compliant: 90, nonCompliant: 8, notApplicable: 2 },
  },
  {
    id: "a8", name: "Blog", targetUrl: "https://blog.example.com", standards: ["WCAG 2.2 AA", "Section 508"],
    score: 73, defectsFound: 66, defectsFixed: 33, status: "Failed", date: "Feb 14, 2025", pendingVerification: 8,
    severityCounts: { Critical: 15, Serious: 22, Moderate: 18, Minor: 11 },
    complianceBreakdown: { compliant: 80, nonCompliant: 16, notApplicable: 4 },
  },
  {
    id: "a9", name: "Partner Portal", targetUrl: "https://partners.example.com", standards: ["EN 301 549", "WCAG 2.1 AA"],
    score: 90, defectsFound: 22, defectsFixed: 18, status: "Passed", date: "Jan 30, 2025", pendingVerification: 2,
    severityCounts: { Critical: 4, Serious: 8, Moderate: 6, Minor: 4 },
    complianceBreakdown: { compliant: 94, nonCompliant: 4, notApplicable: 2 },
  },
  {
    id: "a10", name: "Legacy Site", targetUrl: "https://legacy.example.com", standards: ["Section 508", "WCAG 2.2 AA"],
    score: 49, defectsFound: 120, defectsFixed: 37, status: "Failed", date: "Jan 12, 2025", pendingVerification: 21,
    severityCounts: { Critical: 45, Serious: 40, Moderate: 24, Minor: 11 },
    complianceBreakdown: { compliant: 58, nonCompliant: 38, notApplicable: 4 },
  },
];

export const defects: Defect[] = [
  {
    id: "IMG-101",
    title: "Missing alt text on hero image",
    severity: "Critical",
    status: "Active",
    locationFile: "src/components/Hero.tsx",
    locationLine: 42,
    standards: ["WCAG 2.1 AA — 1.1.1", "EN 301 549 — 9.1.1.1"],
    whatIsWrong: "The image element does not have alternative text, so screen readers cannot describe the image to users with visual impairments.",
    whyItMatters: "Alternative text allows screen reader users to understand the purpose and content of images. Without it, important information may be missed.",
    violatedStandard: "WCAG 2.1 AA — 1.1.1 Non-text Content",
    impact: "Screen reader users cannot identify the image.",
    recommendedFix: "Add a meaningful alt attribute that describes the image content or purpose.",
    currentCode: `<div className="hero">
  <img src="/images/hero.jpg" />
</div>`,
    recommendedCode: `<div className="hero">
  <img src="/images/hero.jpg"
    alt="Person using our product" />
</div>`,
  },
  {
    id: "FORM-204",
    title: "Input lacks associated label",
    severity: "Serious",
    status: "Active",
    locationFile: "src/forms/ContactForm.tsx",
    locationLine: 18,
    standards: ["WCAG 2.1 AA — 3.3.2", "Section 508 — 504"],
    whatIsWrong: "The text input has no programmatically associated <label>, so its purpose is not announced when focused.",
    whyItMatters: "Users relying on assistive technology need to know what each field is for. Visible labels also help everyone fill forms faster.",
    violatedStandard: "WCAG 2.1 AA — 3.3.2 Labels or Instructions",
    impact: "Form fields are announced as unnamed edit fields.",
    recommendedFix: "Add a <label> element and link it with htmlFor, or provide an aria-label.",
    currentCode: `<input
  type="email"
  placeholder="Email" />`,
    recommendedCode: `<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  placeholder="you@example.com" />`,
  },
  {
    id: "CON-018",
    title: "Insufficient color contrast 3:1",
    severity: "Serious",
    status: "Active",
    locationFile: "src/styles.css",
    locationLine: 112,
    standards: ["WCAG 2.1 AA — 1.4.3", "EN 301 549 — 9.1.4.3"],
    whatIsWrong: "Body text on a tinted background has a contrast ratio of 3:1, below the required 4.5:1.",
    whyItMatters: "Low contrast text is hard or impossible to read for users with low vision or on glare-prone screens.",
    violatedStandard: "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)",
    impact: "Text is unreadable for low-vision users.",
    recommendedFix: "Darken the text color or lighten the background until the ratio reaches at least 4.5:1.",
    currentCode: `.muted-note {
  color: #9aa7b8;
  background: #eef3fa;
}`,
    recommendedCode: `.muted-note {
  color: #4a5a70;
  background: #eef3fa;
}`,
  },
  {
    id: "NAV-033",
    title: "Skip link missing",
    severity: "Moderate",
    status: "Active",
    locationFile: "src/layouts/layout.tsx",
    locationLine: 12,
    standards: ["WCAG 2.1 AA — 2.4.1", "Section 508 — 502"],
    whatIsWrong: "There is no \"skip to main content\" link, so keyboard users must tab through the full navigation on every page.",
    whyItMatters: "A skip link lets keyboard and screen reader users jump straight to the content, saving many keystrokes.",
    violatedStandard: "WCAG 2.1 AA — 2.4.1 Bypass Blocks",
    impact: "Keyboard navigation is slow and repetitive.",
    recommendedFix: "Add a visually hidden skip link as the first focusable element.",
    currentCode: `<header>
  <nav>{/* 12 links */}</nav>
</header>`,
    recommendedCode: `<a href="#main"
  className="skip-link">
  Skip to main content
</a>
<header>...</header>`,
  },
  {
    id: "BTN-056",
    title: "Button name not descriptive",
    severity: "Moderate",
    status: "Active",
    locationFile: "src/pages/Checkout.tsx",
    locationLine: 87,
    standards: ["WCAG 2.1 AA — 2.4.4", "EN 301 549 — 9.2.4.4"],
    whatIsWrong: "The button is announced only as \"click here\", which does not describe its action out of context.",
    whyItMatters: "Screen reader users often navigate by a list of buttons; vague names make the page unusable.",
    violatedStandard: "WCAG 2.1 AA — 2.4.4 Link Purpose",
    impact: "The button's purpose is unclear.",
    recommendedFix: "Give the button an accessible name that describes the action.",
    currentCode: `<button onClick={pay}>
  Click here
</button>`,
    recommendedCode: `<button onClick={pay}>
  Complete payment
</button>`,
  },
  {
    id: "HED-022",
    title: "Heading levels skip from h1 to h3",
    severity: "Moderate",
    status: "Resolved",
    locationFile: "src/pages/About.tsx",
    locationLine: 34,
    standards: ["WCAG 2.1 AA — 1.3.1", "Section 508 — 501"],
    whatIsWrong: "The heading hierarchy jumps from h1 to h3, breaking the document outline.",
    whyItMatters: "Screen reader users navigate by headings; skipped levels make the structure appear to be missing content.",
    violatedStandard: "WCAG 2.1 AA — 1.3.1 Info and Relationships",
    impact: "Page structure is confusing when navigated by headings.",
    recommendedFix: "Use sequential heading levels; change the h3 to an h2.",
    currentCode: `<h1>About us</h1>
<h3>Our mission</h3>`,
    recommendedCode: `<h1>About us</h1>
<h2>Our mission</h2>`,
  },
  {
    id: "LNK-091",
    title: "Link text is not descriptive",
    severity: "Serious",
    status: "Resolved",
    locationFile: "src/components/Footer.tsx",
    locationLine: 28,
    standards: ["WCAG 2.1 AA — 2.4.4", "EN 301 549 — 9.2.4.4"],
    whatIsWrong: "The footer link reads \"learn more\" and its destination is not clear out of context.",
    whyItMatters: "Links should make sense on their own, because assistive technology can list all links on a page.",
    violatedStandard: "WCAG 2.1 AA — 2.4.4 Link Purpose (In Context)",
    impact: "Link purpose cannot be determined.",
    recommendedFix: "Describe the destination in the link text.",
    currentCode: `<a href="/pricing">
  Learn more
</a>`,
    recommendedCode: `<a href="/pricing">
  See pricing plans
</a>`,
  },
  {
    id: "TAB-117",
    title: "Element not keyboard focusable",
    severity: "Serious",
    status: "Active",
    locationFile: "src/ui/Modal.tsx",
    locationLine: 63,
    standards: ["WCAG 2.1 AA — 2.1.1", "Section 508 — 502"],
    whatIsWrong: "The modal close control is a <div> with a click handler and cannot receive keyboard focus.",
    whyItMatters: "Keyboard-only users cannot close the modal, trapping them inside it.",
    violatedStandard: "WCAG 2.1 AA — 2.1.1 Keyboard",
    impact: "Modal is unusable without a mouse.",
    recommendedFix: "Use a native <button> element for the close control.",
    currentCode: `<div onClick={close}
  className="modal-x">
  ×
</div>`,
    recommendedCode: `<button onClick={close}
  aria-label="Close dialog"
  className="modal-x">
  ×
</button>`,
  },
  {
    id: "IMG-145",
    title: "Decorative image announced by screen reader",
    severity: "Moderate",
    status: "Resolved",
    locationFile: "src/brand/Logo.tsx",
    locationLine: 10,
    standards: ["WCAG 2.1 AA — 1.1.1", "EN 301 549 — 9.1.1.1"],
    whatIsWrong: "A purely decorative logo image is announced as \"image\" without context in screen readers.",
    whyItMatters: "Decorative images should be hidden from assistive technology to reduce noise.",
    violatedStandard: "WCAG 2.1 AA — 1.1.1 Non-text Content",
    impact: "Redundant announcements slow down navigation.",
    recommendedFix: "Add an empty alt attribute to mark the image as decorative.",
    currentCode: `<img src="/logo.svg"
  alt="image" />`,
    recommendedCode: `<img src="/logo.svg"
  alt="" />`,
  },
  {
    id: "ARIA-309",
    title: "Missing ARIA role on tab list",
    severity: "Moderate",
    status: "Active",
    locationFile: "src/ui/Tabs.tsx",
    locationLine: 27,
    standards: ["WCAG 2.1 AA — 4.1.2", "EN 301 549 — 9.4.1.2"],
    whatIsWrong: "The custom tab widget does not expose role=\"tablist\" or state, so screen readers announce plain buttons.",
    whyItMatters: "Users cannot tell that the controls are tabs or which one is selected.",
    violatedStandard: "WCAG 2.1 AA — 4.1.2 Name, Role, Value",
    impact: "Tab widget semantics are lost.",
    recommendedFix: "Add tablist/tab roles and aria-selected state.",
    currentCode: `<div className="tabs">
  <button>One</button>
  <button>Two</button>
</div>`,
    recommendedCode: `<div role="tablist">
  <button role="tab"
    aria-selected={true}>One</button>
  <button role="tab"
    aria-selected={false}>Two</button>
</div>`,
  },
];

export const reviewItems: ReviewItem[] = [
  {
    id: "CAP-051",
    title: "Captcha has no audio alternative",
    priority: "High",
    reason: "Automated tools cannot confirm perceptible alternatives",
    locationFile: "src/forms/SignUp.tsx",
    locationLine: 88,
    actionRequired: "Test captcha with keyboard-only navigation and screen reader.",
    status: "Pending",
  },
  {
    id: "IMG-032",
    title: "Decorative image missing alt attribute",
    priority: "Medium",
    reason: "Automated tools cannot determine if the image is decorative",
    locationFile: "src/components/Hero.tsx",
    locationLine: 24,
    actionRequired: "Verify if this image is decorative. If not, provide a meaningful alt text.",
    status: "Pending",
  },
  {
    id: "LNK-017",
    title: "Link text is not descriptive",
    priority: "Medium",
    reason: "Automated tools cannot confirm link purpose in context",
    locationFile: "src/components/Footer.tsx",
    locationLine: 56,
    actionRequired: "Verify the link text makes sense out of context or provide an aria-label.",
    status: "Pending",
  },
  {
    id: "HDG-008",
    title: "Possible skipped heading level",
    priority: "Low",
    reason: "Automated tools cannot determine content structure intent",
    locationFile: "src/pages/Pricing.tsx",
    locationLine: 112,
    actionRequired: "Verify heading hierarchy is logical and intentional.",
    status: "Pending",
  },
  {
    id: "CLR-021",
    title: "Insufficient color contrast",
    priority: "High",
    reason: "Automated tools flag potential contrast issue; needs human review",
    locationFile: "src/pages/Dashboard.tsx",
    locationLine: 41,
    actionRequired: "Measure contrast with a color picker and confirm it meets 4.5:1.",
    status: "Pending",
  },
  {
    id: "FRM-064",
    title: "Error message not tied to field",
    priority: "Medium",
    reason: "Automation cannot confirm the error is announced",
    locationFile: "src/forms/Checkout.tsx",
    locationLine: 133,
    actionRequired: "Confirm the error is announced by aria-describedby or live region.",
    status: "Pending",
  },
  {
    id: "FOC-072",
    title: "Focus order may be illogical",
    priority: "Low",
    reason: "Automated tools cannot judge intuitive focus order",
    locationFile: "src/ui/Stepper.tsx",
    locationLine: 19,
    actionRequired: "Tab through the stepper and confirm the order matches the visual flow.",
    status: "Pending",
  },
  {
    id: "MOT-019",
    title: "Motion animation cannot be disabled",
    priority: "High",
    reason: "Automated tools cannot confirm prefers-reduced-motion support",
    locationFile: "src/ui/HeroCarousel.tsx",
    locationLine: 52,
    actionRequired: "Verify the carousel pauses and honors prefers-reduced-motion.",
    status: "Pending",
  },
  { id: "ALT-002", title: "Chart alt text verified", priority: "Medium", reason: "Human confirmed chart description", locationFile: "src/charts/SalesChart.tsx", locationLine: 9, actionRequired: "Approved: long description provided below the chart.", status: "Approved" },
  { id: "TAB-014", title: "Table header scope verified", priority: "Low", reason: "Human confirmed header associations", locationFile: "src/pages/Reports.tsx", locationLine: 61, actionRequired: "Approved: scope attributes are correct.", status: "Approved" },
  { id: "VID-008", title: "Video captions verified", priority: "High", reason: "Human confirmed caption accuracy", locationFile: "src/media/Tour.tsx", locationLine: 27, actionRequired: "Approved: captions match audio.", status: "Approved" },
  { id: "LNG-005", title: "Page language attribute verified", priority: "Low", reason: "Human confirmed lang value", locationFile: "src/routes/__root.tsx", locationLine: 6, actionRequired: "Approved: lang=\"en\" is correct for the audience.", status: "Approved" },
  { id: "RLS-011", title: "Rejection: icon-only button unclear", priority: "Medium", reason: "Human found the icon ambiguous even with aria-label", locationFile: "src/ui/CardMenu.tsx", locationLine: 44, actionRequired: "Rejected: replace icon with text label.", status: "Rejected" },
  { id: "TTL-003", title: "Rejection: page title too generic", priority: "Low", reason: "Human found the title unhelpful for identification", locationFile: "src/pages/Index.tsx", locationLine: 12, actionRequired: "Rejected: use a specific page title.", status: "Rejected" },
  { id: "NVA-017", title: "Rejection: nav landmark duplicated", priority: "Medium", reason: "Human found two navigation landmarks without labels", locationFile: "src/layouts/Sidebar.tsx", locationLine: 8, actionRequired: "Rejected: label each nav landmark distinctly.", status: "Rejected" },
];

export const complianceReport = {
  auditName: "Marketing Site",
  targetUrl: "https://www.example.com",
  date: "Apr 24, 2025",
  score: 88,
  standards: ["WCAG 2.1 AA", "EN 301 549"],
  summary: {
    totalChecks: 214,
    passed: 188,
    failed: 26,
  },
  breakdown: [
    { area: "Perceivable", passed: 52, failed: 6 },
    { area: "Operable", passed: 48, failed: 9 },
    { area: "Understandable", passed: 44, failed: 5 },
    { area: "Robust", passed: 44, failed: 6 },
  ],
};
