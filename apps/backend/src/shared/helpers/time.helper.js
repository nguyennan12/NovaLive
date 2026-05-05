export const checkTimeStatus = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const now = new Date()

  if (start <= now) {
    return {
      isValid: false,
      isOngoing: false,
      message: 'Invalide Time'
    }
  }

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      isOngoing: false,
      message: 'Invalide Time'
    }
  }

  if (start > end) {
    return {
      isValid: false,
      isOngoing: false,
      message: 'Start time not greather than end time'
    }
  }

  const isOngoing = now >= start && now <= end
  let statusMessage = ''
  if (isOngoing) {
    statusMessage = 'On going'
  } else if (now < start) {
    statusMessage = 'Up comming'
  } else {
    statusMessage = 'Ending'
  }

  return {
    isValid: true,
    isOngoing: isOngoing,
    message: statusMessage
  }
}