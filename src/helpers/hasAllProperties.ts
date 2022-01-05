function hasAllProperties(obj: object, props: string[]) {
  for (let propID = 0; propID < props.length; propID += 1) {
    if (!obj.hasOwnProperty(props[propID])) return false;
  }
  return true;
}

export default hasAllProperties;
