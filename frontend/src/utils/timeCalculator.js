function calcUploadTime(utcDate) {
  const istDate = new Date(utcDate);
  const year = istDate.getFullYear();
  const month = istDate.getMonth();
  const date = istDate.getDate();
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  const currentDate = new Date();

  if (currentDate.getFullYear() !== year) {
    const yearsDifference = currentDate.getFullYear() - year;
    return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
  } else if (currentDate.getMonth() !== month) {
    const monthsDifference = currentDate.getMonth() - month;
    return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
  } else if (currentDate.getDate() !== date) {
    const daysDifference = currentDate.getDate() - date;
    return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
  } else if (currentDate.getHours() !== hour) {
    const hoursDifference = currentDate.getHours() - hour;
    return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
  } else if (currentDate.getMinutes() !== minute) {
    const minutesDifference = currentDate.getMinutes() - minute;
    return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
  } else {
    return `Cannot get time`;
  }
}

const calculateDuration = (dur) => {
  const time = Math.floor(dur);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export { calcUploadTime, calculateDuration };
