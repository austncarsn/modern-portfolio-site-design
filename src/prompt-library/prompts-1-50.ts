import type { Prompt } from "./prompt-data";

export const promptsSet1: Prompt[] = [
  // ── FOUNDATION (1–10) ──────────────────────────────────────────────
  {
    id: 1,
    category: "foundation",
    title: "Adaptive MVP Dashboard — Claude 4.6 Agentic Build",
    description:
      "Leverage Claude 4.6's extended thinking and agentic tool use to build a production-ready responsive dashboard in a single pass.",
    prompt: `<role>You are a senior frontend architect working inside Figma Make, powered by Claude 4.6.</role>

<task>Build a responsive MVP dashboard for [product name] using React + Tailwind CSS v4 + shadcn/ui.</task>

<context>
- Primary interface where users [main action]
- Target audience: [user type] who need [core need]
- This is the application entry point
</context>

<structure>
Header: Logo, Command-K search (<Command> from shadcn), <Avatar> <DropdownMenu>
Sidebar: 5 sections — Dashboard, Analytics, Projects, Team, Settings — <Button variant="ghost"> with lucide-react icons
Main: 3 KPI <Card> components with <Badge> status indicators
Activity: <ScrollArea> with last 10 items
Actions: Quick action buttons for [primary actions]
</structure>

<responsive_behavior>
Mobile (<768px): Sidebar collapses to <Sheet> drawer. KPI cards stack. Quick actions become fixed bottom bar.
Tablet (768px): 2-column KPI grid. Sidebar remains as <Sheet>.
Desktop (1440px): Full sidebar visible. grid-cols-3 KPIs. All features active.
</responsive_behavior>

<constraints>
- Use shadcn/ui from /components/ui/ exclusively
- Icons from lucide-react only — no other icon packages
- Tailwind classes only — no inline styles or external CSS
- React.memo on presentational components, useMemo on filtered data
- Split into /components/ files: header, sidebar, kpi-card, activity-feed
</constraints>`,
    tags: [
      "Claude 4.6",
      "Agentic",
      "Dashboard",
      "shadcn/ui",
      "MVP",
    ],
  },
  {
    id: 2,
    category: "foundation",
    title:
      "Figma Frame → Interactive Prototype (Vision + Agent)",
    description:
      "Use Claude 4.6's vision analysis and Figma Make's asset pipeline to transform imported frames into pixel-perfect interactive React.",
    prompt: `[Paste your Figma frame here — Claude 4.6 will analyze the visual structure]

<task>Convert this Figma design into a fully interactive React + Tailwind prototype.</task>

<agent_instructions>
1. Read all files in /imports/ to discover available SVGs and assets
2. Use every figma:asset/ image and /imports/svg-* file — do not create substitutes
3. Use <ImageWithFallback> from /components/figma/ImageWithFallback.tsx for any NEW images only
4. Call unsplash_tool for any photos not provided by the Figma import
</agent_instructions>

<conversion_process>
Step 1 — Structural Analysis:
- Map Auto Layout groups → Tailwind flex/grid
- Identify repeated patterns → create /components/ files
- Translate Figma constraints → responsive breakpoints
- Extract spacing to Tailwind's 4px-based scale

Step 2 — Token Extraction:
- Colors → Tailwind-compatible hex values
- Font sizes → Tailwind type scale equivalents
- Border radii and shadows → utility classes

Step 3 — Build Outside-In:
- Start from outermost container, work inward
- Create separate component files for repeated patterns
- Preserve EXACT visual fidelity — spacing, alignment, proportions

Step 4 — Add Interactivity:
- Clickable elements → onClick handlers + hover states
- Forms → controlled state with useState
- Navigation → state-based view switching
- Entrances → motion/react fade + slide animations
</conversion_process>

<constraint>Use ALL imported assets. Never create placeholder content when Figma assets exist.</constraint>`,
    tags: [
      "Figma",
      "Vision",
      "Design Fidelity",
      "Asset Pipeline",
      "Agent",
    ],
  },
  {
    id: 3,
    category: "foundation",
    title: "Multi-View SPA with State Routing",
    description:
      "Build a multi-page app using React state for routing — no external router — with animated transitions between views.",
    prompt: `<task>Create a multi-view single-page application with state-based routing and animated transitions.</task>

<architecture>
Routing:
- useState<string> for current route
- Hash-based URLs via useEffect + window.hashchange
- Custom useRoute() hook: { route, navigate, goBack }

Views (separate component files):
1. /components/views/home.tsx — Hero, feature cards, testimonials
2. /components/views/dashboard.tsx — KPI cards, recharts charts, activity feed
3. /components/views/detail.tsx — Individual item with shadcn <Tabs>
4. /components/views/settings.tsx — Forms with <Switch>, <Select>, <Input>
5. /components/views/not-found.tsx — 404 with illustration
</architecture>

<navigation>
- Persistent <header> with active state via conditional classes
- Mobile: <Sheet> drawer navigation
- <Breadcrumb> for nested views
- AnimatePresence from motion/react for page transitions:
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
</navigation>

<state_persistence>
- Active view stored in URL hash (#/dashboard)
- Scroll position preserved per view via useRef
- Form data persists across navigations with lifted state
</state_persistence>

Build the routing system first, then populate each view.`,
    tags: [
      "SPA",
      "Routing",
      "Views",
      "Motion",
      "Hash Navigation",
    ],
  },
  {
    id: 4,
    category: "foundation",
    title: "Design Token Architecture — Tailwind v4",
    description:
      "Extract a systematic design token library and generate Tailwind CSS v4 compatible custom properties for a scalable design system.",
    prompt: `<task>Build a comprehensive design token system for Tailwind CSS v4 in /styles/globals.css.</task>

<tokens>
Colors (CSS custom properties in :root):
--color-brand-50 through --color-brand-900 (generate a cohesive palette)
--color-surface-{base,raised,overlay}
--color-text-{primary,secondary,muted,inverse}
--color-border-{default,subtle,strong}
--color-status-{success,warning,error,info} with -foreground variants

Typography:
--font-display, --font-body, --font-mono
Fluid sizing: --text-xs through --text-4xl using clamp() for responsive scaling

Spacing: --space-1 (4px) through --space-16 (64px)
Radius: --radius-sm (4px) through --radius-full (9999px)
Shadow: --shadow-sm through --shadow-2xl
</tokens>

<component_library>
Build these as /components/ files using the tokens:
- Button: primary, secondary, outline, ghost, destructive variants
- Input: default, with-icon, with-addon, error state
- Card: default, interactive (hover lift), bordered
- Badge: solid, outline, dot indicator
Each accepts variant + size props.
</component_library>

<showcase>
Create /components/design-system-showcase.tsx:
- Color palette grid showing all tokens
- Typography scale with all sizes
- Spacing visualization
- Component variant matrix
</showcase>

Do NOT modify existing tokens in globals.css — add new ones alongside.`,
    tags: [
      "Design Tokens",
      "Tailwind v4",
      "CSS Variables",
      "System",
    ],
  },
  {
    id: 5,
    category: "foundation",
    title: "WCAG 2.1 AA Accessible Foundation",
    description:
      "Build accessibility-first with proper ARIA, keyboard navigation, screen reader support, and shadcn/ui's built-in a11y features.",
    prompt: `<task>Create an accessibility-first application foundation meeting WCAG 2.1 AA.</task>

<shadcn_handles_automatically>
- <Dialog> — focus trap, aria-modal, Escape close
- <DropdownMenu> — arrow key nav, typeahead
- <Select> — keyboard accessible, screen reader labels
- <Tabs> — arrow key switching, proper roles
- <Tooltip> — aria-describedby, keyboard trigger
</shadcn_handles_automatically>

<implement_manually>
Semantic HTML:
- One <h1> per view, proper heading hierarchy
- <nav>, <main>, <aside>, <footer> landmarks
- Skip navigation link as first focusable element
- <button> for actions, <a> for navigation — never interchange

Keyboard:
- All interactive elements reachable via Tab
- Focus ring: ring-2 ring-offset-2 ring-[brand-color]
- Return focus after modal/drawer close
- Roving tabindex for toolbar patterns

Screen Reader:
- aria-live="polite" for dynamic content
- aria-label on icon-only buttons
- Announce route changes via aria-live region
- Form errors linked with aria-describedby

Visual:
- Minimum 4.5:1 contrast ratio on all text
- Never rely solely on color — use icons + text + color
- Respect prefers-reduced-motion — disable animations
- Support 200% text zoom without layout break
</implement_manually>

Build a sample page demonstrating all patterns with an audit checklist component.`,
    tags: [
      "Accessibility",
      "WCAG",
      "ARIA",
      "Keyboard Nav",
      "Inclusive",
    ],
  },
  {
    id: 6,
    category: "foundation",
    title: "Performance-Optimized React Architecture",
    description:
      "High-performance patterns: memoization, lazy loading, virtual scrolling, and efficient rendering for Claude 4.6 generated apps.",
    prompt: `<task>Build a performance-optimized React architecture.</task>

<react_performance>
- React.memo() on all presentational components
- useMemo() for filtering, sorting, derived data
- useCallback() for handlers passed to children
- Never create objects/arrays inline in JSX props
- Use stable unique IDs as keys, never array indices
</react_performance>

<component_architecture>
Split into /components/layout/, /components/ui/, /components/features/
- Colocate state as low as possible
- Lift state only when siblings share it
- Composition over prop drilling
</component_architecture>

<rendering>
- Virtualize lists with 100+ items using windowing
- Lazy load below-fold content with IntersectionObserver
- <Skeleton> from shadcn for async content
- Debounce search inputs (300ms)
- Throttle scroll handlers (16ms = 60fps)
</rendering>

<images>
- <ImageWithFallback> with explicit width/height (prevent CLS)
- loading="lazy" on below-fold images
- Use unsplash_tool URL params for responsive sizing (?w=400&q=80)
</images>

<css>
- Tailwind utilities over dynamic style objects
- transform + opacity for animations (GPU-accelerated)
- Avoid layout-triggering properties in animations
</css>

Build a demo dashboard with 200+ items demonstrating all patterns.`,
    tags: [
      "Performance",
      "React.memo",
      "Lazy Load",
      "Virtualization",
    ],
  },
  {
    id: 7,
    category: "foundation",
    title: "Mobile-First Progressive Enhancement",
    description:
      "Build from mobile upward with touch targets, progressive feature layers, and Tailwind's responsive prefix system.",
    prompt: `<task>Create a mobile-first application using Tailwind's responsive prefix system.</task>

<mobile_base>
Default (no prefix):
- flex flex-col single column
- Touch targets: min-h-[44px] min-w-[44px] on all interactive elements
- Bottom navigation bar with 4-5 icons (lucide-react)
- Full-width cards and inputs
- <Sheet> for navigation drawer
- No hover-dependent interactions
</mobile_base>

<tablet_layer>
md: prefix:
- md:grid md:grid-cols-2 layouts
- md:flex side navigation
- md:p-8 md:gap-6 spacing increase
</tablet_layer>

<desktop_layer>
lg: and xl: prefixes:
- lg:grid-cols-3 xl:grid-cols-4 multi-column
- lg:flex persistent sidebar
- Hover states: lg:hover:shadow-lg lg:hover:-translate-y-0.5
- <Tooltip> (hover-dependent — desktop only)
- Keyboard shortcuts active
</desktop_layer>

<touch>
- Swipe gestures via touch events for mobile nav
- Pull-to-refresh pattern
- Long press for context actions
- Smooth momentum scrolling
</touch>

Use Tailwind container queries where elements respond to parent, not viewport.`,
    tags: [
      "Mobile-First",
      "Responsive",
      "Touch",
      "Progressive",
    ],
  },
  {
    id: 8,
    category: "foundation",
    title: "Dark/Light Theme — Tailwind v4 System",
    description:
      "Complete theme system using Tailwind CSS v4's @custom-variant dark and CSS custom properties with smooth transitions.",
    prompt: `<task>Create a dark/light theme system using the Tailwind v4 setup in /styles/globals.css.</task>

<context>The project has @custom-variant dark (&:is(.dark *)) already configured.</context>

<implementation>
1. Define palettes in :root and .dark in globals.css (semantic token names)
2. Toggle .dark class on <html>
3. Theme Provider (/components/theme-provider.tsx):
   - Check localStorage on mount → fall back to prefers-color-scheme
   - Expose toggleTheme() + theme via React context
   - Persist to localStorage
   - Update <meta name="theme-color">

Usage: bg-background, text-foreground, text-muted-foreground, bg-card, border-border

Toggle Component:
- Sun/Moon icons (lucide-react) with rotation animation
- motion/react AnimatePresence for icon swap

Dark Mode Rules:
- Reduce shadow intensity (use ring-* for elevation)
- Slightly desaturate brand colors
- Never pure white text — use off-white foreground token
- Increase border visibility slightly
- transition-colors duration-200 on body for smooth switch
</implementation>`,
    tags: [
      "Dark Mode",
      "Theming",
      "Tailwind v4",
      "CSS Variables",
    ],
  },
  {
    id: 9,
    category: "foundation",
    title: "Collaborative UI Foundation",
    description:
      "Build the front-end for a collaborative app with presence indicators, simulated live cursors, and real-time activity feeds.",
    prompt: `<task>Build a collaborative application UI with simulated real-time features.</task>

<presence>
- <AvatarStack> showing online users (shadcn <Avatar>)
- Green/yellow/gray dots for online/idle/offline
- "3 others viewing" when >5 users
- Enter/exit animations with motion/react
</presence>

<live_cursors>
- Colored cursor components with user name labels
- Smooth position interpolation via CSS transforms
- Auto-hide after 3s inactivity
- Unique color per user from predefined palette
</live_cursors>

<activity_feed>
- <ScrollArea> with timestamped actions
- Group by time: "2 minutes ago", "1 hour ago"
- Pulse animation on new items (animate-pulse)
- "New activity" indicator when scrolled away
</activity_feed>

<conflict_ui>
- <AlertDialog> for simultaneous edit conflicts
- Diff view: "Your version" vs "Their version"
- Accept/reject/merge options
- Auto-save indicator with <Badge variant="outline">
</conflict_ui>

<connection_status>
- Connected (green), Reconnecting (amber), Offline (red) <Badge>
- Simulated reconnection with exponential backoff
</connection_status>

State: React Context + useReducer for shared state simulation.`,
    tags: ["Collaborative", "Real-time", "Presence", "Cursors"],
  },
  {
    id: 10,
    category: "foundation",
    title: "Form-Heavy App with Validation Engine",
    description:
      "Optimized form architecture with multi-step wizards, Zod validation, auto-save, and shadcn/ui form primitives.",
    prompt: `<task>Create a form-heavy application using shadcn/ui form components + react-hook-form@7.55.0.</task>

<components>
<Form>, <FormField>, <FormItem>, <FormLabel>, <FormControl>, <FormMessage>
<Input>, <Textarea>, <Select>, <Checkbox>, <RadioGroup>, <Switch>
<Calendar> with <Popover> trigger for dates
</components>

<wizard>
4-step form with <Progress> bar:
Step 1: Personal Info — name, email, phone
Step 2: Address — street, city, state <Select>, zip
Step 3: Preferences — <Checkbox> group, <RadioGroup>, <Switch> toggles
Step 4: Review — read-only summary with "Edit" links back to steps
</wizard>

<validation>
- Zod schema per step
- mode: "onBlur" for real-time validation
- Inline errors via <FormMessage>
- Disable "Next" until current step validates
- Cross-field: confirm email match
- Async: email uniqueness check (simulated 500ms)
</validation>

<auto_save>
- Debounced localStorage save every 10 seconds
- "Draft saved" indicator with timestamp
- Resume from last step on reload
- "Discard draft" option
- beforeunload warning for unsaved changes
</auto_save>

<ux>
- <Tooltip> hints on complex fields
- Character counter on limited fields
- Required field asterisks
- motion/react slide transitions between steps
- Success celebration on submit
</ux>`,
    tags: [
      "Forms",
      "Zod",
      "react-hook-form",
      "Wizard",
      "Validation",
    ],
  },

  // ── COMPONENTS (11–20) ─────────────────────────────────────────────
  {
    id: 11,
    category: "components",
    title: "Enterprise Data Table — shadcn/ui",
    description:
      "Feature-rich data table with sorting, filtering, pagination, row selection, and responsive card fallback.",
    prompt: `<task>Build an enterprise data table using shadcn/ui <Table> components.</task>

<structure>
<Table>, <TableHeader>, <TableBody>, <TableRow>, <TableHead>, <TableCell>
Wrap in <Card> with title header and action buttons.
</structure>

<features>
1. Sorting: Click <TableHead> → toggle asc/desc/none. <ArrowUpDown> icon. Multi-column with Shift+click.
2. Filtering: <Input> per column (debounced 300ms). <DropdownMenu> for filter types.
3. Pagination: <Pagination> component. Items per page <Select> [10, 25, 50, 100]. "Showing 1-10 of 247".
4. Row Selection: <Checkbox> per row + select all. Selected count in toolbar. Bulk <DropdownMenu>.
5. Responsive: On mobile, transform to card layout — each row becomes a <Card> with label:value pairs.
6. States: <Skeleton> rows while loading. Empty state with CTA. Error state with retry.
</features>

<data>
Generate 100 rows of product inventory:
{ id, name, sku, category, price, stock, status: "In Stock" | "Low Stock" | "Out of Stock" }
</data>

Use useMemo for the filter → sort → paginate pipeline.`,
    tags: [
      "Table",
      "Sorting",
      "Filtering",
      "Pagination",
      "shadcn/ui",
    ],
  },
  {
    id: 12,
    category: "components",
    title: "Rich Text Editor with Toolbar",
    description:
      "Content-editable rich text editor with formatting toolbar, keyboard shortcuts, and export options.",
    prompt: `<task>Build a rich text editor with formatting capabilities.</task>

<toolbar>
Use shadcn <ToggleGroup> and <Toggle>:
- Format: Bold, Italic, Underline, Strikethrough
- Headings: H1, H2, H3
- Lists: Bulleted, Numbered, Checklist
- Insert: Link <Dialog>, Code block, Horizontal rule
- Undo/Redo buttons
- <Separator> between groups
- Sticky on scroll, wraps on mobile
</toolbar>

<editor>
- contentEditable div with min-height, padding, focus ring
- Keyboard: Cmd+B/I/U/Z/Y
- Markdown shortcuts: "# " → H1, "- " → bullet, "1. " → numbered
- Placeholder: "Start writing..."
</editor>

<features>
- Word/character count in footer <Badge>
- Auto-save indicator: "Saved" / "Saving..." / "Unsaved"
- Export: Copy HTML, Copy Markdown, Copy Plain Text
- Focus mode: hides toolbar, adds extra padding
</features>

Style content area with Tailwind prose typography.`,
    tags: [
      "Editor",
      "Rich Text",
      "WYSIWYG",
      "Keyboard Shortcuts",
    ],
  },
  {
    id: 13,
    category: "components",
    title: "File Upload — Drag-Drop & Preview",
    description:
      "Modern file upload zone with drag-and-drop, paste support, image thumbnails, and progress simulation.",
    prompt: `<task>Create a modern file upload component with preview capabilities.</task>

<drop_zone>
- Dashed border area with Upload icon (lucide-react)
- "Drag & drop files here, or click to browse"
- States: default, drag-over (border-solid, scale-[1.01]), uploading, error (border-destructive)
- Accept: images/*, .pdf, .doc, .docx
</drop_zone>

<file_handling>
- Validate type and size on drop
- Generate thumbnails for images (FileReader + canvas)
- File icon for non-images (FileText, FileImage from lucide-react)
- Multiple file support + Ctrl+V paste for clipboard images
</file_handling>

<file_list>
Each file as <Card>:
- Thumbnail or type icon
- File name (editable inline <Input>)
- File size (KB/MB formatted)
- <Progress> bar during upload
- <Badge> status: Uploading, Complete, Error
- Remove with <AlertDialog> confirmation
- Retry for failures
</file_list>

<simulation>
- Progress with setInterval (0-100% over 2-3 seconds)
- 10% random failure chance for error demo
- Stagger multiple uploads
</simulation>`,
    tags: [
      "Upload",
      "Drag-Drop",
      "Preview",
      "Progress",
      "FileReader",
    ],
  },
  {
    id: 14,
    category: "components",
    title: "Modal & Dialog System — shadcn/ui",
    description:
      "Five dialog patterns using shadcn/ui Dialog and AlertDialog with proper focus management and keyboard support.",
    prompt: `<task>Build a comprehensive modal system using shadcn/ui dialogs.</task>

<variants>
1. Confirmation (<AlertDialog>): Icon + title + description. Cancel + Confirm. Destructive variant with red button.

2. Form (<Dialog>): <DialogHeader> title/description. Form with validation. <DialogFooter> Cancel + Submit. Prevent close while submitting.

3. Information (<Dialog>): Rich content with images. Single "Got it" close button.

4. Multi-Step (<Dialog>): Step indicator in header. Next/Back navigation. Validate each step.

5. Fullscreen (<Dialog>): Fullscreen on mobile. Scrollable content. Sticky header/footer.
</variants>

<shadcn_handles>
Focus trap, Escape to close, backdrop click, return focus, aria-modal, scroll lock — all automatic.
</shadcn_handles>

Create a demo page with trigger buttons for all 5 types.`,
    tags: [
      "Dialog",
      "AlertDialog",
      "Modal",
      "Accessibility",
      "shadcn/ui",
    ],
  },
  {
    id: 15,
    category: "components",
    title: "Toast Notifications — Sonner Integration",
    description:
      "Elegant notifications using sonner@2.0.3 with success, error, loading, promise, and custom toast patterns.",
    prompt: `<task>Create a toast notification system using sonner@2.0.3.</task>

Import: import { toast } from "sonner"
Add <Toaster /> from /components/ui/sonner in App.tsx.

<toast_types>
1. toast.success("Saved", { description: "Changes saved." })
2. toast.error("Failed", { description: "File too large.", action: { label: "Retry", onClick: retry } })
3. toast.warning("Limit approaching", { description: "80% storage used." })
4. toast.info("New feature", { description: "Try dark mode." })
5. Loading → Success: const id = toast.loading("Saving..."); toast.success("Done!", { id })
6. Promise: toast.promise(saveData(), { loading: "Saving...", success: "Saved", error: "Failed" })
7. Custom JSX: toast.custom((t) => <CustomCard id={t} />)
8. With undo: toast("Deleted", { action: { label: "Undo", onClick: undo }, duration: 5000 })
</toast_types>

Position: top-right desktop, bottom-center mobile. Use richColors prop.
Build a demo with buttons triggering each type.`,
    tags: [
      "Toast",
      "Sonner",
      "Notifications",
      "Feedback",
      "Patterns",
    ],
  },
  {
    id: 16,
    category: "components",
    title: "Date Range Picker with Presets",
    description:
      "Date range selector using shadcn Calendar and Popover with quick presets and dual calendar navigation.",
    prompt: `<task>Build a date range picker using shadcn/ui <Calendar> and <Popover>.</task>

<trigger>
<Button variant="outline"> showing "Jan 15 — Feb 6, 2026" with Calendar icon.
</trigger>

<popover_content>
Left sidebar — Quick presets:
Today, Yesterday, Last 7/30/90 days, This month, Last month, This quarter, This year, Custom range

Right side — Dual <Calendar> (side by side desktop, stacked mobile):
- mode="range"
- Click first = start, click second = end
- Range highlighted with accent background
- Independent month navigation
- Disable future dates
- Today indicator
</popover_content>

<state>
const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
- Apply/Cancel buttons in footer
- Clear selection button
- Close on Apply
</state>

<ux>
- Keyboard: arrows between dates, Enter to select
- Responsive: presets move to top on mobile
- Format via Intl.DateTimeFormat
</ux>

Integrate with a sample analytics dashboard filtering data by range.`,
    tags: [
      "Date Picker",
      "Calendar",
      "Range",
      "Popover",
      "shadcn/ui",
    ],
  },
  {
    id: 17,
    category: "components",
    title: "Command Palette Search — shadcn/ui",
    description:
      "Intelligent search using shadcn/ui Command with fuzzy matching, categories, keyboard navigation, and recent queries.",
    prompt: `<task>Create a smart search using shadcn/ui <CommandDialog>.</task>

<trigger>
CMD+K global shortcut → setOpen(true)
Also: inline <Command> in a search bar variant.
</trigger>

<structure>
<CommandDialog>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Recent Searches">...</CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Users">
      <CommandItem><Avatar /> Name <span className="text-muted-foreground">email</span></CommandItem>
    </CommandGroup>
    <CommandGroup heading="Projects">...</CommandGroup>
    <CommandGroup heading="Documents">...</CommandGroup>
  </CommandList>
</CommandDialog>
</structure>

<features>
- Built-in fuzzy search (Command handles this)
- Up/Down arrows, Enter to select, Escape to close
- Recent searches in localStorage (last 5)
- Count per category in heading
- <Skeleton> items while loading
- Debounce 300ms, cache results, limit 5 per category
</features>

Generate 50 items across Users, Projects, Documents.`,
    tags: ["Command", "Search", "CMD+K", "Fuzzy", "shadcn/ui"],
  },
  {
    id: 18,
    category: "components",
    title: "Multi-Step Form Wizard with Progress",
    description:
      "Step-by-step wizard with validation gates, visual progress, draft persistence, and animated transitions.",
    prompt: `<task>Build a multi-step form wizard with shadcn/ui components.</task>

<stepper>
Horizontal step indicator: number circles + labels
States: completed (check, green), current (brand, filled), upcoming (gray, outlined)
Connecting lines: solid completed, dashed upcoming
<Progress value={step * 25} /> bar below
</stepper>

<steps>
/components/wizard/step-basic.tsx — Name, Email, Phone with format validation
/components/wizard/step-address.tsx — Street, City, State <Select>, Zip (5-digit)
/components/wizard/step-preferences.tsx — <Checkbox> interests, <RadioGroup> notifications, <Switch> theme
/components/wizard/step-review.tsx — Read-only summary, "Edit" links, Terms <Checkbox>
</steps>

<navigation>
- Back/Next <Button> in footer
- Validate before "Next"
- "Save Draft" → localStorage
- motion/react AnimatePresence slide transitions
- Success <Dialog> with celebration on submit
</navigation>`,
    tags: [
      "Wizard",
      "Multi-Step",
      "Form",
      "Progress",
      "Validation",
    ],
  },
  {
    id: 19,
    category: "components",
    title: "Kanban Board — react-dnd",
    description:
      "Task management Kanban board with drag-and-drop between columns, priority indicators, and inline card creation.",
    prompt: `<task>Create a Kanban board with drag-and-drop using react-dnd.</task>

<layout>
Horizontal scroll container, 4 columns: Backlog, In Progress, Review, Done
Each column: header (title + count <Badge>), <ScrollArea> card list, "+ Add card" button
Max column width: 320px
</layout>

<card>
<Card> from shadcn with:
- Title (truncated), colored left border by priority (Red/Orange/Green)
- <Avatar> assignee, due date <Badge> (destructive if overdue)
- Tag pills (1-3 <Badge>), comment + attachment counts
</card>

<dnd>
- DndProvider with HTML5Backend
- Draggable cards, droppable columns
- Drag: opacity-50 + shadow-lg
- Drop zone: dashed highlight
- motion/react layoutId for insertion animation
</dnd>

<features>
- <Collapsible> columns
- Inline <Input> for adding cards (Enter save, Escape cancel)
- Filter bar: assignee <Select>, priority <Select>, search <Input>
</features>

Generate 15 tasks with varied priorities, assignees, and due dates.`,
    tags: [
      "Kanban",
      "react-dnd",
      "Drag-Drop",
      "Board",
      "Tasks",
    ],
  },
  {
    id: 20,
    category: "components",
    title: "Interactive Charts Dashboard — Recharts",
    description:
      "Data visualization dashboard with six chart types using recharts, responsive containers, and custom tooltips.",
    prompt: `<task>Build an interactive chart dashboard using recharts.</task>

<layout>
2×3 grid (grid-cols-2 xl:grid-cols-3), single column mobile.
Each chart in <Card> with <CardHeader> (title + time period <Select>) and <CardContent>.
</layout>

<charts>
1. Revenue <LineChart>: 12-month, two lines (Revenue + Target dashed), <Tooltip>, <CartesianGrid>
2. Sales <BarChart>: Top 6 products, horizontal, rounded, gradient, <Tooltip>
3. Traffic <PieChart>: Donut (innerRadius={60}), 5 segments, center total label, active hover
4. Growth <AreaChart>: Gradient fill, 6-month, fillOpacity={0.3}, reference line
5. Categories <RadarChart>: 6 axes, two datasets overlaid, <PolarGrid>
6. Revenue vs Expenses <ComposedChart>: <Bar> + <Line> + <Area>, dual Y-axis
</charts>

<shared>
- <ResponsiveContainer width="100%" height={300}> on all
- Consistent color palette
- Custom <Tooltip> styled with card classes
- <Legend> toggle to show/hide series
- Animated on mount
</shared>

Create realistic sample data generator functions.`,
    tags: ["Charts", "Recharts", "Dashboard", "Visualization"],
  },

  // ── INTERACTIONS (21–30) ───────────────────────────────────────────
  {
    id: 21,
    category: "interactions",
    title: "Infinite Scroll with Virtual Windowing",
    description:
      "Auto-loading feed with IntersectionObserver detection, virtual rendering for 1000+ items, and scroll position preservation.",
    prompt: `<task>Create an infinite scroll feed with virtual windowing.</task>

<scroll_detection>
- IntersectionObserver on sentinel div (threshold: 0.1)
- Prevent duplicate loads with isLoading ref
</scroll_detection>

<virtual_rendering>
- Only render items in viewport ± 5 buffer
- Calculate visible range from scrollTop + itemHeight
- Absolute positioning with translateY() per item
- Container height = totalItems × itemHeight
- Update on scroll via requestAnimationFrame
</virtual_rendering>

<feed_item>
<Card>: image (unsplash_tool), title, description (2-line clamp)
Author: <Avatar> + name + relative timestamp
Actions: Heart, MessageCircle, Share with counts
<Skeleton> matching exact layout while loading
</feed_item>

<states>
- Initial: 3 <Skeleton> cards
- Loading more: spinner at bottom
- End of feed: "You've reached the end" message
- Error: "Failed to load" with retry <Button>
- "Scroll to top" button after 3 viewports
- "12 new posts" <Badge> for new content
</states>

Generate 200 sample feed items.`,
    tags: [
      "Infinite Scroll",
      "Virtual List",
      "IntersectionObserver",
    ],
  },
  {
    id: 22,
    category: "interactions",
    title: "Swipeable Card Stack — Motion Gestures",
    description:
      "Tinder-style swipeable cards with touch gesture tracking, spring physics, and programmatic swipe triggers.",
    prompt: `<task>Build a swipeable card stack using motion/react.</task>

import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react"

<stack>
3 cards stacked: top scale(1) z-30, second scale(0.95) +10px z-20, third scale(0.9) +20px z-10
</stack>

<gestures>
<motion.div drag="x"> on top card
- useMotionValue for x tracking
- useTransform: x [-200, 200] → rotate [-15deg, 15deg]
- useTransform: x → overlay icon opacity
</gestures>

<actions>
- Right (x > 150): Accept — green overlay + Check icon
- Left (x < -150): Reject — red overlay + X icon
- Within threshold: spring back to center
- Buttons below: X (reject), Heart (accept), Undo (reverse)
</actions>

<cards>
Full-bleed unsplash_tool portrait images, gradient overlay
Name, age, location, short bio, interest <Badge> tags
</cards>

Generate 10 profile cards.
Spring physics: type: "spring", stiffness: 300, damping: 20.`,
    tags: ["Swipe", "Gestures", "Motion", "Spring Physics"],
  },
  {
    id: 23,
    category: "interactions",
    title: "Command Palette — Global CMD+K",
    description:
      "Global command palette using shadcn/ui CommandDialog for keyboard-first navigation, actions, and theme switching.",
    prompt: `<task>Create a command palette using shadcn/ui <CommandDialog>.</task>

<activation>
useEffect for CMD+K → setOpen(true)
</activation>

<commands>
Quick Actions: Create new (⌘N), Search (⌘F), Settings (⌘,)
Navigation: Dashboard, Analytics, Projects, Team
Theme: Light mode, Dark mode, System theme
Recent: Last 5 commands from localStorage
</commands>

<behavior>
- Close + execute on select
- Track recent commands in localStorage
- Show recent when input empty
- Fuzzy search across all commands
- Each command has icon + label + optional <CommandShortcut>
</behavior>

Create 25+ commands across Navigation, Actions, Theme, and Help categories.`,
    tags: [
      "Command Palette",
      "CMD+K",
      "Keyboard",
      "Navigation",
    ],
  },
  {
    id: 24,
    category: "interactions",
    title: "Accordion & Collapsible Groups",
    description:
      "FAQ-style accordion using shadcn/ui with smooth height animations, deep linking, and multiple variants.",
    prompt: `<task>Build an accordion system using shadcn/ui <Accordion>.</task>

<variants>
1. FAQ (type="single" collapsible): 10 questions, one open at a time, ChevronDown rotation.

2. Multi-Open (type="multiple"): Multiple open, "Expand All" / "Collapse All" buttons, nested sub-accordions.

3. Settings: Each section has form controls. Icon + title + description in trigger. <Badge> count. Save button per section.
</variants>

<deep_linking>
- Read URL hash on mount → set defaultValue
- Update hash when section opens
- Smooth scroll to opened section
</deep_linking>

<styling>
- Left color border on active items
- Subtle bg change on open
- Stagger entrance animation with motion/react
- Disabled items with opacity + cursor-not-allowed
</styling>

Build a demo FAQ page with 10 questions in 3 categories.`,
    tags: ["Accordion", "Collapsible", "FAQ", "Deep Link"],
  },
  {
    id: 25,
    category: "interactions",
    title: "Tooltip & Popover System — shadcn/ui",
    description:
      "Contextual information layers with Tooltip, Popover, and HoverCard — smart positioning and rich content.",
    prompt: `<task>Build a comprehensive tooltip/popover system with shadcn/ui.</task>

<tooltips>
<TooltipProvider> wrapper. Side: top/right/bottom/left (auto boundary detection).
Use cases: icon button labels, truncated text, keyboard shortcut hints.
</tooltips>

<hover_cards>
<HoverCard> for rich previews:
- @username trigger → user card with <Avatar>, name, bio, stats
- Link preview → URL card with title, description, image
</hover_cards>

<popovers>
Interactive <Popover> content:
- Settings popover with <Switch> and <Select>
- Color picker
- Share dialog with copy link
- Notification list (scrollable)
</popovers>

<mobile>
Popovers become full-width bottom sheets on small screens.
</mobile>

Build a demo page with various triggers for all types.`,
    tags: ["Tooltip", "Popover", "HoverCard", "Positioning"],
  },
  {
    id: 26,
    category: "interactions",
    title: "Context Menu with Nested Actions",
    description:
      "Custom right-click menus using shadcn/ui ContextMenu with submenus, keyboard shortcuts, and checkbox/radio items.",
    prompt: `<task>Build contextual right-click menus using shadcn/ui <ContextMenu>.</task>

<menu_structure>
<ContextMenu>
  <ContextMenuTrigger className="w-full h-full">{content}</ContextMenuTrigger>
  <ContextMenuContent className="w-64">
    <ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Email</ContextMenuItem>
        <ContextMenuItem>Copy Link</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked={showGrid}>Show Grid</ContextMenuCheckboxItem>
    <ContextMenuRadioGroup value={viewMode}>
      <ContextMenuRadioItem value="grid">Grid View</ContextMenuRadioItem>
      <ContextMenuRadioItem value="list">List View</ContextMenuRadioItem>
    </ContextMenuRadioGroup>
    <ContextMenuSeparator />
    <ContextMenuItem className="text-destructive">Delete <ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
</menu_structure>

Build 3 scenarios: File browser, Text editor, Image gallery — each with different context menus.`,
    tags: [
      "Context Menu",
      "Right-Click",
      "Nested",
      "shadcn/ui",
    ],
  },
  {
    id: 27,
    category: "interactions",
    title: "Slide-Over Sheet & Resizable Panels",
    description:
      "Side panel overlays using shadcn/ui Sheet and resizable split layouts with re-resizable.",
    prompt: `<task>Build slide-over panels with shadcn/ui <Sheet> and resizable layouts.</task>

<sheet_variants>
1. Right Sheet (detail): <SheetContent side="right" className="w-[400px] sm:w-[540px]"> with header, scrollable content, footer.
2. Left Sheet (nav/filters): side="left" with filter controls.
3. Bottom Sheet (mobile): side="bottom" className="h-[80vh]" with drag handle.
4. Full-Width Sheet: className="w-full sm:max-w-2xl" for complex forms.
</sheet_variants>

<resizable>
Use re-resizable for persistent split layout:
- Two panels with drag handle
- Persist sizes to localStorage
- Min/max constraints
- Collapse when below minimum
</resizable>

Demo: File explorer with left nav sheet, main grid, right detail sheet.`,
    tags: [
      "Sheet",
      "Drawer",
      "Resizable",
      "Panels",
      "re-resizable",
    ],
  },
  {
    id: 28,
    category: "interactions",
    title: "Keyboard Shortcuts System",
    description:
      "Global shortcut system with a searchable reference modal, platform detection, and input-aware disabling.",
    prompt: `<task>Implement a comprehensive keyboard shortcuts system.</task>

<hook>
/components/use-keyboard-shortcuts.ts:
- Parse "mod+k", "mod+shift+n", "escape" ("mod" = metaKey Mac, ctrlKey Windows)
- Listen on keydown, check modifiers
- Disable when focus in input/textarea/contentEditable
</hook>

<shortcuts>
Register 25+:
mod+k → command palette, mod+n → create, mod+s → save, mod+/ → sidebar
escape → close modal, ? → shortcuts reference
Navigation: mod+1-9 switch views
</shortcuts>

<reference_modal>
Triggered by "?" key. <Dialog> with searchable list.
Two-column layout of categories: Navigation, Actions, Editing, View, Help.
<kbd> elements styled as pill keys: bg-muted rounded px-1.5 py-0.5 text-xs border shadow-sm font-mono
Platform detection: ⌘ on Mac, Ctrl on Windows/Linux.
</reference_modal>`,
    tags: [
      "Keyboard",
      "Shortcuts",
      "Hotkeys",
      "Platform Detection",
    ],
  },
  {
    id: 29,
    category: "interactions",
    title: "Page Transitions — Motion",
    description:
      "Smooth animated transitions between views using motion/react AnimatePresence with multiple patterns.",
    prompt: `<task>Create page transitions using motion/react.</task>

import { motion, AnimatePresence } from "motion/react"

<patterns>
1. Fade + Slide (default):
   initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}

2. Scale (modal/detail):
   initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}

3. Directional Slide (nav):
   Track direction in state. initial={{ x: direction === "forward" ? 100 : -100 }}

4. Shared Layout:
   <motion.div layoutId={\`card-\${id}\`}> on list card AND detail view → morphs position/size

5. Staggered List:
   Parent variants with staggerChildren: 0.05, child items animate in sequence
</patterns>

<reduce_motion>
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) set all durations to 0.
</reduce_motion>

Build demo with Home → List → Detail views showing all transitions.`,
    tags: [
      "Transitions",
      "Motion",
      "AnimatePresence",
      "Layout",
    ],
  },
  {
    id: 30,
    category: "interactions",
    title: "Live Search & Faceted Filtering",
    description:
      "Real-time search with multi-faceted filters, URL state sync, grid/list toggle, and instant visual feedback.",
    prompt: `<task>Build live search and faceted filtering with instant results.</task>

<search>
<Input> with Search icon, clear X, debounced 300ms.
Search across: name, description, tags, category.
"N results" count updates live.
</search>

<filters>
Sidebar using shadcn:
- Category: <Checkbox> list with counts
- Price: <Slider> min/max with inputs
- Rating: clickable star filter
- Status: <RadioGroup> All/In Stock/On Sale
- Tags: <Badge> toggles
- "Clear all" <Button variant="ghost">
</filters>

<active_filters>
Dismissible <Badge> chips above results. Each has X to remove. "Clear all" link.
</active_filters>

<results>
- Grid/List toggle: <ToggleGroup>
- Sort <Select>: Name, Price, Newest, Rating
- motion/react fade on results change
- useMemo pipeline: filter → sort → paginate
- URL state: sync all filters to search params
</results>

Generate 80 products with name, category, price, rating, tags, stock status.
Use unsplash_tool for product images.`,
    tags: [
      "Search",
      "Faceted Filter",
      "Real-time",
      "URL State",
    ],
  },

  // ── DATA & LOGIC (31–40) ──────────────────────────────────────────
  {
    id: 31,
    category: "data",
    title: "Complete CRUD with Optimistic UI",
    description:
      "Full create-read-update-delete interface with optimistic updates, validation, undo support, and useReducer state.",
    prompt: `<task>Build a complete CRUD interface for managing projects.</task>

<model>
interface Project {
  id: string;           // crypto.randomUUID()
  name: string;         // required, 3-50 chars
  description: string;  // optional, max 500
  status: "Active" | "Paused" | "Completed";
  priority: "Low" | "Medium" | "High";
  startDate: string;
  endDate: string;      // must be after startDate
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
</model>

<views>
1. List: <Table> with sort, search, status filter. Row click → detail sheet.
2. Create: <Dialog> form with Zod validation. Optimistic add → toast.
3. Detail: <Sheet side="right"> read-only. "Edit" button. Status <Badge>.
4. Edit: <Dialog> pre-filled form. Dirty field tracking. Optimistic update → toast.
5. Delete: <AlertDialog> with project name. Optimistic remove → toast with "Undo" (5s).
</views>

State: useReducer with CRUD actions.
Persistence: localStorage.
Simulate async: setTimeout(200ms) for realistic feel.`,
    tags: [
      "CRUD",
      "Optimistic UI",
      "Undo",
      "useReducer",
      "Forms",
    ],
  },
  {
    id: 32,
    category: "data",
    title: "Context + useReducer State Architecture",
    description:
      "Centralized state management with React Context and useReducer — typed actions, selectors, and persistence.",
    prompt: `<task>Create centralized state using React Context + useReducer.</task>

<state>
interface AppState {
  user: { id, name, email, role } | null;
  projects: Project[];
  ui: { theme, sidebarOpen, activeModal, commandPaletteOpen };
  notifications: Notification[];
}
</state>

<actions>
SET_USER, LOGOUT, ADD_PROJECT, UPDATE_PROJECT, DELETE_PROJECT,
TOGGLE_THEME, TOGGLE_SIDEBAR, SET_MODAL, ADD_NOTIFICATION, DISMISS_NOTIFICATION
</actions>

<files>
/components/state/app-context.tsx — Context + Provider
/components/state/app-reducer.ts — Pure reducer
/components/state/actions.ts — Action creators
/components/state/selectors.ts — Hooks: useUser(), useProjects(), useTheme()
</files>

<provider>
- Wrap App in <AppProvider>
- Init from localStorage, auto-save on change
- Custom hooks: useProjectActions().addProject(), useTheme().toggleTheme()
</provider>

Build a demo dashboard using all actions and selectors.`,
    tags: [
      "Context",
      "useReducer",
      "State",
      "TypeScript",
      "Hooks",
    ],
  },
  {
    id: 33,
    category: "data",
    title: "Async Data Fetching — All States",
    description:
      "Robust data fetching with loading, error, empty, and success states — each with proper UI feedback and retry logic.",
    prompt: `<task>Create a comprehensive async data fetching pattern handling every state.</task>

<hook>
/components/hooks/use-async-data.ts:
Returns { status: "idle"|"loading"|"success"|"error", data, error, execute, isLoading }
</hook>

<visual_states>
1. Loading: <Skeleton> matching final layout (card, table, profile shapes). animate-pulse.
2. Error: <Card> with AlertTriangle, message, <Button>Retry</Button>. Exponential backoff (1s, 2s, 4s, max 3).
3. Empty: Illustration, "No items found", CTA <Button> to create first.
4. Success: Staggered entrance (motion/react). "Last updated" indicator. Refresh button.
5. Background refresh: Show existing data + small spinner. Replace seamlessly on success. Toast on error.
</visual_states>

Create fetchProjects(), fetchUsers() with configurable delay and failure rate.`,
    tags: [
      "Async",
      "Loading",
      "Error Handling",
      "Skeleton",
      "Retry",
    ],
  },
  {
    id: 34,
    category: "data",
    title: "Simulated Real-Time Updates — Polling",
    description:
      "Simulate real-time data with polling, optimistic UI, tab visibility awareness, and connection status indicators.",
    prompt: `<task>Build a real-time data update system simulating WebSocket behavior.</task>

<hook>
/components/hooks/use-polling.ts:
- Fetch on mount, then every intervalMs
- Pause when tab hidden (document.hidden), resume on visible
- Track: connected, reconnecting, error
- Return { data, lastUpdated, connectionStatus, refetch }
</hook>

<features>
1. Live Notification Badge: Poll 10s, animate count changes, bell + red dot.
2. Activity Feed: New items slide in at top. "5 new updates" banner. Pulse on new.
3. Data Table: Highlight changed cells (flash bg 2s). "Updated just now" timestamps.
4. Live Metrics: KPI cards with smooth number counting animation. Sparklines shift.
</features>

<connection_status>
Connected: green dot + "Live". Reconnecting: amber + spinner. Disconnected: red + reconnect button.
</connection_status>

Simulate with setInterval generating random changes. 5% disconnect chance per poll.`,
    tags: [
      "Real-time",
      "Polling",
      "Live Updates",
      "Connection Status",
    ],
  },
  {
    id: 35,
    category: "data",
    title: "Form State Engine — Dirty Tracking",
    description:
      "Advanced form state with field-level dirty tracking, validation rules, and unsaved changes protection.",
    prompt: `<task>Create a form state engine with dirty tracking.</task>

<hook>
/components/hooks/use-form-state.ts:
Returns: values, initialValues, errors, touched, dirtyFields, isDirty, isValid, isSubmitting
Methods: setValue, setTouched, validate, reset, handleSubmit
</hook>

<visual>
- Changed fields: subtle left border accent
- Error fields: border-destructive + message
- Required: asterisk after label
- Character counter: "23/500"
- Field-level "Reset" on dirty fields
</visual>

<protection>
- <AlertDialog> on navigation: "You have unsaved changes"
- beforeunload for page close
- "Save" enabled only when isDirty && isValid
- "Discard changes" to reset
</protection>

<validation>
required(), minLength(n), maxLength(n), pattern(regex), email(), url(),
custom(fn: (value, allValues) => string | undefined),
async(fn: (value) => Promise<string | undefined>)
</validation>

Build a user profile form with 8+ fields.`,
    tags: [
      "Forms",
      "Dirty Tracking",
      "Validation",
      "Protection",
    ],
  },
  {
    id: 36,
    category: "data",
    title: "Multi-Format Data Export",
    description:
      "Export data as CSV, JSON, or Markdown with column selection, preview, and chunked progress for large sets.",
    prompt: `<task>Build a data export system with multiple formats.</task>

<dialog>
<RadioGroup>: CSV, JSON, Markdown Table
<Checkbox> list for column selection (select/deselect all)
<Select> date range filter
Preview: first 5 rows in selected format
Filename <Input> with auto extension
Export <Button> with loading state
</dialog>

<formats>
1. CSV: Proper escaping, header row, downloadBlob("text/csv")
2. JSON: Pretty-printed 2-space indent, metadata (date, count)
3. Markdown: Aligned columns, header separator, clipboard copy
</formats>

<download>
function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
</download>

<progress>
Chunk 100 rows with setTimeout(0) between. <Progress> bar. Cancel button. Success toast.
</progress>

Demo with 500 records and all 3 formats.`,
    tags: ["Export", "CSV", "JSON", "Download", "Blob"],
  },
  {
    id: 37,
    category: "data",
    title: "Batch Selection & Bulk Operations",
    description:
      "Multi-select with bulk actions, floating toolbar, progress tracking, and error recovery with undo.",
    prompt: `<task>Create a batch operations interface for bulk actions.</task>

<selection>
- <Checkbox> per item + "Select all" in header
- "Select all 247 items" banner for cross-page
- Shift+click for range selection
</selection>

<floating_toolbar>
Appears when items selected. Fixed bottom-center:
"12 selected" | Update Status | Assign | Add Tags | Delete (destructive) | ✕ Clear
bg-primary text-primary-foreground rounded-2xl shadow-2xl
</floating_toolbar>

<bulk_flows>
1. Status Update: <Select> new status → optimistic update all.
2. Delete: <AlertDialog> "Delete 12 items?". Progress per item. Failed items with retry.
3. Tag Assignment: <Command> multi-select. Add or replace.
</bulk_flows>

<progress_dialog>
"Processing 5 of 12..." <Progress>. Per-item status: spinner/check/error. "Done — 11 succeeded, 1 failed."
</progress_dialog>

Undo toast with 8-second window.`,
    tags: ["Batch", "Bulk Actions", "Selection", "Progress"],
  },
  {
    id: 38,
    category: "data",
    title: "Client-Side Caching — SWR Pattern",
    description:
      "Stale-while-revalidate caching for API data with TTL, cache management, and offline support.",
    prompt: `<task>Implement a stale-while-revalidate caching pattern.</task>

<hook>
/components/hooks/use-cached-data.ts:
Options: ttl (5min default), staleTime, cacheStorage ("memory"|"localStorage"), onSuccess, onError
Returns: data, isLoading, isValidating, isStale, error, mutate, invalidate
</hook>

<store>
const cache = new Map<string, { data, timestamp, ttl }>();
</store>

<strategies>
1. Cache-first: Return cache → revalidate background
2. Network-first: Fetch → fallback to cache on error
3. SWR: Show stale → update when fresh arrives
</strategies>

<indicators>
- "Cached" <Badge> with clock icon for stale data
- Subtle spinner during background revalidation
- "Updated 5 min ago" timestamp
- "Offline mode" when network unavailable
</indicators>

<cache_ui>
Dev panel: cached keys with timestamps, size indicator, clear button, individual invalidation.
</cache_ui>

Demo with user list and project list sharing cache.`,
    tags: ["Caching", "SWR", "Performance", "Offline"],
  },
  {
    id: 39,
    category: "data",
    title: "Pagination — Three Patterns",
    description:
      "Numbered pages, cursor-based load-more, and virtual scrolling — each optimized for different data volumes.",
    prompt: `<task>Build three pagination patterns for different scenarios.</task>

<numbered>
Under 1000 items. shadcn <Pagination>:
1 2 3 ... 8 9 10 with ellipsis. Per page <Select>: 10/25/50.
"Showing 1-25 of 247". Sync to URL: ?page=3&perPage=25.
Smooth scroll to top on change.
</numbered>

<cursor>
Social feed. "Load more" <Button>.
Each response has nextCursor. Append items. "No more items" when null.
Maintain scroll position on load.
</cursor>

<virtual>
10,000+ items. Custom virtualizer:
- Fixed-height container, overflow-y: auto
- startIndex = Math.floor(scrollTop / itemHeight)
- Render visible + 5 buffer above/below
- Spacer divs for scroll height
- requestAnimationFrame on scroll
- "Jump to" input for index navigation
</virtual>

Demo: Three <Tabs> showing each pattern with shared data.`,
    tags: [
      "Pagination",
      "Virtual Scroll",
      "Cursor",
      "URL State",
    ],
  },
  {
    id: 40,
    category: "data",
    title: "Undo/Redo with Action History",
    description:
      "Time-travel state management with undo/redo stack, action merging, keyboard shortcuts, and visual history panel.",
    prompt: `<task>Create an undo/redo system with history tracking.</task>

<hook>
/components/hooks/use-history.ts:
Internal: past[], present, future[]
Returns: state, set, undo, redo, canUndo, canRedo, history, clear, goTo(index)
</hook>

<keyboard>
Cmd+Z → undo(), Cmd+Shift+Z → redo()
</keyboard>

<action_merging>
- Typing: merge rapid changes (<500ms) into single undo step
- Dragging: merge increments into single step
- Use actionType parameter to group similar actions
</action_merging>

<history_panel>
Side panel with chronological action list:
- Icon + description + timestamp per entry
- Click to jump to that point (time travel)
- Current state highlighted, future states grayed
</history_panel>

<visual>
- Undo/Redo buttons with disabled state
- <Tooltip> "Undo: Delete 'Task Name'"
- Flash animation on affected elements
- Toast: "Undone: deleted 'Task Name'"
- Max 50 entries, persist to localStorage
</visual>

Build a todo list with add/edit/delete/reorder, all with undo/redo.`,
    tags: ["Undo", "Redo", "History", "Time Travel"],
  },

  // ── DESIGN SYSTEMS (41–45) ────────────────────────────────────────
  {
    id: 41,
    category: "design",
    title: "Figma Design System → Tailwind v4 Tokens",
    description:
      "Extract design tokens from Figma imports using Claude 4.6's vision and generate a complete Tailwind token system.",
    prompt: `[Paste your Figma design system frames here — Claude 4.6 will visually analyze them]

<task>Extract and implement a complete design token system for Tailwind CSS v4.</task>

<agent_process>
1. Analyze all imported colors → group by usage (brand, neutral, semantic)
2. Catalog font sizes, weights, line heights
3. Measure spacing patterns (padding, margins, gaps)
4. Document border radii, shadows, opacity values
</agent_process>

<generate>
Add to :root in /styles/globals.css:
Brand: --brand-50 through --brand-900
Semantic: --success/warning/info with -foreground variants
Surface: --surface-1/#ffffff, --surface-2/#f8fafc, --surface-3/#f1f5f9
</generate>

<showcase>
/components/design-system-showcase.tsx:
- Color palette grid with token names
- Typography scale
- Spacing visualization
- Component variants using tokens
- Dark mode variants
</showcase>

This becomes the project's living style guide.`,
    tags: [
      "Design Tokens",
      "Figma",
      "Tailwind v4",
      "Vision Analysis",
    ],
  },
  {
    id: 42,
    category: "design",
    title: "Component Variant System — CVA Pattern",
    description:
      "Build flexible multi-variant components using class-variance-authority — the same pattern shadcn/ui uses internally.",
    prompt: `<task>Build a component variant system using CVA patterns.</task>

<pattern>
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:ring-2",
  {
    variants: {
      variant: { default: "bg-primary ...", secondary: "...", outline: "...", ghost: "...", destructive: "..." },
      size: { sm: "h-8 px-3 text-xs", default: "h-10 px-4", lg: "h-12 px-8", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
</pattern>

<build>
1. StatusBadge: variant (success/warning/error/info/neutral) + size (sm/md/lg) + dot (boolean)
2. Alert: variant (info/success/warning/error) + layout (inline/banner) + dismissible
3. Card: variant (flat/elevated/outlined/interactive) + padding (compact/default/spacious)
4. Input: variant (default/filled/underline) + state (default/error/success) + size
5. Tag: variant (solid/outline/subtle) + color (brand/gray/red/green/blue) + removable
</build>

Create a showcase displaying every variant of every component in a grid.`,
    tags: ["CVA", "Variants", "Components", "Type Safety"],
  },
  {
    id: 43,
    category: "design",
    title: "Fluid Responsive Typography — clamp()",
    description:
      "Fluid typography scale using CSS clamp() that smoothly scales between mobile and desktop breakpoints.",
    prompt: `<task>Build a fluid responsive typography system using CSS clamp().</task>

<scale>
Add to /styles/globals.css :root:
--text-display: clamp(2rem, 5vw, 3.5rem); line-height: 1.1
--text-h1: clamp(1.75rem, 3.5vw, 2.5rem)
--text-h2: clamp(1.5rem, 3vw, 2rem)
--text-h3: clamp(1.25rem, 2.5vw, 1.5rem)
--text-body-lg: clamp(1rem, 1.5vw, 1.125rem)
--text-body: clamp(0.875rem, 1.2vw, 1rem)
--text-body-sm: clamp(0.8rem, 1vw, 0.875rem)
--text-caption: clamp(0.7rem, 0.9vw, 0.75rem)
</scale>

<components>
- <Heading level={1-4}> — renders correct h-tag with fluid size
- <Text size="body-lg|body|body-sm|caption"> — paragraph
- <Overline> — uppercase, tracked, small
- <Mono> — monospace for code
</components>

<showcase>
Every text size with pixel range. Side-by-side viewport comparison.
Sample paragraph readability. Heading hierarchy. Weight comparison grid.
</showcase>`,
    tags: ["Typography", "Fluid", "clamp()", "Responsive"],
  },
  {
    id: 44,
    category: "design",
    title: "Lucide Icon System & Guidelines",
    description:
      "Systematic icon usage with lucide-react — sizing conventions, button patterns, accessibility, and searchable gallery.",
    prompt: `<task>Create a systematic icon usage guide using lucide-react.</task>

<sizing>
Inline with text: h-4 w-4 (16px)
Buttons/inputs: h-5 w-5 (20px)
Feature cards: h-6 w-6 (24px)
Hero/empty: h-10 w-10 or h-16 w-16
</sizing>

<patterns>
Icon only: <Button variant="ghost" size="icon" aria-label="Close"><X className="h-4 w-4" /></Button>
Icon + text: <Button><Plus className="mr-2 h-4 w-4" /> Add</Button>
Trailing: <Button>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
With dot: <div className="relative"><Bell /><span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" /></div>
</patterns>

<categories>
Navigation: Home, LayoutDashboard, Settings, User, LogOut, Menu
Actions: Plus, Pencil, Trash2, Save, Download, Upload, Share2, Copy, Check
Status: CheckCircle, XCircle, AlertTriangle, Info, Clock, Loader2
Media: Image, FileText, Film, Music
Communication: Mail, MessageSquare, Phone, Bell, Send
Data: BarChart3, PieChart, TrendingUp, Database
</categories>

Build a searchable gallery with copy-to-clipboard for import statements.`,
    tags: [
      "Icons",
      "lucide-react",
      "Accessibility",
      "Design System",
    ],
  },
  {
    id: 45,
    category: "design",
    title: "Motion Design System — Spring Physics",
    description:
      "Consistent animation tokens using motion/react with spring presets, stagger patterns, and reduce-motion support.",
    prompt: `<task>Build a motion design system using motion/react.</task>

import { motion, AnimatePresence } from "motion/react"

<tokens>
/components/motion/tokens.ts:

transitions: {
  fast: { duration: 0.15 },
  default: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  spring: { type: "spring", stiffness: 300, damping: 24 },
  springBouncy: { type: "spring", stiffness: 400, damping: 17 },
}

variants: {
  fadeIn, slideUp, scaleIn, slideRight
}

stagger: { container: staggerChildren: 0.05, item: opacity+y }
</tokens>

<patterns>
1. Button Press: whileTap={{ scale: 0.97 }}
2. Hover Lift: whileHover={{ y: -2 }}
3. Card Entrance: {...variants.slideUp}
4. List Stagger: parent + children
5. Layout Shift: <motion.div layout>
6. Skeleton → Content: AnimatePresence mode="wait"
</patterns>

<a11y>
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
If true: set all durations to 0.
</a11y>

Build showcase with play/replay controls for each pattern.`,
    tags: ["Motion", "Animation", "Spring Physics", "A11y"],
  },

  // ── ADVANCED (46–50) ──────────────────────────────────────────────
  {
    id: 46,
    category: "advanced",
    title: "Claude 4.6 Meta-Prompt: Component Generator",
    description:
      "A meta-prompt optimized for Claude 4.6's extended thinking that instructs it to generate any component from a natural description.",
    prompt: `<system>You are a React + Tailwind component generator inside Figma Make, powered by Claude 4.6. Use extended thinking for complex layout decisions.</system>

When I describe a UI component, generate production-ready code:

<architecture>
- React functional components with TypeScript
- Tailwind CSS v4 — no inline styles
- shadcn/ui from /components/ui/ where applicable
- lucide-react icons, motion/react animations
- Separate files in /components/
</architecture>

<quality>
- Full TypeScript types for all props
- All states: default, hover, active, disabled, loading, error, empty
- Responsive: mobile-first with md: and lg: breakpoints
- Accessible: ARIA, keyboard nav, focus management
- Performant: React.memo, useMemo where needed
</quality>

<agent_tools>
- Call unsplash_tool for realistic photos
- Use <ImageWithFallback> for new images
- Create multiple component files for complex UIs
</agent_tools>

<response_format>
1. Brief analysis (2-3 sentences)
2. Component code in /components/
3. Demo in App.tsx showing all variants
4. Enhancement suggestions
</response_format>

Ready. Describe the component you need.`,
    tags: ["Meta-Prompt", "Claude 4.6", "Generator", "Agent"],
  },
  {
    id: 47,
    category: "advanced",
    title: "Parallel Component Build Strategy",
    description:
      "Leverage Claude 4.6's agentic multi-file creation to build independent components simultaneously for faster iteration.",
    prompt: `<strategy>Use this to maximize Claude 4.6's agentic capabilities in Figma Make.</strategy>

Principle: Claude 4.6 can create multiple independent files in a single turn. Structure requests for parallel work.

<template>
"Build these components independently. Each self-contained with no cross-dependencies. I'll integrate in App.tsx.

1. /components/header.tsx
   - Props: { user, onSearch, onNavigate }
   - Logo, nav, search trigger, avatar dropdown
   - Mobile: hamburger → Sheet

2. /components/stats-bar.tsx
   - Props: { stats: StatItem[] }
   - 4 KPI cards: icon, value, label, trend

3. /components/activity-feed.tsx
   - Props: { activities: Activity[] }
   - ScrollArea, avatar, action text, timestamp

4. /components/quick-actions.tsx
   - Props: { actions: Action[], onAction: (id) => void }
   - Grid of icon + label buttons

After building all 4, compose in App.tsx."
</template>

<why>
- Defined props = interface boundaries
- No component imports another = independence
- All coded simultaneously = speed
- Modify one without touching others = iteration
</why>

Use for any page with 3+ distinct sections.`,
    tags: ["Parallel", "Multi-File", "Agent", "Architecture"],
  },
  {
    id: 48,
    category: "advanced",
    title: "Iterative Refinement — Claude 4.6 Workflow",
    description:
      "Optimal multi-turn prompting workflow for iteratively improving generated components across Figma Make sessions.",
    prompt: `<strategy>Multi-turn refinement workflow optimized for Claude 4.6 in Figma Make.</strategy>

<phase_1>Structure (first prompt):
"Build [component] with [features]. Focus on structure and layout. Placeholder content is fine."
→ Gets skeleton right without overthinking.
</phase_1>

<phase_2>Polish (second prompt):
"Enhance visuals: hover states, transitions, loading/empty/error states, motion/react entrances."
→ Adds quality to solid structure.
</phase_2>

<phase_3>Data (third prompt):
"Replace placeholders with realistic data. Use unsplash_tool for photos. Vary data to show different states."
→ Makes it feel production-like.
</phase_3>

<phase_4>Interaction (fourth prompt):
"Add interactivity: [specific interactions], state management, toasts, keyboard shortcuts."
→ Makes it functional.
</phase_4>

<phase_5>Hardening (fifth prompt):
"Handle edge cases: empty state, error with retry, mobile responsive, accessibility audit."
→ Production ready.
</phase_5>

<anti_patterns>
✗ "Make it perfect" — too vague
✗ Specifying every pixel — over-constraining
✗ Changing architecture after Phase 3 — costly rework
✓ Specific about WHAT, flexible about HOW
✓ Reference specific components: "use shadcn <Sheet>"
✓ Use the current snippet selection to point Claude at specific code
</anti_patterns>`,
    tags: [
      "Iterative",
      "Workflow",
      "Multi-Turn",
      "Best Practices",
    ],
  },
  {
    id: 49,
    category: "advanced",
    title: "Long Session Context Management",
    description:
      "Maintain consistency across long Figma Make agent sessions with structured checkpoints and pattern naming.",
    prompt: `<strategy>Managing long Figma Make sessions with Claude 4.6.</strategy>

<checkpoint_prompt>
Use every 8-10 messages:

"Current state summary:

Files: /App.tsx (main layout), /components/header.tsx, /components/sidebar.tsx, ...
Design: [color palette, component library, state approach, animation lib]
Working: [completed features]
Remaining: [todo items]

Continue with: [next task]"
</checkpoint_prompt>

<why>
- Reminds Claude of established patterns
- Prevents contradicting earlier decisions
- Maintains naming conventions
- Keeps interfaces consistent
</why>

<strategies>
1. Reference previous: "Use the same card style from /components/project-card.tsx"
2. Name patterns: "Use the 'detail sheet' pattern — Sheet right, header, scrollable, sticky footer"
3. Protect files: "Update ONLY the sidebar. Don't modify App.tsx or header."
4. Batch related: "Update ALL components to use new color tokens" (not one at a time)
5. Select specific code: Use Figma Make's snippet selection to point Claude at exactly what to change
</strategies>`,
    tags: [
      "Context",
      "Session",
      "Consistency",
      "Agent Workflow",
    ],
  },
  {
    id: 50,
    category: "advanced",
    title: "Figma Make → Production Export Guide",
    description:
      "Transform Figma Make prototypes into production-ready code with testing, error boundaries, and CI/CD guidance.",
    prompt: `<guide>Refactoring Figma Make output into production-ready code.</guide>

<figma_make_provides>
✓ Working React + Tailwind components with TypeScript
✓ shadcn/ui integration + responsive layouts
✓ State management patterns + motion/react animations
✓ Supabase integration (if connected)
</figma_make_provides>

<add_for_production>
1. Testing: Unit (Vitest), Component (React Testing Library), Integration, A11y (axe-core)
2. Error Boundaries: Route-level wrapping, fallback UIs, error reporting
3. Performance: React.lazy() code splitting, Suspense, image optimization, bundle analysis
4. Type Safety: Strict TypeScript, Zod runtime validation, exhaustive switch patterns
5. State Scale-Up: Replace useState → Zustand/Jotai. Add TanStack Query for server state.
6. CI/CD: ESLint + Prettier, pre-commit hooks, automated tests, preview deploys
7. Monitoring: Sentry errors, analytics events, Web Vitals, session recording
</add_for_production>

<key_insight>
Figma Make components are production-compatible React. Copy directly — they don't need framework migration. The Supabase integration is real and already works. Focus additions on testing, monitoring, and deployment pipeline.
</key_insight>`,
    tags: [
      "Production",
      "Export",
      "Testing",
      "CI/CD",
      "Architecture",
    ],
  },
];