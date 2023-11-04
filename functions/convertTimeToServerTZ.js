const convertTimeToServerTZ = async (time) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const resolvedTime = new Date(Date.parse(time));
  const newRoutineTime = new Date(resolvedTime).toLocaleString("en-US", {
    timeZone,
  });
  const newResolvedTime = new Date(newRoutineTime);
  const hours = newResolvedTime.getHours();
  const minutes = newResolvedTime.getMinutes();
  const seconds = newResolvedTime.getSeconds();
  const msTime = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
  return msTime;
};

export { convertTimeToServerTZ };
