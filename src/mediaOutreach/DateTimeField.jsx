import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// datetime-local input과 동일한 'YYYY-MM-DDTHH:mm' 로컬 문자열을 값으로 주고받는다.
function parseLocalValue(value) {
  return value ? new Date(value) : null
}

function toLocalValue(date) {
  if (!date) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function DateTimeField({ value, onChange, placeholder }) {
  return (
    <DatePicker
      selected={parseLocalValue(value)}
      onChange={(date) => onChange(toLocalValue(date))}
      showTimeSelect
      timeIntervals={15}
      dateFormat="yyyy-MM-dd HH:mm"
      placeholderText={placeholder}
      isClearable
      className="outreach-datefield"
      calendarClassName="outreach-datefield-calendar"
    />
  )
}
