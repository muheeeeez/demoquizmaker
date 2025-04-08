/**
 * Format a date to a string in the format MM/DD/YYYY
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Format a time string from HH:MM:SS to HH:MM AM/PM
 * @param {string} timeString - The time string to format (HH:MM:SS)
 * @returns {string} The formatted time string (HH:MM AM/PM)
 */
export const formatTimeString = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  
  return `${formattedHours}:${minutes} ${ampm}`;
}; 