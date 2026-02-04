import { useState } from 'react';
import { useCreateBulkDeparturesMutation } from '../../../../../../../Services/departuresApiSlice';

const BulkAddDepartureModal = ({ packageSlug, isOpen, onClose }) => {
  const [createBulkDepartures, { isLoading }] = useCreateBulkDeparturesMutation();
  
  const weekdayOptions = [
    { value: 'MON', label: 'Mon' },
    { value: 'TUE', label: 'Tue' },
    { value: 'WED', label: 'Wed' },
    { value: 'THU', label: 'Thu' },
    { value: 'FRI', label: 'Fri' },
    { value: 'SAT', label: 'Sat' },
    { value: 'SUN', label: 'Sun' },
  ];
  
  const [formData, setFormData] = useState({
    start: '',
    end: '',
    weekdays: [],
    exclude: '',
    capacity: '',
    priceOverride: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeekdayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter(d => d !== day)
        : [...prev.weekdays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.weekdays.length === 0) {
      setError('Please select at least one weekday');
      return;
    }

    try {
      const payload = {
        start: formData.start,
        end: formData.end,
        weekdays: formData.weekdays,
        capacity: parseInt(formData.capacity),
      };

      if (formData.exclude.trim()) {
        payload.exclude = formData.exclude.split(',').map(d => d.trim());
      }

      if (formData.priceOverride) {
        payload.priceOverride = formData.priceOverride;
      }

      await createBulkDepartures({
        slug: packageSlug,
        data: payload
      }).unwrap();
      
      setFormData({
        start: '',
        end: '',
        weekdays: [],
        exclude: '',
        capacity: '',
        priceOverride: ''
      });
      
      onClose();
    } catch (err) {
      setError(err?.data?.message || 'Failed to add departures');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Add Departures</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Start and End Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Weekdays */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Weekdays <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {weekdayOptions.map((day) => (
                  <label
                    key={day.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.weekdays.includes(day.value)}
                      onChange={() => handleWeekdayToggle(day.value)}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exclude Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Exclude Dates (comma-separated)
              </label>
              <input
                type="text"
                name="exclude"
                value={formData.exclude}
                onChange={handleChange}
                placeholder="2024-12-25, 2024-01-01"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Capacity and Price Override Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Price Override
                </label>
                <input
                  type="text"
                  name="priceOverride"
                  value={formData.priceOverride}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 disabled:bg-red-300 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Departures'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAddDepartureModal;