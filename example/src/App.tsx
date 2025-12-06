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

  // Örnek vardiya verileri (opsiyonel - vardiya görselleştirmesi için)
  // const shifts: ShiftData[] = [
  //   {
  //     startDate: setMinutes(setHours(addDays(defaultStartDate, 0), 9), 0),
  //     endDate: setMinutes(setHours(addDays(defaultStartDate, 0), 12), 0),
  //     type: 'working',
  //   },
  //   {
  //     startDate: setMinutes(setHours(addDays(defaultStartDate, 0), 13), 0),
  //     endDate: setMinutes(setHours(addDays(defaultStartDate, 0), 17), 0),
  //     type: 'working',
  //   },
  //   {
  //     startDate: setMinutes(setHours(addDays(defaultStartDate, 0), 12), 0),
  //     endDate: setMinutes(setHours(addDays(defaultStartDate, 0), 13), 0),
  //     type: 'break',
  //   },
  // ]

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
    alert(`Slot clicked: ${data.date} at ${data.time}`)
  }

  const handleEventClick = (event: CalendarData, date: Date) => {
    console.log('Event clicked:', event, date)
    alert(`Event clicked: ${event.title}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            React Tailwind Calendar
          </h1>
          <p className="text-lg text-gray-600">
            A flexible and customizable big calendar component for React
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <BigCalendar
            defaultStartDate={defaultStartDate}
            totalShowingDays={6}
            events={events}
            workingHours={workingHours}
            // shifts={shifts} // Vardiya görselleştirmesi için (opsiyonel)
            timeFormat="12h"
            onSlotClick={handleSlotClick}
            onEventClick={handleEventClick}
            className="w-full"
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Multiple day view with navigation</li>
            <li>✅ Working hours configuration</li>
            <li>✅ Shift visualization</li>
            <li>✅ Event types (meeting, event, default)</li>
            <li>✅ Click handlers for slots and events</li>
            <li>✅ 12h/24h time format support</li>
            <li>✅ Customizable avatars and styling</li>
            <li>✅ Responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App

