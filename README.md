# Availability Scheduler

A platform for coordinating meeting times across different time zones. Users can create events, collect availability from participants, and see a heatmap of the best meeting times.

## Features

- **User Authentication** - Secure email/password signup and login with Supabase
- **Create Events** - Set up scheduling events with titles, descriptions, and duration
- **Share Events** - Get a shareable link to invite others without requiring login
- **Granular Availability** - Select availability by hour for each day of the week
- **Time Zone Support** - Everyone sees times in their own local timezone
- **Heatmap Visualization** - See availability patterns with color-coded heatmap
- **Individual Responses** - View who submitted availability and their timezone

## Setup Instructions

### 1. Database Setup

The app uses Supabase PostgreSQL with the following tables:
- `profiles` - User profiles with timezone preferences
- `events` - Created scheduling events
- `event_responses` - Participant responses
- `availability_slots` - Hourly availability slots

**To set up the database:**

Run the SQL scripts in order:
1. `scripts/01_create_tables.sql` - Creates all tables and RLS policies
2. `scripts/02_profile_trigger.sql` - Auto-creates profile on signup

You can run these scripts in the Supabase SQL editor or let v0 execute them.

### 2. Environment Variables

The following environment variables are required (automatically set when Supabase is connected):

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

For local development, you may also set:
\`\`\`
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 3. Running Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to get started.

## How It Works

### For Event Creators

1. Sign up or login
2. Create a new event with title, description, and duration
3. Share the event link with participants
4. View responses and see the availability heatmap

### For Event Participants

1. Go to the shared event link (no login required!)
2. Enter your name and select your timezone
3. Select available time slots on the calendar (in your local time)
4. Submit your availability
5. Organizer can view all responses and find the best meeting time

## Architecture

- **Frontend**: Next.js 16 with React, shadcn/ui components
- **Backend**: Vercel's Next.js App Router with Server Actions
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: Supabase Authentication
- **Styling**: Tailwind CSS

## Key Components

- `app/auth/*` - Authentication pages (login, signup)
- `app/dashboard/*` - User dashboard and event list
- `app/event/create` - Event creation form
- `app/event/[id]/join` - Participant availability form
- `app/event/[id]/results` - Heatmap and results view
- `components/availability-calendar` - Calendar selection interface
- `components/heatmap-view` - Results visualization

## Security

- All data protected with Supabase Row Level Security (RLS)
- Email verification required for signup
- Users can only see their own events
- Event responses are publicly viewable (by design)
- Availability slots protected by RLS policies

## Time Zone Handling

- Each participant selects their timezone when responding
- Calendar interface shows all times in participant's selected timezone
- Heatmap aggregates data across all timezones
- System automatically detects browser timezone as default

## Future Enhancements

- Export results to calendar formats (ICS, Google Calendar)
- Email notifications for new responses
- Admin dashboard for organizers
- Meeting duration suggestions based on heatmap
- Video integration for virtual meetings
