const convertDateToServerTZ = async (time) => {
  try {
    const now = new Date().getTime();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const resolvedTime = new Date(Date.parse(time));
    const newRoutineTime = new Date(resolvedTime).toLocaleString("en-US", {
      timeZone,
    });
    const newResolvedTime = new Date(newRoutineTime).toLocaleString();
    const msTime = Date.parse(newResolvedTime);
    if (isNaN(msTime)) throw [400, "Invalid Time"];
    else {
      if (now > msTime) throw [400, "The time you entred is passed"];
      return msTime;
    }
  } catch (error) {
    throw error;
  }
};

export { convertDateToServerTZ };
