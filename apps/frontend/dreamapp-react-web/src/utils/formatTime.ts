/* eslint-disable */
export const formatTime = (timestamp: string, format: string) => {
  const date = new Date(parseInt(timestamp));
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return format
    .replace(/yyyy/g, year.toString())
    .replace(/yy/g, year.toString().slice(2))
    .replace(/MMM/g, months[month])
    .replace(/MM/g, month < 9 ? '0' + (month + 1) : (month + 1).toString())
    .replace(/M/g, (month + 1).toString())
    .replace(/dd/g, day < 10 ? '0' + day : day.toString())
    .replace(/d/g, day.toString())
    .replace(/ddd/g, days[dayOfWeek])
    .replace(/HH/g, hour < 10 ? '0' + hour : hour.toString())
    .replace(/H/g, hour.toString())
    .replace(/hh/g, (hour % 12 || 12).toString())
    .replace(/h/g, (hour % 12 || 12).toString())
    .replace(/mm/g, minute < 10 ? '0' + minute : minute.toString())
    .replace(/m/g, minute.toString())
    .replace(/ss/g, second < 10 ? '0' + second : second.toString())
    .replace(/s/g, second.toString());
};
