import { useState } from 'react'
import { BigCalendar, type CalendarData, type WorkingHoursConfig } from 'react-tailwind-calendar'
import { addDays, setHours, setMinutes } from 'date-fns'

function App() {
  const today = new Date()
  const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  // Örnek çalışma saatleri (Pazartesi-Cuma, 09:00-17:00)
  const workingHours: WorkingHoursConfig = [
    { day: 'Monday', start_time: '09:00', end_time: '12:00' },
    { day: 'Monday', start_time: '13:00', end_time: '17:00' },
    { day: 'Tuesday', start_time: '09:00', end_time: '17:00' },
    { day: 'Wednesday', start_time: '09:00', end_time: '17:00' },
    { day: 'Thursday', start_time: '09:00', end_time: '17:00' },
    { day: 'Friday', start_time: '09:00', end_time: '17:00' },
  ]

  // Örnek event verileri
  const [events] = useState<CalendarData[]>([
    {
      id: '1',
      startDate: setMinutes(setHours(addDays(defaultStartDate, 0), 9), 0),
      endDate: setMinutes(setHours(addDays(defaultStartDate, 0), 10), 30),
      title: 'Team Meeting',
      type: 'meeting',
      location: 'Conference Room A',
      people: [
        {
          image: 'https://i.pravatar.cc/150?img=1',
          alt: 'John Doe',
          color: 'blue',
        },
        {
          image: 'https://i.pravatar.cc/150?img=2',
          alt: 'Jane Smith',
          color: 'green',
        },
      ],
    },
    {
      id: '2',
      startDate: setMinutes(setHours(addDays(defaultStartDate, 0), 11), 0),
      endDate: setMinutes(setHours(addDays(defaultStartDate, 0), 11), 45),
      title: 'Client Call',
      type: 'meeting',
      link: 'https://zoom.us/j/123456789',
      platform: 'Zoom',
      people: [
        {
          image: 'https://i.pravatar.cc/150?img=3',
          alt: 'Client Name',
          color: 'purple',
        },
      ],
    },
    {
      id: '3',
      startDate: setMinutes(setHours(addDays(defaultStartDate, 1), 14), 0),
      endDate: setMinutes(setHours(addDays(defaultStartDate, 1), 15), 30),
      title: 'Project Review',
      type: 'event',
      location: 'Office',
    },
    {
      id: '4',
      startDate: setMinutes(setHours(addDays(defaultStartDate, 2), 10), 0),
      endDate: setMinutes(setHours(addDays(defaultStartDate, 2), 12), 0),
      title: 'Workshop',
      type: 'event',
      location: 'Training Room',
      people: [
        {
          image: 'https://i.pravatar.cc/150?img=4',
          alt: 'Instructor',
          color: 'orange',
        },
        {
          image: 'https://i.pravatar.cc/150?img=5',
          alt: 'Assistant',
          color: 'teal',
        },
        {
          image: 'https://i.pravatar.cc/150?img=6',
          alt: 'Helper',
          color: 'pink',
        },
        {
          image: 'https://i.pravatar.cc/150?img=7',
          alt: 'Helper 2',
          color: 'cyan',
        },
      ],
    },
    {
      id: '5',
      startDate: setMinutes(setHours(addDays(defaultStartDate, 3), 9), 30),
      endDate: setMinutes(setHours(addDays(defaultStartDate, 3), 10), 0),
      title: 'Quick Standup',
      type: 'meeting',
      completed: true,
    },
  ])

  const handleSlotClick = (data: { date: string; time: string }) => {
    console.log('Slot clicked:', data)
  }

  const handleEventClick = (event: CalendarData, date: Date) => {
    console.log('Event clicked:', event, date)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Packages list (for future expansion)
  const packages = [
    {
      name: 'react-tailwind-calendar',
      description: 'A flexible and customizable big calendar component for React',
      install: 'npm install react-tailwind-calendar',
    },
    // Future packages can be added here
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-gray-900">
              React Tailwind Calendar
            </a>
            <nav className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            A flexible calendar component
            <br />
            <span className="text-gray-600">for React</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            A customizable big calendar component built with React, TypeScript, and Tailwind CSS
          </p>
        </div>

        {/* Install Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Install React Tailwind Calendar</h2>
          <div className="bg-gray-900 rounded-lg p-4 md:p-6 relative group">
            <code className="text-green-400 font-mono text-sm md:text-base block overflow-x-auto">
              npm install react-tailwind-calendar
            </code>
            <button
              onClick={(e) => {
                copyToClipboard('npm install react-tailwind-calendar')
                const button = e.currentTarget
                const originalHTML = button.innerHTML
                button.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                setTimeout(() => {
                  button.innerHTML = originalHTML
                }, 1000)
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Demo */}
        <div className="mb-16">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <BigCalendar
                defaultStartDate={defaultStartDate}
                totalShowingDays={6}
                events={events}
                workingHours={workingHours}
                timeFormat="12h"
                onSlotClick={handleSlotClick}
                onEventClick={handleEventClick}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Packages List */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Packages</h2>
          <ul className="space-y-3">
            {packages.map((pkg) => (
              <li
                key={pkg.name}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <a
                    href={`https://www.npmjs.com/package/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {pkg.name}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    copyToClipboard(pkg.install)
                    const button = e.currentTarget
                    const originalText = button.textContent
                    button.textContent = 'Copied!'
                    setTimeout(() => {
                      button.textContent = originalText
                    }, 1000)
                  }}
                  className="ml-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-mono whitespace-nowrap"
                >
                  {pkg.install}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Package</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://www.npmjs.com/package/react-tailwind-calendar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    npm
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://www.npmjs.com/package/react-tailwind-calendar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://www.npmjs.com/package/react-tailwind-calendar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    npm
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} React Tailwind Calendar. Made with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
