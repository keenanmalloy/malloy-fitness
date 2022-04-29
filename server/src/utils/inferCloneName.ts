export const inferCloneName = (name: string) => {
  const nameParts = name.split(' ');
  const lastNamePart = nameParts[nameParts.length - 1];
  const lastNamePartNumber = parseInt(lastNamePart, 10);
  if (isNaN(lastNamePartNumber)) {
    return `${name} (copy)`;
  }
  const newName = nameParts
    .slice(0, nameParts.length - 1)
    .join(' ')
    .concat(` (copy ${lastNamePartNumber + 1})`);
  return newName;
};
