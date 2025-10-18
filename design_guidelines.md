# Event Management Website Design Guidelines

## Design Approach
**Reference-Based Approach** drawing inspiration from Eventbrite, Airbnb Experiences, and Meetup. This event management platform requires visual appeal to showcase events effectively while maintaining strong usability for browsing and RSVP workflows.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 262 80% 50% (vibrant purple - energy and excitement)
- Secondary: 220 15% 20% (charcoal - text and structure)
- Accent: 340 75% 55% (coral pink - CTAs and highlights)
- Background: 0 0% 98% (off-white)
- Surface: 0 0% 100% (white cards)

**Dark Mode:**
- Primary: 262 75% 60% (lighter purple)
- Secondary: 220 10% 85% (light gray text)
- Accent: 340 70% 60% (softer coral)
- Background: 220 15% 10% (deep charcoal)
- Surface: 220 12% 15% (elevated cards)

### B. Typography
**Fonts (via Google Fonts CDN):**
- Display/Headings: 'Plus Jakarta Sans' (700, 600 weights)
- Body: 'Inter' (400, 500, 600 weights)

**Scale:**
- Hero: text-5xl md:text-6xl lg:text-7xl (font-bold)
- Section Headers: text-3xl md:text-4xl (font-semibold)
- Card Titles: text-xl md:text-2xl (font-semibold)
- Body: text-base md:text-lg (font-normal)
- Small: text-sm (font-medium)

### C. Layout System
**Spacing Units:** Consistent use of 4, 6, 8, 12, 16, 20, 24 (tailwind units)
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 md:p-8
- Component gaps: gap-4, gap-6, gap-8
- Container: max-w-7xl mx-auto px-4 md:px-6

### D. Component Library

**Homepage Sections (6-7 sections):**
1. **Hero Section** (h-[85vh]): Large background image showcasing vibrant event, overlay gradient (from primary/20 to transparent), centered content with headline, subheadline, search bar with location/date filters, "Browse Events" CTA
2. **Featured Events Grid**: 3-column masonry-style layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3), large event cards with images, titles, dates, location tags
3. **Category Browse**: Horizontal scrolling cards with category icons and event counts, colorful backgrounds per category
4. **Upcoming Events Timeline**: Mixed 2-column asymmetric layout, large event cards alternating left/right with connecting timeline line
5. **How It Works**: 3-column grid with icons, numbered steps (Find → RSVP → Attend)
6. **Social Proof**: 2-column testimonials with user photos, event attendance stats in 4-column grid
7. **CTA Section**: Full-width with secondary background, "Start Creating Events" for organizers

**Event Cards:**
- Image: aspect-ratio-[4/3], rounded-xl, hover scale effect
- Content overlay: gradient from transparent to black/80
- Badge: Category tag (top-right, rounded-full, backdrop-blur)
- Details: Date pill (absolute, top-left), attendee count, location with icon
- Footer: Organizer avatar, event title, "RSVP" button

**Event Detail Page:**
- Hero: Full-width event image (h-[60vh]), title overlay at bottom
- Sidebar (lg:w-1/3): Sticky RSVP card with date, time, location, capacity, "Register" button, share icons
- Main Content (lg:w-2/3): Event description, organizer info card, similar events carousel

**Event Creation Form:**
- Multi-step wizard with progress indicator
- Image upload with drag-and-drop zone
- Rich text editor for description
- Date/time picker (calendar modal)
- Capacity slider, category dropdown
- Location autocomplete input

**Dashboard:**
- Sidebar navigation (fixed, w-64)
- Stats cards: 4-column grid (Total Events, RSVPs, Views, Revenue)
- Events table: Sortable columns, status badges, action dropdown
- Calendar view toggle

**Navigation:**
- Transparent on hero (fixed), solid on scroll
- Logo left, search bar center, "Create Event" + profile right
- Mobile: Hamburger menu with slide-out drawer

### E. Animations
**Minimal, purposeful motion:**
- Card hover: transform scale-105 transition-transform duration-300
- Button: Standard hover states only
- Page transitions: Subtle fade-in for content sections
- Image loading: Skeleton placeholder with pulse

## Images
**Hero Section:** Large, vibrant lifestyle image showing diverse people at a lively event (concert, festival, or networking gathering) - conveys energy and community (w-full h-[85vh] object-cover)

**Event Cards:** Mix of event photography - concerts, workshops, sports events, cultural festivals. Each card requires a compelling image (aspect-ratio-[4/3])

**Category Icons:** Use Heroicons via CDN (MusicNote, AcademicCap, TrophyIcon, SparklesIcon, etc.)

**Dashboard:** Optional charts/graphs for analytics using placeholder data

**Key Visual Strategy:** Photography-first approach. Events are inherently visual - let imagery drive engagement while maintaining clean, organized information hierarchy.