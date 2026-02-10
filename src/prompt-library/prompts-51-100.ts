import type { Prompt } from "./prompt-data";

export const promptsSet2: Prompt[] = [
  // ── AI & LLM PATTERNS (51–60) ─────────────────────────────────────
  {
    id: 51,
    category: "ai-patterns",
    title: "AI Chat Interface — Streaming + Memory",
    description:
      "ChatGPT-style conversational UI with streaming typewriter effect, conversation history, and markdown rendering.",
    prompt: `<task>Build an AI chat interface with streaming typewriter effect.</task>

<layout>
flex flex-col h-screen:
- Message area: flex-1 overflow-y-auto <ScrollArea>
- Input: sticky bottom <Textarea> + Send <Button>
</layout>

<messages>
/components/chat/message-bubble.tsx:
- User: right-aligned, bg-primary, rounded-2xl rounded-br-sm
- AI: left-aligned, bg-muted, rounded-2xl rounded-bl-sm
- <Avatar> per message, timestamp, copy on hover
- Markdown rendering: bold, lists, code blocks
</messages>

<streaming>
function useTypewriter(text: string, speed = 20) {
  // setInterval reveals characters progressively
  // Blinking cursor during stream: animate-pulse inline-block
  // Auto-scroll to bottom as text appears
}
</streaming>

<input>
Auto-resize <Textarea> (1-5 rows). Send on Cmd+Enter.
"AI is typing..." with animated dots.
</input>

<conversations>
Sidebar: history list, "New chat", rename inline, delete with <AlertDialog>.
Store in localStorage.
</conversations>

Pre-define 10 varied AI responses with code blocks, lists, formatted text.`,
    tags: [
      "Chat",
      "AI",
      "Streaming",
      "Typewriter",
      "Claude 4.6",
    ],
  },
  {
    id: 52,
    category: "ai-patterns",
    title: "Visual Prompt Builder & Templates",
    description:
      "Build a visual interface for constructing AI prompts with template variables, drag-and-drop sections, and live preview.",
    prompt: `<task>Create a visual prompt builder with template variables and reusable sections.</task>

<data_model>
interface PromptTemplate {
  id: string; name: string; description: string;
  sections: PromptSection[];
  variables: TemplateVariable[];
}
interface TemplateVariable {
  name: string; label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder: string; required: boolean; options?: string[];
}
</data_model>

<builder_ui>
Left: Template structure (drag-to-reorder via react-dnd)
Center: Live editor with {{variable}} syntax highlighting
Right: Variable configuration panel
</builder_ui>

<sections>
System instruction, User context, Examples (few-shot), Constraints, Output format
</sections>

<variable_handling>
- Auto-detect {{variable_name}} in text → generate form fields
- Live preview: replace variables with values
- Highlight unfilled required variables in red
</variable_handling>

<templates>
Pre-built: Email writer, Code reviewer, Data analyzer, Content creator
Save/load localStorage. Export/import JSON.
</templates>

<output>
"Copy Prompt" → rendered prompt. Character/token estimate. "Test in chat" button.
</output>`,
    tags: [
      "Prompt Builder",
      "Templates",
      "Variables",
      "No-Code",
    ],
  },
  {
    id: 53,
    category: "ai-patterns",
    title: "AI Model Response Comparator",
    description:
      "Side-by-side response comparison for evaluating prompts across models with diff mode and rating system.",
    prompt: `<task>Build a side-by-side AI response comparison interface.</task>

<layout>
Top: Shared prompt <Textarea> + "Run All" button
Below: 2-4 column grid (responsive: 1→2→4 columns)
</layout>

<column>
/components/ai/model-column.tsx:
- Model <Select>: GPT-4o, Claude 4.6 Sonnet, Claude 4.6 Opus, Gemini 2
- Response <ScrollArea> with markdown
- Loading: <Skeleton> with model accent color
- Footer: response time, token count, cost estimate, 5-star rating
</column>

<features>
- "Run All": trigger simultaneously with staggered delays
- Diff mode: highlight differences between responses
- Winner badge: crown icon on best response
- Notes <Textarea> per response for evaluation
- History in localStorage
</features>

<variations>
"Variations" mode: same model, different prompt phrasings for A/B testing.
Track which version performs best.
</variations>

Simulate 3-4 quality-varied responses per prompt.`,
    tags: [
      "Comparison",
      "Side-by-Side",
      "Evaluation",
      "A/B Testing",
    ],
  },
  {
    id: 54,
    category: "ai-patterns",
    title: "Token Counter & Cost Estimator",
    description:
      "Real-time token counting with cost estimation across Claude 4.6, GPT-4o, and Gemini pricing tiers.",
    prompt: `<task>Build a token counter and cost estimator for AI models.</task>

<counter>
Large <Textarea> for prompts. Real-time: character count, word count, estimated tokens (~4 chars/token).
Visual progress bars against model context limits:
- Claude 4.6 Sonnet: 200K tokens
- Claude 4.6 Opus: 200K tokens
- GPT-4o: 128K tokens
- Gemini 2 Pro: 2M tokens
</counter>

<pricing>
| Model               | Input $/1M  | Output $/1M | Context |
|---------------------|-------------|-------------|---------|
| Claude 4.6 Sonnet   | $3.00       | $15.00      | 200K    |
| Claude 4.6 Opus     | $15.00      | $75.00      | 200K    |
| GPT-4o              | $2.50       | $10.00      | 128K    |
| Gemini 2 Pro        | $1.25       | $5.00       | 2M      |
</pricing>

<estimation>
Input cost + expected output (slider 100-4000 tokens) × price = per-request total.
"×100" monthly projection. Comparison <BarChart> across models.
Color tiers: green (<$0.01), yellow ($0.01-$0.10), red (>$0.10).
Model recommendation: highlight cheapest for the task.
</estimation>

<tracker>
Daily/weekly/monthly usage log (localStorage). Cumulative <AreaChart>. Budget alerts.
</tracker>`,
    tags: [
      "Tokens",
      "Cost",
      "Claude 4.6",
      "Pricing",
      "Calculator",
    ],
  },
  {
    id: 55,
    category: "ai-patterns",
    title: "AI Feedback & Rating Interface",
    description:
      "Feedback collection for AI responses with thumbs up/down, multi-dimension ratings, and analytics dashboard.",
    prompt: `<task>Create an AI response feedback and rating interface.</task>

<inline_feedback>
Per AI response: ThumbsUp / ThumbsDown buttons.
On thumbs down → expand form:
  "What was wrong?" <RadioGroup>: Inaccurate, Not helpful, Too verbose, Too brief, Harmful, Other
  Comments <Textarea> + "Submit"
On thumbs up → brief <RadioGroup>: Accurate, Well formatted, Creative, Good explanation
</inline_feedback>

<rating_card>
5-star rating (Star icons). Dimension ratings (1-5): Accuracy, Helpfulness, Clarity, Creativity.
Average auto-calculated. Confidence <Slider> 0-100%.
</rating_card>

<dashboard>
/components/ai/feedback-dashboard.tsx:
- Summary: total ratings, average score, thumbs ratio
- <PieChart> feedback categories
- <LineChart> rating trends
- Recent feedback list with sort/filter
- Export as CSV
</dashboard>

Animation: thumbs animate on click — scale + color fill. Confetti for thumbs up.
Store all in localStorage with timestamps.`,
    tags: ["Feedback", "Rating", "AI UX", "Analytics"],
  },
  {
    id: 56,
    category: "ai-patterns",
    title: "AI Playground — Parameter Tuning",
    description:
      "Multi-model playground with temperature, top-p, max tokens sliders, presets, and response history.",
    prompt: `<task>Build an AI playground for testing prompts with different parameters.</task>

<layout>
3 panels: Left (config), Center (prompt + response), Right (history)
</layout>

<config>
Model <Select>: Claude 4.6 Opus, Claude 4.6 Sonnet, GPT-4o, Gemini 2
System Prompt <Textarea> with template <Select>
Sliders:
- Temperature: 0-2, step 0.1, default 1.0 ("0=deterministic, 2=creative")
- Top P: 0-1, step 0.05
- Max Tokens: 100-4096, step 100
- Frequency/Presence Penalty: 0-2
"Reset to defaults" button
</config>

<prompt_area>
<Textarea> with line numbers + token count. "Run" (Cmd+Enter) + "Run 3x" buttons.
</prompt_area>

<response>
Streaming typewriter. Syntax-highlighted code blocks. Copy button.
Metadata: tokens, time, cost. "Compare with..." to pin and re-run.
</response>

<presets>
Save parameter combos:
"Creative Writing" (temp 1.5), "Code Gen" (temp 0.2), "Analysis" (temp 0), "Brainstorm" (temp 1.8)
</presets>

<history>
Chronological runs: truncated prompt, model, params, rating. Click for full. Pin for comparison.
</history>

Simulate responses with realistic delays varied by temperature.`,
    tags: [
      "Playground",
      "Parameters",
      "Temperature",
      "Claude 4.6",
    ],
  },
  {
    id: 57,
    category: "ai-patterns",
    title: "Structured Output & Schema Builder",
    description:
      "Visual JSON schema builder that generates AI prompts for structured, parseable output with validation.",
    prompt: `<task>Build a visual JSON schema builder for structured AI output.</task>

<builder>
Visual tree editor:
- Add field: name, type (string/number/boolean/array/object/enum), required toggle
- Nested objects with indent + expand/collapse
- Enum values editor
- Description per property (becomes prompt context)
</builder>

<types>
string (format: email/url/date/uuid), number (min/max), boolean,
array (items type, min/max items), object (nested), enum (values list)
</types>

<preview>
3 panels side by side:
Left: Visual editor (form-based)
Center: Generated JSON Schema (read-only, highlighted)
Right: Auto-generated example output matching schema
</preview>

<prompt_gen>
"Generate Prompt" creates:
- Task description + "Respond in JSON:" + schema with descriptions + example
- Copy button + character count
</prompt_gen>

<templates>
Product review, Meeting notes, Data report, Contact parser, Recipe format
</templates>

<validation>
Paste AI response → validate against schema. Highlight missing fields, type mismatches.
"Valid" / "Invalid" <Badge>.
</validation>

Store schemas in localStorage. Export/import JSON.`,
    tags: ["Structured Output", "JSON Schema", "Validation"],
  },
  {
    id: 58,
    category: "ai-patterns",
    title: "Prompt Chaining & Workflow Builder",
    description:
      "Visual workflow builder for chaining AI prompts where each step's output feeds the next, with branching support.",
    prompt: `<task>Build a visual prompt chaining workflow builder.</task>

<concept>
Steps connected in sequence: output of Step N → input context for Step N+1.
Steps can branch (conditional) or merge (combine outputs).
</concept>

<builder>
Canvas with draggable step nodes connected by lines.
Each node: title, prompt preview, status indicator.
Add node: "+" between connections.
</builder>

<step_node>
Header: step number, title (editable), model selector
Body: prompt <Textarea> with {{previous_output}} variable
Footer: status (pending/running/complete/error), token count
</step_node>

<example_chain>
Step 1: "Analyze text, extract key themes: {{user_input}}" → themes
Step 2: "Generate 3 questions per theme: {{previous_output}}" → questions
Step 3: "Create lesson plan from: {{previous_output}}" → plan
</example_chain>

<execution>
"Run Workflow": sequential execution with current step highlighted.
Each output visible in expandable panel.
Error: retry or skip. Total time + cost summary.
</execution>

<management>
Save/load localStorage. Templates: Content Pipeline, Research, Code Review.
Export as JSON. react-dnd for node positioning.
</management>`,
    tags: [
      "Prompt Chaining",
      "Workflow",
      "Pipeline",
      "Visual Builder",
    ],
  },
  {
    id: 59,
    category: "ai-patterns",
    title: "AI-Powered Content Editor",
    description:
      "Rich text editor with inline AI assistance: rewrite, expand, summarize, translate, and tone adjustment.",
    prompt: `<task>Build a content editor with inline AI assistance.</task>

<editor>
contentEditable div with formatting toolbar. Text selection triggers floating AI toolbar.
</editor>

<ai_toolbar>
Appears above selected text. Actions:
Rewrite, Expand, Summarize, Fix grammar,
Change tone <Select> (Professional/Casual/Friendly/Academic),
Translate <Select> (Spanish/French/German/Japanese),
Simplify, Make shorter, Make longer
</ai_toolbar>

<action_flow>
1. Select text → toolbar appears
2. Click action → shimmer loading on selection
3. Show diff: original (strikethrough, red bg) vs suggested (green bg)
4. "Accept" / "Reject" / "Try again" buttons
</action_flow>

<document_actions>
Toolbar: "Generate outline", "Write introduction", "Generate conclusion", "Suggest title"
</document_actions>

<side_panel>
Readability score, word count, reading time, tone analysis.
Suggestions: "Consider replacing 'utilize' with 'use'" — click to apply.
</side_panel>

Simulate AI responses with 500ms delay and realistic transformations.`,
    tags: ["AI Editor", "Inline AI", "Rewrite", "Content"],
  },
  {
    id: 60,
    category: "ai-patterns",
    title: "RAG Knowledge Base Interface",
    description:
      "Retrieval-Augmented Generation UI with document upload, chunk visualization, citation-backed answers, and relevance scoring.",
    prompt: `<task>Build a RAG knowledge base interface.</task>

<documents>
Upload zone (drag-drop) for .txt, .md, .csv.
List: name, size, chunk count, date. Status: Uploading → Chunking → Indexing → Ready.
</documents>

<chunks>
When document selected, show chunks as cards.
Each: text preview (100 chars), chunk ID, word count.
Color by relevance: green (>0.8), yellow (0.5-0.8), gray (<0.5).
</chunks>

<query>
"Ask a question about your documents..."
AI response with inline citations [1], [2], [3].
Citation list: [1] doc name, chunk preview, relevance score.
Click citation → highlight source chunk in side panel.
</query>

<source_viewer>
Side panel: full chunk text, highlighted matching phrases, prev/next chunks.
</source_viewer>

<settings>
Chunk size <Slider> 200-1000 tokens. Overlap 0-200. Top K: 3/5/10. Threshold 0-1.
</settings>

Pre-load 3 sample documents. Chunk client-side. Keyword matching as simulated search.`,
    tags: [
      "RAG",
      "Knowledge Base",
      "Citations",
      "Document Search",
    ],
  },

  // ── INTEGRATION (61–67) ───────────────────────────────────────────
  {
    id: 61,
    category: "integration",
    title: "Supabase Auth Flow — Complete UI",
    description:
      "Full authentication UI for Supabase: login, signup, password reset, social auth, session management, and protected routes.",
    prompt: `<task>Build a complete auth flow UI designed for Supabase Auth.</task>

<views>
1. Login (/components/auth/login.tsx):
   Email + Password, "Remember me" <Checkbox>, "Forgot password?" link
   "Sign in" <Button> with loading. Social: Google, GitHub buttons.
   Error: <Alert variant="destructive">

2. Register (/components/auth/register.tsx):
   Name, Email, Password, Confirm. Strength indicator (weak→very strong).
   Requirements checklist: ✓ 8+ chars ✓ Uppercase ✓ Number ✓ Special
   Terms <Checkbox>. "Create account" <Button>.

3. Forgot Password: Email input → "Check your email" success state with mail icon.

4. Reset Password: New + Confirm password with strength indicator.
</views>

<layout>
Centered card on subtle gradient. Logo at top. motion/react transitions between views.
</layout>

<session>
User dropdown: avatar, name, email, "Sign out".
Protected route: redirect to login if not authenticated.
Session in localStorage (simulated).
</session>

<note>This builds UI only. Connect to Supabase via supabase_connect for real auth.</note>`,
    tags: ["Auth", "Supabase", "Login", "Signup", "Session"],
  },
  {
    id: 62,
    category: "integration",
    title: "Real-Time Dashboard — Supabase Ready",
    description:
      "Live-updating dashboard designed for Supabase Realtime with animated metrics, streaming activity, and connection status.",
    prompt: `<task>Build a real-time dashboard UI for Supabase Realtime integration.</task>

<sections>
1. Live Metrics: 4 KPI cards with smooth number counting, pulse "Live" indicator, green dot + "Real-time" <Badge>.

2. Activity Stream: <ScrollArea> <Card>. New events slide in at top. Types: user_joined, order_placed, payment_received, error. "N new events" banner. Auto-scroll toggle.

3. Live Table: <Table> orders. New rows insert with highlight. Changed cells flash (bg-accent 2s). Columns: ID, Customer, Amount, Status <Badge>, Time.

4. Live Chart: <LineChart> recharts. New points append. Smooth pan. Last 50 visible. Tooltip on hover.
</sections>

<simulation>
Random events every 2-5 seconds. Varied types and values. Occasional connection interruptions. Status indicator in header.
</simulation>

<note>Uses simulated data. Designed to drop in Supabase Realtime subscriptions via supabase_connect.</note>`,
    tags: ["Real-time", "Dashboard", "Supabase", "Live Data"],
  },
  {
    id: 63,
    category: "integration",
    title: "CRUD with Row-Level Security UI",
    description:
      "Data management interface showing ownership-based access control patterns for Supabase RLS.",
    prompt: `<task>Build CRUD with UI patterns reflecting row-level security.</task>

<model>Team Projects: owned by users. Members view but can't edit others'. Admins edit/delete any.</model>

<permission_ui>
List: "My Projects" (editable) vs "Team Projects" (view-only). <Badge>Owner</Badge> on yours. Lock icon + <Tooltip> on view-only.
Create: All users, auto-set owner (read-only field).
Edit: Only owner or admin. Non-editable fields grayed + lock. Admin override <Badge>.
Delete: Owner/admin only. "Transfer ownership" option before delete.
</permission_ui>

<role_indicator>
Current role in header: <Badge>Admin</Badge> or <Badge>Member</Badge>.
Role switcher for demo (switch to see UI changes).
</role_indicator>

<audit>
"Modified by [name] at [time]". "Created by [name]". Simplified change history.
</audit>

3 simulated users: Admin, Member1, Member2 with role-switching.`,
    tags: [
      "RLS",
      "Permissions",
      "CRUD",
      "Multi-User",
      "Supabase",
    ],
  },
  {
    id: 64,
    category: "integration",
    title: "File Storage Manager — Gallery View",
    description:
      "File management with upload, folders, gallery/list views, lightbox preview — designed for Supabase Storage.",
    prompt: `<task>Build a file storage manager with gallery and folders.</task>

<layout>
Left: Folder tree (expand/collapse). Top: breadcrumbs + view toggle + upload + search. Main: file grid or list.
</layout>

<folder_tree>
Root: Documents, Images, Videos, Archives. 2-level nesting. Click to navigate. Context menu: New, Rename, Delete.
</folder_tree>

<grid_view>
react-responsive-masonry for images. Lazy load. Hover overlay: filename, size, date. Click → lightbox. Shift+click multi-select.
</grid_view>

<list_view>
<Table>: Name (icon), Size, Type, Modified, Actions. Sortable. Row click for preview.
</list_view>

<preview>
Images: lightbox with zoom + arrow nav. Text: highlighted preview. Videos: player.
</preview>

<upload>
Drag-drop zone with progress. Rename before upload. Duplicate warning.
</upload>

<stats>
"2.4 GB of 5 GB" <Progress>. Type breakdown <PieChart>. Largest files list.
</stats>

Generate 30 sample files across folders.`,
    tags: [
      "File Storage",
      "Gallery",
      "Upload",
      "Supabase Storage",
    ],
  },
  {
    id: 65,
    category: "integration",
    title: "API Integration Dashboard & Monitor",
    description:
      "Dashboard for managing API integrations with health monitoring, request logs, rate limits, and webhook management.",
    prompt: `<task>Build an API integration management dashboard.</task>

<cards>
Per integration <Card>: logo + name, status <Badge> (Connected/Disconnected/Degraded), last sync, "Configure"/"Disconnect", spark line <LineChart>.
</cards>

<detail_sheet>
Connection health check. Masked API key (copy + reveal). Config form. Rate limit <Progress>. Test connection button.
</detail_sheet>

<request_log>
<Table>: Timestamp, Method <Badge>, Endpoint, Status (color-coded), Duration.
Filter: status, method, date. Click → full request/response in <Sheet> with JSON viewer.
</request_log>

<health>
Uptime % per integration (30 days). Response time <AreaChart>. Incident log.
</health>

<webhooks>
List: URL, events, status. Test button. Delivery log with retry status.
</webhooks>

<alerts>
Configure: downtime, high error rate, rate limit approaching. Channels: Email, Slack, In-app.
</alerts>

Simulate realistic API patterns with occasional errors.`,
    tags: ["API", "Monitoring", "Health Check", "Webhooks"],
  },
  {
    id: 66,
    category: "integration",
    title: "Webhook Event Viewer & Debugger",
    description:
      "Real-time webhook inspector with payload viewer, replay capability, diff comparison, and filtering.",
    prompt: `<task>Build a webhook event viewer and debugger.</task>

<stream>
Real-time list. New events slide in at top. Each row: timestamp, event type <Badge>, source icon, status (Received/Processing/Delivered/Failed), expand chevron.
</stream>

<detail>
Headers (collapsible): Content-Type, X-Webhook-Signature, etc.
Payload: JSON viewer, syntax highlighted, collapsible objects, copy + format toggle.
Response: status code, body, time.
</detail>

<debug>
"Replay": resend event. "Edit & Replay": modify payload first.
"Compare": diff two events. "Generate test": create custom payload.
</debug>

<filters>
Event type multi-select, source, status, date range, full-text payload search.
</filters>

<live_mode>
ON: auto-scroll, highlighted new. OFF: paused, "N new events" indicator.
</live_mode>

Simulate 30 events from various sources with mixed success/failure.`,
    tags: ["Webhooks", "Debugger", "Events", "JSON Viewer"],
  },
  {
    id: 67,
    category: "integration",
    title: "OAuth Connection Manager",
    description:
      "UI for managing OAuth2 connections with simulated consent flows, token status, and permission management.",
    prompt: `<task>Build an OAuth connection manager.</task>

<services_grid>
Card per service (Google, GitHub, Slack, Notion, Figma):
Status, connected account info, permissions scope, date, "Disconnect" <AlertDialog>.
</services_grid>

<connect_flow>
1. Click "Connect" → mock consent <Dialog>: branding, permission list, Allow/Deny
2. Allow → spinner → success animation → card updates
3. Deny → stays disconnected + toast
</connect_flow>

<token_management>
Status: Valid (green), Expiring soon (amber), Expired (red).
"Expires in 12 days" countdown. Manual refresh button. "Last refreshed 2h ago".
</token_management>

<permissions_sheet>
Scopes granted with plain-English explanations. "Requested" vs "Granted". Revoke option.
</permissions_sheet>

<security>
"Review all connections" reminder. "Disconnect all" emergency button. Age warnings (>1 year).
</security>

6 sample integrations with varied states.`,
    tags: [
      "OAuth",
      "Connections",
      "Token Management",
      "Security",
    ],
  },

  // ── ADVANCED (68–80) ──────────────────────────────────────────────
  {
    id: 68,
    category: "advanced",
    title: "Full SaaS Dashboard Starter",
    description:
      "Complete SaaS shell with sidebar navigation, dashboard, projects, team, settings, and billing pages.",
    prompt: `<task>Build a complete SaaS application shell.</task>

<layout>
shadcn <Sidebar> left: Logo, nav (Dashboard/Projects/Analytics/Messages, Team/Settings/Billing), user profile bottom. Collapsible mobile.
Main area with top bar: page title + user actions.
</layout>

<pages>
1. Dashboard: Welcome, 4 KPI cards, revenue <AreaChart>, recent <Table>, activity <ScrollArea>.
2. Projects: Grid/list toggle, cards (status, avatars, progress), search + filter, "New" <Dialog>.
3. Team: <Table> (Avatar, Name, Role <Badge>, Email, Status, Actions). "Invite" <Dialog>. Roles: Owner/Admin/Member/Viewer. Pending invites.
4. Settings: <Tabs> Profile/Notifications/Security/Appearance. Forms with appropriate controls.
5. Billing: Current plan card, comparison table (Free/Pro/Enterprise), history <Table>, payment method.
</pages>

State-based routing. Generate realistic data for all pages.`,
    tags: [
      "SaaS",
      "Dashboard",
      "Full App",
      "Sidebar",
      "Multi-Page",
    ],
  },
  {
    id: 69,
    category: "advanced",
    title: "Interactive Timeline & Activity Feed",
    description:
      "Vertical timeline with color-coded event markers, date grouping, filtering, and scroll-triggered animations.",
    prompt: `<task>Build an interactive vertical timeline with activity feed.</task>

<timeline>
Vertical line on left. Event nodes connected to line. Content cards extending right.
</timeline>

<event_types>
Created (green, Plus), Updated (blue, Pencil), Completed (green, Check),
Commented (gray, MessageSquare), Milestone (gold, Star), Error (red, AlertTriangle)
</event_types>

<event_card>
Header: title + <Badge> type + relative timestamp. Body: description. Footer: <Avatar> + name.
Optional: images, links, code snippets.
</event_card>

<features>
Expand/collapse details. Filter by type. Date range. Search. "Load more".
Milestone markers: full width, icon, "v2.0 Released".
Date grouping: "Today", "Yesterday", "February 4, 2026" — collapsible.
</features>

<animation>
IntersectionObserver + motion/react staggered entrance from bottom.
</animation>

Generate 30 events spanning 30 days.`,
    tags: [
      "Timeline",
      "Activity",
      "Events",
      "History",
      "Animation",
    ],
  },
  {
    id: 70,
    category: "advanced",
    title: "Pricing Page with Plan Comparison",
    description:
      "Modern pricing with monthly/annual toggle, feature matrix, plan cards, FAQ accordion, and responsive stacking.",
    prompt: `<task>Build a pricing page with plan comparison.</task>

<toggle>
Monthly / Annual <ToggleGroup>. Annual: "Save 20%" <Badge>. Prices animate on switch.
</toggle>

<plans>
1. Starter $0: "Get started" outline button. 3 projects, 1 user, 1GB.
2. Pro $29 ($23 annual): "Start free trial" primary button. "Most Popular" <Badge>. border-primary. 50 projects, 10 users, 50GB, analytics, API.
3. Enterprise $99 ($79 annual): "Contact sales" outline. Unlimited, SSO, SLA, dedicated support.
</plans>

<card_layout>
Plan name + large price. "/month, billed [period]". Feature list with Check/X icons. CTA button.
</card_layout>

<comparison_matrix>
Expandable "Compare all features" <Table>. Categories: Core, Collaboration, Analytics, Security, Support.
Check/X/text per plan. Highlight column.
</comparison_matrix>

<faq>
<Accordion> with 6 billing questions.
</faq>

Responsive: stack vertically mobile, scrollable table.`,
    tags: ["Pricing", "Plans", "Comparison", "SaaS"],
  },
  {
    id: 71,
    category: "advanced",
    title: "Masonry Image Gallery with Lightbox",
    description:
      "Pinterest-style masonry grid using react-responsive-masonry with lightbox, lazy loading, and infinite scroll.",
    prompt: `<task>Build a masonry image gallery.</task>

<grid>
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1400: 4 }}>
  <Masonry gutter="12px">{images.map(...)}</Masonry>
</ResponsiveMasonry>
</grid>

<gallery_item>
rounded-xl overflow-hidden. Hover overlay: title, photographer, Heart + Download buttons, category <Badge>. hover:scale-[1.02]. Click → lightbox.
</gallery_item>

<lightbox>
Full-screen bg-black/95. Centered object-contain. Left/Right arrows + keyboard. "5 / 24" counter. Bottom: title, description, metadata. Zoom on click.
</lightbox>

<loading>
Use unsplash_tool for 24 varied images. IntersectionObserver lazy load. <Skeleton> placeholders. Blur-up effect.
</loading>

<features>
Infinite scroll: 12 initial, 12 more on bottom. Category filter with motion/react layout animation. Like system in localStorage.
</features>`,
    tags: ["Masonry", "Gallery", "Lightbox", "Lazy Load"],
  },
  {
    id: 72,
    category: "advanced",
    title: "Content Carousel — react-slick",
    description:
      "Four carousel patterns: hero with crossfade, thumbnail gallery, testimonials, and responsive card slider.",
    prompt: `<task>Build content carousels using react-slick.</task>

import Slider from "react-slick";

<hero>
dots, infinite, fade, autoplay 5000ms, pauseOnHover.
Full-width unsplash_tool images + gradient overlay + headline + CTA.
Custom arrows: <ChevronLeft>/<ChevronRight> circles. Custom dot bars.
</hero>

<thumbnails>
Main large slider + small strip below. Synced via asNavFor + useRef. Click thumbnail → main changes.
</thumbnails>

<testimonials>
slidesToShow: 3/2/1 responsive. Quote card: text, <Avatar>, name, role, company. Autoplay + pause.
</testimonials>

<cards>
slidesToShow: 4 responsive down to 1. centerMode + centerPadding: "40px". Active slide larger.
</cards>

Build all 4 variants on a single page.`,
    tags: ["Carousel", "Slider", "react-slick", "Responsive"],
  },
  {
    id: 73,
    category: "advanced",
    title: "Resizable Multi-Panel Layout",
    description:
      "IDE-style resizable panels using re-resizable with collapse, persistence, and responsive sheet fallback.",
    prompt: `<task>Build a resizable multi-panel layout like VS Code.</task>

Use re-resizable package.

<layout>
Left (250px): file tree. Main (flexible): content. Right (300px): properties.
</layout>

<panels>
Left: resizable right edge. Min 180px, max 400px. Collapse below 180px. Toggle button.
Main: optional horizontal split (top content + bottom console). Bottom min 100px, max 50%.
Right: resizable left edge. Min 200px, max 500px. Collapse + toggle.
</panels>

<implementation>
import { Resizable } from "re-resizable";
<Resizable size={{ width, height: "100%" }} minWidth={180} maxWidth={400} enable={{ right: true }}
  onResizeStop={(e, dir, ref, d) => { setWidth(w + d.width); localStorage.setItem(...); }}>
</Resizable>
</implementation>

<features>
Persist sizes to localStorage. Smooth collapse animation. Mobile: panels → <Sheet> drawers.
</features>

Sample: file tree (left), code editor (center), properties (right).`,
    tags: ["Resizable", "Panels", "IDE Layout", "re-resizable"],
  },
  {
    id: 74,
    category: "advanced",
    title: "Email Template Builder",
    description:
      "Drag-and-drop email builder with block palette, live preview at 600px, mobile toggle, and HTML export.",
    prompt: `<task>Build a drag-and-drop email template builder.</task>

<layout>
Left: Block palette (draggable). Center: Email canvas (drop zone). Right: Block properties editor.
</layout>

<blocks>
Header (logo + links), Hero (image + heading + CTA), Text, Image, Two Column,
Button, Divider, Social icons, Footer (unsubscribe + info)
</blocks>

<dnd>
react-dnd: palette drag sources, canvas drop zone with insertion indicator.
Reorder within canvas. Delete (trash or button). Duplicate.
</dnd>

<properties>
Per selected block: text editor, image URL + alt, button text + URL + color + radius, padding, bg color.
</properties>

<preview>
<Tabs>: Edit | Preview | Code
Preview: rendered at 600px (email standard). Mobile toggle: 375px.
Code: generated HTML, syntax highlighted, copy button.
</preview>

<templates>
Pre-built: Welcome, Newsletter, Promotion, Transactional. Save/load localStorage. Export HTML.
</templates>

Canvas: 600px max-width with gray background simulating email client.`,
    tags: [
      "Email Builder",
      "Drag-Drop",
      "Templates",
      "HTML Export",
    ],
  },
  {
    id: 75,
    category: "advanced",
    title: "Customizable Dashboard Builder",
    description:
      "User-customizable dashboard where widgets can be added, removed, resized, and rearranged with layout persistence.",
    prompt: `<task>Build a customizable dashboard layout builder.</task>

<widgets>
interface DashboardWidget { id, type, title, size: "small"|"medium"|"large", position: {x,y} }
Types: KPI card, Line chart, Bar chart, Data table, Activity feed, Calendar, Notes, Pie chart
</widgets>

<grid>
CSS Grid: 4 cols desktop, 2 tablet, 1 mobile. Widgets span cells by size. react-dnd reorder.
</grid>

<widget_controls>
Header: title + <DropdownMenu> (Resize, Refresh, Configure, Duplicate, Remove with confirm).
Drag handle icon for repositioning.
</widget_controls>

<edit_mode>
"Customize" button toggles. Edit: borders, handles, resize controls visible.
"Add Widget" <Dialog> picker. "Reset to default" option.
</edit_mode>

<persistence>
Save layout to localStorage. Multiple named layouts ("Work", "Overview", "Detailed").
Switch via <Select>.
</persistence>

Build with 6 default widgets in a pleasing layout.`,
    tags: [
      "Dashboard Builder",
      "Widgets",
      "Customizable",
      "Grid",
    ],
  },
  {
    id: 76,
    category: "advanced",
    title: "Nested Drag-and-Drop List Builder",
    description:
      "Sortable nested list with react-dnd for hierarchical structures: nav menus, outlines, and category trees.",
    prompt: `<task>Build a nested drag-and-drop list using react-dnd.</task>

<model>
interface ListItem { id, label, icon?, children: ListItem[], collapsed? }
</model>

<visual>
Each item: drag handle (GripVertical), expand/collapse chevron, icon, label, action buttons.
Children indented level × 24px. Vertical line connecting children. Max 4 levels.
</visual>

<dnd>
- Reorder within same level
- Nest/un-nest by dragging to different parents
- Drop indicators: horizontal line (between), highlight (nest as child)
- Auto-expand collapsed parents on drag hover
</dnd>

<actions>
Double-click label → inline <Input> edit. "+" adds child. Trash deletes + undo toast.
Collapse/expand chevron rotation.
</actions>

<bulk>
"Expand All" / "Collapse All". Search/filter. Multi-select drag.
</bulk>

<keyboard>
Tab to indent, Shift+Tab to outdent, Enter for sibling, Delete to remove.
</keyboard>

Sample: navigation menu with 3 top-level items, 2-3 children each, some grandchildren.`,
    tags: ["Nested List", "Drag-Drop", "Hierarchy", "Tree"],
  },
  {
    id: 77,
    category: "interactions",
    title: "Micro-Interactions & Feedback Library",
    description:
      "Collection of delightful micro-interactions for buttons, toggles, inputs, and status indicators with spring physics.",
    prompt: `<task>Build a library of micro-interactions using motion/react + Tailwind.</task>

<buttons>
1. Ripple: expanding circle from click point
2. Success morph: "Save" → spinner → checkmark + "Saved!" → "Save"
3. Shake on error: horizontal shake on validation fail
4. Magnetic hover: button follows cursor subtly
</buttons>

<toggles>
1. <Switch> with morphing thumb (sun → moon)
2. Checkbox with checkmark SVG draw animation
3. Radio with ripple expand from center
</toggles>

<inputs>
1. Float label: moves from inside to above on focus
2. Success check: green check slides in on valid
3. Error shake: input shakes + red border
4. Character limit: smooth green → yellow → red transition
</inputs>

<status>
1. Online pulse: green dot + expanding ring
2. Loading dots: three bouncing with stagger
3. Progress ring: circular SVG animation
4. Confetti: particle burst on completion
5. Skeleton shimmer: gradient sweep
</status>

<notifications>
Badge bounce, bell ring rotation, count number morph
</notifications>

Showcase with "Play" buttons. All respect prefers-reduced-motion.`,
    tags: [
      "Micro-Interactions",
      "Animation",
      "Feedback",
      "Delight",
    ],
  },
  {
    id: 78,
    category: "components",
    title: "Calendar & Scheduling Interface",
    description:
      "Full calendar with month/week/day views, event creation, color coding, and mini calendar navigation.",
    prompt: `<task>Build a calendar and scheduling interface.</task>

<views>
<Tabs>: Month, Week, Day

Month: 7-column grid. Events as colored bars. "+3 more" overflow. Today highlighted. Month navigation.
Week: 7 columns × hourly rows (7am-9pm). Events as positioned blocks. Current time red line. Click empty → create.
Day: Single column, 15-minute grid. Full-width event blocks.
</views>

<events>
Color-coded: Meeting (blue), Focus (purple), Personal (green). Title + time + location.
Click → <Sheet> detail. Hover → <HoverCard> preview.
</events>

<creation>
Click time slot → <Dialog>: Title, Date, Start/End time, Category, Description, Location.
Recurring: Daily/Weekly/Monthly. Color picker.
</creation>

<mini_calendar>
Sidebar: compact month. Dots on event days. Click → navigate main calendar.
</mini_calendar>

Generate 20 events across current month with varied times/categories.`,
    tags: ["Calendar", "Scheduling", "Events", "Week View"],
  },
  {
    id: 79,
    category: "components",
    title: "Notification Center — Full System",
    description:
      "Complete notification center with bell trigger, categorized inbox, mark-as-read, and preference management.",
    prompt: `<task>Build a comprehensive notification center.</task>

<trigger>
Bell icon in header + red badge count. Animate on new. Click → <Popover> (desktop) or <Sheet> (mobile).
</trigger>

<popover>
Header: "Notifications" + "Mark all read". <Tabs>: All, Unread, Mentions, System. <ScrollArea> list.
Footer: "View all" link.
</popover>

<notification_item>
Left: icon or <Avatar>. Center: "John commented on your project" + timestamp + content preview.
Right: unread blue dot. Click: mark read + navigate. Hover "..." menu: Mark read, Delete, Mute.
</notification_item>

<types>
Comment (MessageSquare), Mention (AtSign), System (Server), Alert (AlertTriangle),
Update (RefreshCw), Achievement (Trophy)
</types>

<preferences>
<Dialog>: Toggle each type on/off. Channel: In-app/Email/Both/None.
"Quiet hours" range. "Do not disturb" toggle.
</preferences>

<states>
Empty: "All caught up!" Loading: <Skeleton>. Error: retry.
</states>

Generate 20 notifications with varied types and read states.`,
    tags: ["Notifications", "Inbox", "Categories", "Mark Read"],
  },
  {
    id: 80,
    category: "advanced",
    title: "Code Snippet Manager",
    description:
      "Code snippet collection with basic syntax highlighting, language detection, search, and tag organization.",
    prompt: `<task>Build a code snippet manager with syntax highlighting.</task>

<model>
interface CodeSnippet { id, title, description, language, code, tags: string[], isFavorite, createdAt, updatedAt }
</model>

<list>
Search + language <Select> filter + tag <Badge> toggles. Sort: Recent/Alpha/Most Used.
Preview cards: title, language <Badge>, first 3 lines, tags, favorite star.
</list>

<code_display>
Monospace + line numbers. Basic keyword coloring:
Keywords: blue (const, function, return). Strings: green. Comments: gray. Numbers: orange.
Copy button. Line wrap toggle. Font size: 12/14/16px.
</code_display>

<create_edit>
<Dialog>: Title, Language <Select> (auto-detect), Code <Textarea> (monospace, tab support),
Tags <Input> with autocomplete, Description.
</create_edit>

<detail_sheet>
Full code view. Edit/Delete. Copy. "Last updated". Related by tags.
</detail_sheet>

Create 15 snippets across JavaScript, TypeScript, Python, CSS, SQL.
Store localStorage.`,
    tags: [
      "Code Snippets",
      "Syntax Highlighting",
      "Developer Tool",
    ],
  },

  // ── REMAINING (81–100) ────────────────────────────────────────────
  {
    id: 81,
    category: "foundation",
    title: "shadcn/ui Component Explorer",
    description:
      "Interactive showcase of all available shadcn/ui components with live props editing and copyable code preview.",
    prompt: `<task>Build an interactive shadcn/ui component explorer.</task>

<layout>
Left sidebar: alphabetical component list. Main: demo + props editor + code preview.
</layout>

<available>
Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar,
Card, Checkbox, Collapsible, Command, ContextMenu, Dialog, DropdownMenu,
Form, HoverCard, Input, Label, Pagination, Popover, Progress, RadioGroup,
ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Switch, Table, Tabs,
Textarea, Toggle, ToggleGroup, Tooltip
</available>

<per_component>
1. Live Demo: rendered with default props, multiple variants, interactive
2. Props Editor: controls matching props — variant <Select>, size <RadioGroup>, disabled <Switch>. Updates demo real-time.
3. Code Preview: JSX producing current demo, syntax highlighted, copy button, import statement.
</per_component>

<categories>
Layout: Card, Separator, ScrollArea, Tabs
Forms: Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Calendar
Feedback: Alert, Badge, Progress, Skeleton
Overlay: Dialog, AlertDialog, Sheet, Popover, Tooltip, HoverCard, DropdownMenu
Navigation: Breadcrumb, Command, Pagination
</categories>

Search/filter by name.`,
    tags: [
      "shadcn/ui",
      "Explorer",
      "Component Library",
      "Docs",
    ],
  },
  {
    id: 82,
    category: "data",
    title: "URL-Synchronized State",
    description:
      "Sync filters, search, pagination, and view preferences to URL parameters for shareable, bookmarkable app states.",
    prompt: `<task>Build URL-synchronized state management.</task>

<hook>
/components/hooks/use-url-state.ts:
function useUrlState<T>(key, defaultValue): [T, (value: T) => void]
- Read from URL search params on mount
- Update via history.replaceState (no reload)
- Parse: number, boolean, array, object from strings
</hook>

<patterns>
Search: ?q=react+hooks
Filters: ?category=design&status=active
Pagination: ?page=3&perPage=25
Sort: ?sort=name&order=asc
View: ?view=grid
Tab: ?tab=settings
</patterns>

<benefits>
Copy URL → share exact view. Browser back/forward navigates states. Bookmark filtered views. Deep linking.
</benefits>

<implementation>
- Debounce URL updates for search (300ms)
- Batch multiple changes into single update
- Handle invalid params (fallback to defaults)
- Encode arrays: ?tags=react,tailwind → ["react", "tailwind"]
</implementation>

Build product listing demonstrating all patterns. Show URL updating live.`,
    tags: [
      "URL State",
      "Search Params",
      "Shareable",
      "Deep Linking",
    ],
  },
  {
    id: 83,
    category: "interactions",
    title: "Parallax & Scroll-Driven Animations",
    description:
      "Scroll-triggered animations with parallax, reveal-on-scroll, progress indicators, and horizontal scroll sections.",
    prompt: `<task>Build scroll-driven animations using IntersectionObserver + motion/react.</task>

<patterns>
1. Reveal on Scroll:
   <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: "-100px" }}>
   Apply to: headings, cards, images, counters.

2. Staggered Section: children animate in sequence as section enters view.

3. Parallax Background: background translateY(scrollY * 0.3). useTransform from motion/react.

4. Progress Bar: scroll progress 0-100% at page top. Section highlights in nav.

5. Number Counter: stats count from 0 when visible. useSpring for natural feel. Trigger once.

6. Horizontal Scroll: vertical scroll → horizontal movement. Pin section while scrolling cards.
</patterns>

Build a landing page demonstrating all 6 patterns.
Include prefers-reduced-motion fallbacks.`,
    tags: [
      "Parallax",
      "Scroll Animation",
      "InView",
      "Landing Page",
    ],
  },
  {
    id: 84,
    category: "design",
    title: "Glassmorphism UI Kit",
    description:
      "Modern frosted glass components with backdrop-blur, translucent overlays, and animated gradient mesh backgrounds.",
    prompt: `<task>Build a glassmorphism UI kit.</task>

<base_classes>
.glass-card: bg-white/10 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]
.glass-light: bg-white/60 backdrop-blur-xl border-white/40
.glass-dark: bg-black/20 backdrop-blur-xl border-white/10
</base_classes>

<background>
Gradient mesh: absolute divs with large border-radius + blur. Soft purples, blues, pinks, greens.
Slow CSS keyframe animation (60s cycle).
</background>

<components>
1. Glass Nav: fixed, bg-white/70 backdrop-blur-xl, transparent links, hover:bg-white/20
2. Glass Cards: bg-white/15, white/20 border, hover brightness increase
3. Glass Buttons: primary bg-white/20 hover:bg-white/30, accent bg-brand/80
4. Glass Inputs: bg-white/10 backdrop-blur-sm, placeholder white/50, focus bg-white/20
5. Glass Modal: bg-white/15 backdrop-blur-2xl, rounded-3xl, backdrop bg-black/30
</components>

Build demo: hero with glass nav, feature cards, testimonials, CTA — all glass.
Use unsplash_tool for vibrant background image.`,
    tags: [
      "Glassmorphism",
      "Frosted Glass",
      "Blur",
      "Modern UI",
    ],
  },
  {
    id: 85,
    category: "foundation",
    title: "Internationalization (i18n) UI Patterns",
    description:
      "Multi-language UI with language selector, RTL layout support, locale-aware formatting, and translation hook.",
    prompt: `<task>Build internationalization UI patterns.</task>

<hook>
/components/hooks/use-translations.ts:
Returns: t(key) → string, locale, setLocale, dir: "ltr"|"rtl"
</hook>

<selector>
<Select> with flag emoji + language: English, Español, Français, Arabic, Japanese.
Persist localStorage. Apply immediately.
</selector>

<rtl>
dir="rtl" on <html> for Arabic. Tailwind logical properties.
Mirror layout: sidebar switches. Directional icons flip.
</rtl>

<formatting>
Static: t("nav.dashboard") → "Dashboard" / "Tablero"
Interpolation: t("greeting", { name }) → "Hello, Alex!"
Plurals: t("items", { count: 5 }) → "5 items"
Dates: Intl.DateTimeFormat(locale)
Numbers: Intl.NumberFormat(locale)
</formatting>

Build dashboard fully translated in 3 languages. Show RTL for Arabic.`,
    tags: ["i18n", "Multi-Language", "RTL", "Localization"],
  },
  {
    id: 86,
    category: "components",
    title: "Feature Flag Management Dashboard",
    description:
      "Interface for managing feature flags with toggle controls, targeting rules, rollout percentages, and activity logs.",
    prompt: `<task>Build a feature flag management dashboard.</task>

<list>
<Table>: Flag Name, Status <Switch>, Environment <Badge>, Rollout %, Modified. Search + filter.
</list>

<detail_sheet>
Name + description (editable). Key: feature_new_dashboard (copyable, not editable).
Master <Switch>. Environment overrides: Dev/Staging/Production separate toggles.
</detail_sheet>

<targeting>
"All users", "Percentage" <Slider> 0-100%, "Segment" <Select> (Beta/Premium/Internal),
"Individual users" <Input>. Rule builder: AND/OR conditions.
</targeting>

<rollout>
Gradual: increase on schedule. A/B: 50/50 with metrics. Kill switch: instant disable with <AlertDialog>.
</rollout>

<activity>
Timeline of changes: who, what, when. "Revert" option.
</activity>

<stats>
Total: active/disabled/stale (>90 days). <PieChart>. Stale warnings.
</stats>

10 sample flags with varied states.`,
    tags: ["Feature Flags", "Toggles", "Targeting", "Rollout"],
  },
  {
    id: 87,
    category: "data",
    title: "Data Import Wizard with Mapping",
    description:
      "CSV/JSON import with column mapping, auto-matching, data preview, validation, and conflict resolution.",
    prompt: `<task>Build a data import wizard with column mapping.</task>

<step_1>File Upload:
Drag-drop for CSV/JSON. Parse client-side (FileReader). Show: name, size, rows, columns. Auto-detect delimiter.
</step_1>

<step_2>Column Mapping:
Left: source columns. Right: target fields. Drag-drop or <Select> to map.
Auto-match by similar names. Show sample values (first 3 rows). Required targets highlighted. "Ignore" option.
</step_2>

<step_3>Preview & Validation:
<Table> first 20 rows with mapped names. Red highlight on invalid cells.
Error summary: "12 errors in 247 rows". Toggle: "Show only errors". "Fix" per error.
</step_3>

<step_4>Import:
"Skip errors" or "Import all". Duplicates: <RadioGroup> Skip/Overwrite/Create.
<Progress> "Importing 150 of 247..." Cancel. Summary: imported/skipped/errors. Download error CSV.
</step_4>

Sample CSV (30 rows) with intentional errors for demo.`,
    tags: ["Data Import", "CSV", "Column Mapping", "Wizard"],
  },
  {
    id: 88,
    category: "interactions",
    title: "Multi-Select Tag Input — Autocomplete",
    description:
      "Tag input field with autocomplete suggestions, keyboard navigation, duplicate prevention, and create-new support.",
    prompt: `<task>Build a multi-select tag input with autocomplete.</task>

<props>
interface TagInputProps {
  value: string[]; onChange: (tags: string[]) => void;
  suggestions: string[]; placeholder?; maxTags?; allowCustom?;
}
</props>

<visual>
Container styled like <Input> with <Badge> pills (X remove) + text input at end.
Dropdown suggestions below.
</visual>

<behavior>
Type → filter suggestions (fuzzy). ArrowUp/Down navigate. Enter selects.
Comma or Tab adds typed text. Backspace removes last tag. Click suggestion adds.
</behavior>

<dropdown>
Appears on focus or after 1+ chars. Highlighted matching chars.
"Create '[text]'" at bottom if allowCustom. Keyboard navigable. Close on Escape.
</dropdown>

<validation>
Duplicate prevention (case-insensitive). Max tags with toast. Min 2 chars. Invalid char prevention.
</validation>

Suggestions: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Node.js", "Python", "Design", "AI/ML"]
Demo in form context with label + error message.`,
    tags: ["Tag Input", "Multi-Select", "Autocomplete", "Form"],
  },
  {
    id: 89,
    category: "components",
    title: "Settings Page — Section Navigation",
    description:
      "Organized settings with sticky sidebar navigation, scroll-spy highlighting, per-section save, and dirty tracking.",
    prompt: `<task>Build a comprehensive settings page with section navigation.</task>

<layout>
Left: sticky sidebar navigation. Right: scrollable sections.
</layout>

<sections>
1. Profile — Avatar, name, email, bio
2. Notifications — Email/push/in-app <Switch> toggles
3. Appearance — Theme, density, sidebar position
4. Privacy — Data sharing, analytics, visibility
5. Security — Password, 2FA, sessions
6. Billing — Plan, payment, invoices
7. Integrations — Connected services
8. Advanced — Export data, delete account
</sections>

<navigation>
Highlight active section via IntersectionObserver. Click → smooth scroll. Sticky.
</navigation>

<section_pattern>
<Card> with <CardHeader> title + description, <CardContent> form fields,
<CardFooter> Reset + Save buttons.
</section_pattern>

<controls>
<Input>, <Textarea>, <Select>, <Switch>, <RadioGroup>, <Slider>, <Avatar>, <Checkbox>
</controls>

Independent save per section. Toast on save. Dirty tracking — enable "Save" only when changed.
"Unsaved changes" warning on navigation.`,
    tags: [
      "Settings",
      "Preferences",
      "Section Nav",
      "Scroll Spy",
    ],
  },
  {
    id: 90,
    category: "integration",
    title: "Stripe-Style Payment Form",
    description:
      "Clean checkout form with card input, brand detection, billing address, order summary — ready for payment processor integration.",
    prompt: `<task>Build a Stripe-inspired payment form UI.</task>

<layout>
Left (60%): payment form. Right (40%): sticky order summary.
</layout>

<order_summary>
Product list (name, qty, price, total). Subtotal. Tax. Discount code <Input> + "Apply". Total (bold). Secure badges.
</order_summary>

<form>
1. Contact: Email, Phone (optional)
2. Shipping: Name, Address 1&2, City, State <Select>, ZIP, Country. "Same as billing" <Checkbox>.
3. Payment: <RadioGroup> Credit card / PayPal / Apple Pay.
   Card: number (brand detection: 4xxx=Visa, 5xxx=MC), Expiry MM/YY (auto-format), CVC (3 digits, 4 Amex), Name.
   Card number formatting: groups of 4.
4. Billing: toggle "Same as shipping" or separate.
</form>

<cta>
"Pay $99.00" <Button> full width with Lock icon.
</cta>

<validation>
Luhn algorithm for card number. Future expiry. CVC length. Required fields.
</validation>

<note>UI only. Connect to payment processor for real transactions.</note>`,
    tags: ["Payment", "Checkout", "Stripe", "E-Commerce"],
  },
  {
    id: 91,
    category: "ai-patterns",
    title: "AI Image Generation Interface",
    description:
      "Prompt-to-image generation UI with style controls, aspect ratios, generation history, and gallery management.",
    prompt: `<task>Build an AI image generation interface (uses unsplash_tool for placeholder results).</task>

<prompt_area>
Large <Textarea>. "Enhance prompt" button. Character count. "Generate" (primary). "Surprise me" (random prompt).
</prompt_area>

<controls>
Style <Select>: Photorealistic, Digital Art, Oil Painting, Watercolor, 3D Render, Anime, Sketch
Aspect <ToggleGroup>: 1:1, 16:9, 9:16, 4:3
Quality <RadioGroup>: Draft (fast), Standard, HD
Count <ToggleGroup>: 1, 2, 4
Negative prompt <Input>. Seed <Input>.
</controls>

<generation>
1. Enter prompt + settings → Generate
2. Shimmer loading grid (2-4s simulated delay)
3. Reveal: unsplash_tool images matching prompt keywords
</generation>

<results>
Click → lightbox. Per image: Download, Upscale, Variations, Favorite, Use as reference.
</results>

<history>
Sidebar: past generations. Thumbnail grid. Click → restore prompt + settings. Delete + filter.
</history>

<library>
Pre-built creative prompts: Art, Photography, Concept Art, Product, Architecture.
</library>`,
    tags: ["AI Image", "Generation", "Creative", "Gallery"],
  },
  {
    id: 92,
    category: "advanced",
    title: "Interactive Data Flow Diagram",
    description:
      "Visual node-based diagram editor for data flows and system architecture with connection lines and export.",
    prompt: `<task>Build an interactive node-based diagram editor.</task>

<canvas>
Scrollable dot grid. Zoom: Ctrl+scroll (50-200%). Pan: Space+drag. Minimap bottom-right.
</canvas>

<node_types>
Start/End (rounded, green/red), Process (rectangle, blue), Decision (diamond, amber),
Data (parallelogram, purple), Database (cylinder, gray)
</node_types>

<node>
Title (editable double-click). Input ports (left circles). Output ports (right circles).
Drag to move. Click to select (resize handles). Right-click: Edit, Duplicate, Delete.
</node>

<connections>
Click output → drag to input → bezier curve with arrow. Click to select/delete.
Optional connection labels.
</connections>

<palette>
Left sidebar: drag nodes from palette. Grouped by type with icons. Search.
</palette>

<properties>
Right sidebar on node select: title, description, color, size, connection list.
</properties>

<toolbar>
Select, Add node, Text label, Zoom controls, Undo/Redo, Export PNG/JSON, "Auto-layout".
</toolbar>

Absolute positioning + SVG connections. react-dnd for drag.
Sample: User signup flow with 8 nodes.`,
    tags: ["Diagram", "Flow Chart", "Nodes", "Visual Editor"],
  },
  {
    id: 93,
    category: "components",
    title: "Comparison & Diff Viewer",
    description:
      "Side-by-side and inline diff viewer for comparing text, code, or configurations with change highlighting.",
    prompt: `<task>Build a comparison and diff viewer.</task>

<modes>
<ToggleGroup>: Side-by-Side (2 columns), Inline (single, insertions green/deletions red), Unified (git diff format)
</modes>

<diff>
Line-by-line comparison:
function computeDiff(oldText, newText): DiffLine[]
// Returns { type: "added"|"removed"|"unchanged", content }
</diff>

<highlighting>
Added: bg-green-50 border-l-4 border-green-500, + prefix
Removed: bg-red-50 border-l-4 border-red-500, - prefix
Changed: highlight changed characters within line
Line numbers on both sides.
</highlighting>

<controls>
Prev/Next change navigation. "N changes" counter.
Collapse unchanged ("... 15 unchanged lines ..." expander).
Whitespace toggle. Case sensitivity toggle.
</controls>

<input>
Two <Textarea>: "Original" + "Modified". "Compare" button. Pre-loaded example. "Swap sides".
</input>

<demos>
Code diff (JS), Text diff (paragraph), Config diff (JSON).
</demos>

"Copy changes only" extracts added/modified content.`,
    tags: [
      "Diff Viewer",
      "Comparison",
      "Code Review",
      "Changes",
    ],
  },
  {
    id: 94,
    category: "foundation",
    title: "Error Boundary & Fallback UI System",
    description:
      "Comprehensive error handling with React Error Boundaries, multiple fallback levels, and error reporting.",
    prompt: `<task>Build error handling with Error Boundaries and fallback UIs.</task>

<boundary>
/components/error-boundary.tsx:
class ErrorBoundary extends React.Component { getDerivedStateFromError, componentDidCatch }
withErrorBoundary HOC wrapper.
</boundary>

<fallback_levels>
1. Page-Level: Full page, illustration, "Something went wrong", error message, "Try again" + "Go home" + "Report issue".
2. Component-Level: Card-sized, AlertTriangle + "Failed to load" + "Retry". Doesn't break layout.
3. Inline: Subtle message + "Retry" link replacing failed content.
</fallback_levels>

<error_types>
Render → Error Boundary. Async → try/catch + state. Network → offline + retry.
404 → Not found page. Permission → Access denied.
</error_types>

<reporting_modal>
"Report issue" link → <Dialog>: auto-filled error, stack trace, browser, URL.
User adds description. "Send Report" (simulated).
</reporting_modal>

Demo with buttons triggering each error type.`,
    tags: [
      "Error Boundary",
      "Fallback UI",
      "Error Handling",
      "Resilience",
    ],
  },
  {
    id: 95,
    category: "advanced",
    title: "Onboarding & Product Tour System",
    description:
      "Step-by-step product tour with spotlight highlights, tooltip guides, hotspot indicators, and completion tracking.",
    prompt: `<task>Build a product tour and onboarding system.</task>

<tour_engine>
/components/tour/tour-provider.tsx:
interface TourStep { target: string (CSS selector), title, description, placement, action?, nextLabel? }
</tour_engine>

<spotlight>
Full-page dark overlay (bg-black/60). Cutout around target (CSS clip-path/mask).
Target appears above overlay. Smooth transition between steps.
</spotlight>

<tooltip_guide>
Near target: title + description. "3 of 7" + <Progress>.
Previous/Next buttons. "Skip tour" link. Arrow pointing to target.
</tooltip_guide>

<hotspots>
Pulsing dots on interactive elements. Click → mini-tour. Dismiss individually or all.
</hotspots>

<tours>
Tour 1 — First Visit (5 steps): Welcome modal → nav → search → content → profile → "All set!"
Tour 2 — Feature Discovery (3 steps): New feature highlight → tooltip → try it.
</tours>

<persistence>
Track completed in localStorage. Don't repeat. "Restart tour" in help. Track drop-off step.
</persistence>

Build with sample dashboard and both tours.`,
    tags: ["Onboarding", "Product Tour", "Spotlight", "Guide"],
  },
  {
    id: 96,
    category: "design",
    title: "Responsive Layout Pattern Library",
    description:
      "Visual reference guide with 7 layout patterns: Holy Grail, dashboard grid, blog, card grids, split screen, and sticky sections.",
    prompt: `<task>Build a responsive layout pattern library using Tailwind Grid + Flexbox.</task>

<patterns>
1. Holy Grail: Header (sticky) + Sidebar + Main + Right Panel + Footer. Mobile: stack, sidebar → <Sheet>.
2. Dashboard Grid: 4 KPI top, 2/3+1/3 charts below, full table bottom. grid-cols-12.
3. Blog: Narrow content (max-w-prose centered), sticky TOC sidebar, full-bleed images.
4. Card Grids: Equal columns (1→2→3→4), featured first card spanning 2, masonry.
5. Split Screen: 50/50 image+content, 40/60 nav+main, alternating swap rows.
6. Sticky Sections: Header with scroll shadow, sidebar nav, table header, footer CTA.
7. Container Queries: Components responding to parent width, card horizontal/vertical switch.
</patterns>

<per_pattern>
- Live rendered example
- Tailwind class breakdown
- Mobile/tablet/desktop preview toggle
- Copy code button
</per_pattern>

All 7 on a single scrollable page.`,
    tags: [
      "Grid",
      "Layout",
      "Responsive",
      "Flexbox",
      "Patterns",
    ],
  },
  {
    id: 97,
    category: "ai-patterns",
    title: "AI Agent Task Dashboard — Claude 4.6",
    description:
      "Monitor autonomous AI agents executing multi-step tasks with status tracking, intervention controls, and real-time logs.",
    prompt: `<task>Build an AI agent task monitoring dashboard for Claude 4.6 agents.</task>

<agent_cards>
Per agent: name + role <Badge>, current task, status (Thinking/Executing/Waiting/Complete/Error),
progress step N of M <Progress>, runtime, Pause/Resume/Stop buttons.
</agent_cards>

<task_detail>
<Sheet> or expanded card:
Step Timeline (vertical): number + title + status icon (Check/Loader2/Circle/XCircle) + duration.
Expand each step:
- Input: what agent received
- Reasoning: thought process (quote block — maps to Claude 4.6 extended thinking)
- Action: tool called / operation performed
- Output: result produced
</task_detail>

<intervention>
"Approve" on confirmation steps. "Edit & Retry" — modify input, re-execute.
"Skip Step". "Provide Input" — additional context. "Override Output" — manually set result.
</intervention>

<logs>
Real-time scrolling. Color-coded: INFO (gray), ACTION (blue), RESULT (green), ERROR (red), THINKING (purple).
Timestamps. Search. Auto-scroll toggle.
</logs>

<stats>
Total tasks: completed/in-progress/failed. Average time. Success rate <Progress>.
<AreaChart> throughput over time.
</stats>

Simulate 3 agents running multi-step tasks with progressive updates.`,
    tags: [
      "AI Agents",
      "Claude 4.6",
      "Task Monitor",
      "Autonomous",
    ],
  },
  {
    id: 98,
    category: "integration",
    title: "Database Schema Visualizer — Supabase",
    description:
      "Interactive schema viewer with table cards, relationship lines, SQL preview, and TypeScript interface generation.",
    prompt: `<task>Build an interactive database schema visualizer.</task>

<overview>
Grid of table cards connected by relationship lines.
Each card: table name header, column list (name, type <Badge>, constraints: PK/FK/NOT NULL/UNIQUE),
Key icon on PKs, link icon on FKs → target table, row count.
</overview>

<detail_sheet>
Full columns: name, data type (text/integer/boolean/timestamp/uuid/jsonb),
constraints <Badge>, default value, description. Indexes. Relationships list.
Sample data <Table> (5 rows).
</detail_sheet>

<relationships>
SVG lines: solid (required), dashed (optional). Labels: 1:1, 1:N, N:N.
Hover: highlight both tables. Click: relationship details.
</relationships>

<features>
Drag tables to rearrange. Zoom + pan. Search tables/columns.
"Generate SQL" → CREATE TABLE. "Generate TypeScript" → interface definition.
</features>

<sql_preview>
SELECT, INSERT, UPDATE, DELETE templates. JOIN queries. Copy to clipboard.
</sql_preview>

Sample: Users, Projects, Tasks, Comments, Tags tables with relationships.`,
    tags: ["Database", "Schema", "ERD", "SQL", "Supabase"],
  },
  {
    id: 99,
    category: "advanced",
    title: "Accessibility Audit Dashboard",
    description:
      "Interactive accessibility checker with WCAG criteria, severity scoring, fix suggestions, and exportable reports.",
    prompt: `<task>Build an accessibility audit dashboard.</task>

<checks>
1. Images without alt text
2. Low contrast text (calculate ratio)
3. Missing form labels
4. Empty links/buttons
5. Heading hierarchy gaps
6. Missing lang attribute
7. tabindex > 0 (keyboard traps)
8. Missing ARIA labels
9. Auto-playing media
10. Missing skip navigation
</checks>

<score_card>
Overall: 85/100 circular progress ring. Grade: A-F color-coded.
By severity: Critical (red), Serious (orange), Moderate (yellow), Minor (blue).
</score_card>

<issues_list>
Grouped by severity. Each: rule name + WCAG criterion (e.g. "1.1.1 Non-text Content"),
element selector (click to highlight), description, "How to fix" expandable + code example,
"Fixed" checkbox, impact <Badge>.
</issues_list>

<fix_suggestions>
Before/after code. Auto-fix button where possible. WCAG documentation link.
</fix_suggestions>

<summary>
<BarChart> by category (images, forms, nav, content). "Export report" Markdown/PDF.
</summary>

Run audit against sample page. Display realistic results.`,
    tags: ["Accessibility", "Audit", "WCAG", "A11y", "Testing"],
  },
  {
    id: 100,
    category: "advanced",
    title: "The Ultimate Figma Make Prompt — Claude 4.6",
    description:
      "Master prompt template optimized for Claude 4.6's extended thinking and Figma Make's agentic capabilities.",
    prompt: `Use this master template for maximum quality output from Claude 4.6 in Figma Make. Fill in [brackets].

<goal>[Describe the application/page in one sentence]</goal>

<user>[Who will use this? Technical level and context.]</user>

<structure>
Layout: [Overall arrangement]
- Header: [contents]
- Main: [sections]
- Secondary: [sidebar/panels if any]
- Footer: [if applicable]

Responsive:
- Mobile (375px): [behavior]
- Tablet (768px): [behavior]
- Desktop (1440px): [behavior]
</structure>

<components>
shadcn/ui: [Card, Table, Dialog, Sheet, Tabs, etc.]
Icons: lucide-react — [list key icons]
Charts: recharts — [if applicable]
Animation: motion/react — [if applicable]
</components>

<data>
Model: [Define interface/type]
Sample: [How many items, what variety]
State: [useState / useReducer / Context]
</data>

<interactions>
1. [User action → result]
2. [User action → result]
3. [User action → result]

Feedback:
- Loading: [skeleton / spinner]
- Success: [toast / animation]
- Error: [alert / retry]
- Empty: [illustration / CTA]
</interactions>

<style>
Theme: [Light / Dark / Both]
Mood: [Professional / Playful / Minimal / Bold]
Accent: [color or "defaults"]
Effects: [glass / gradients / animations / none]
</style>

<quality>
- TypeScript strict types
- Responsive all breakpoints
- Keyboard accessible + screen reader friendly
- React.memo + useMemo where needed
- Use unsplash_tool for realistic images
- Split into /components/ files
</quality>

<agent_instructions>
- Use extended thinking for complex layout decisions
- Create multiple component files in parallel
- Call unsplash_tool for photos
- Suggest supabase_connect if persistence needed
</agent_instructions>`,
    tags: [
      "Master Template",
      "Claude 4.6",
      "Agent",
      "Ultimate",
    ],
  },
];