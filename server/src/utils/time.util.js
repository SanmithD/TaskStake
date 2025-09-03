export const  withinWindow = (now, start, end) =>{
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

