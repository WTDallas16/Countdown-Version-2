import { format } from 'date-fns';

interface DateInputProps {
  targetDate: Date;
  onChange: (date: Date) => void;
}

export function DateInput({ targetDate, onChange }: DateInputProps) {
  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  const dateValue = format(targetDate, "yyyy-MM-dd'T'HH:mm");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Date & Time
      </label>
      <input
        type="datetime-local"
        value={dateValue}
        onChange={(e) => handleDateChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500 mt-1">
        {format(targetDate, 'MMMM d, yyyy at h:mm a')}
      </p>
    </div>
  );
}
