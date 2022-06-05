export const inferCloneName = (name: string) => {
  const versioning = determineVersion(name);

  switch (versioning) {
    case 'semantic':
      // increment patch version of semantic versioning
      const semanticParts = name.split('.');
      const lastPart = semanticParts[semanticParts.length - 1];
      const lastPartNumber = parseInt(lastPart, 10);
      const newLastPart = lastPartNumber + 1;
      semanticParts[semanticParts.length - 1] = newLastPart.toString();
      return semanticParts.join('.');
    case 'decimal':
      // increment minor version of decimal versioning
      const parts = name.split(' ');
      const lastDecPart = parts[parts.length - 1];
      const decimalParts = lastDecPart.split('.');

      const secondToLastPart = decimalParts[decimalParts.length - 1];
      const secondToLastPartNumber = parseInt(secondToLastPart, 10);
      const newSecondToLastPart = secondToLastPartNumber + 1;

      return (
        parts.slice(0, parts.length - 1).join(' ') +
        ' ' +
        `${decimalParts[0]}.${newSecondToLastPart}`
      );
    case 'versioned':
      // increment major version of versioned versioning
      const versionedParts = name.split(' ');
      const versionedLastPart = versionedParts[versionedParts.length - 1];

      const versionedLastPartNumber = parseInt(
        versionedLastPart.replace('v', ''),
        10
      );
      const newVersionedLastPart = versionedLastPartNumber + 1;
      versionedParts[
        versionedParts.length - 1
      ] = `v${newVersionedLastPart.toString()}`;

      return versionedParts.join(' ');
    case 'alphabetic':
      // increment order by alphabetical versioning
      const alphabeticParts = name.split(' ');
      const alphabeticLastPart = alphabeticParts[alphabeticParts.length - 1];

      const alphabet = 'abcdefghijklmnopqrstuvwxyz';

      if (alphabeticLastPart.length > 1) {
        return `${name} a`;
      }

      const alphabeticLastPartNumber = parseInt(alphabeticLastPart, 10);
      if (isNaN(alphabeticLastPartNumber)) {
        const alphabetIndex = alphabet.indexOf(alphabeticLastPart.charAt(0));
        const newAlphabetIndex = alphabetIndex + 1;
        const newAlphabeticLastPart = alphabet.charAt(newAlphabetIndex);
        alphabeticParts[alphabeticParts.length - 1] = newAlphabeticLastPart;
        return alphabeticParts.join(' ');
      }

      const newAlphabeticLastPart = alphabeticLastPartNumber + 1;
      alphabeticParts[alphabeticParts.length - 1] =
        newAlphabeticLastPart.toString();
      return alphabeticParts.join(' ');
    case 'numeric':
      // increment minor version of numeric versioning
      const numericParts = name.split(' ');
      const numericLastPart = numericParts[numericParts.length - 1];
      const numericLastPartNumber = parseInt(numericLastPart, 10);
      const newNumericLastPart = numericLastPartNumber + 1;
      numericParts[numericParts.length - 1] = newNumericLastPart.toString();
      return numericParts.join(' ');
    case 'alphabetic-numeric':
      // increment minor version of alphabetic-numeric versioning
      const alphabeticNumericParts = name.split(' ');
      const alphabeticNumericLastPart =
        alphabeticNumericParts[alphabeticNumericParts.length - 1];

      const alphaNumericString = alphabeticNumericLastPart.replace(
        /[0-9]/g,
        ''
      );

      function extractNumber(string: string) {
        let numArray = string.split('').map((item) => {
          if (typeof +item === 'number' && !isNaN(+item)) return +item;
        });
        return +numArray.join('');
      }

      const alphabeticNumericLastPartNumber = extractNumber(
        alphabeticNumericLastPart
      );

      const newAlphabeticNumericLastPart = alphabeticNumericLastPartNumber + 1;
      alphabeticNumericParts[
        alphabeticNumericParts.length - 1
      ] = `${alphaNumericString}${newAlphabeticNumericLastPart.toString()}`;
      return alphabeticNumericParts.join(' ');
    case 'numeric-alphabetic':
      // increment minor version of numeric-alphabetic versioning
      const numericAlphabeticParts = name.split(' ');
      const numericAlphabeticLastPart =
        numericAlphabeticParts[numericAlphabeticParts.length - 1];

      const alpha = 'abcdefghijklmnopqrstuvwxyz';
      const numericAlphaString = numericAlphabeticLastPart.replace(
        /[0-9]/g,
        ''
      );

      const numericAlphabeticLastPartNumber = extractNumber(
        numericAlphabeticLastPart
      );

      const alphabetIndex = alpha.indexOf(numericAlphaString.charAt(0));
      const newAlphabetIndex = alphabetIndex + 1;
      const newNumericAlphabeticLastPart = alpha.charAt(newAlphabetIndex);
      numericAlphabeticParts[numericAlphabeticParts.length - 1] =
        newNumericAlphabeticLastPart;

      numericAlphabeticParts[
        numericAlphabeticParts.length - 1
      ] = `${numericAlphabeticLastPartNumber.toString()}${newNumericAlphabeticLastPart}`;
      return numericAlphabeticParts.join(' ');
    default:
      return name;
  }
};

export type Versioning =
  | 'semantic'
  | 'numeric'
  | 'alphabetic'
  | 'decimal'
  | 'versioned'
  | 'alphabetic-numeric'
  | 'numeric-alphabetic'
  | 'unknown';

export const determineVersion = (name: string): Versioning => {
  const nameParts = name.split(' ');
  const lastNamePart = nameParts[nameParts.length - 1];
  const lastNamePartNumber = parseInt(lastNamePart, 10);

  if (checkCount(lastNamePart, '.') > 1) return 'semantic';
  if (checkCount(lastNamePart, '.') > 0) return 'decimal';
  if (lastNamePart.includes('v')) return 'versioned';
  if (isNaN(lastNamePartNumber) && !doesStringHaveNumber(lastNamePart))
    return 'alphabetic';
  if (
    isFirstCharacterLetter(lastNamePart) &&
    doesStringHaveNumber(lastNamePart)
  )
    return 'alphabetic-numeric';

  if (isLastCharacterLetter(lastNamePart) && doesStringHaveNumber(lastNamePart))
    return 'numeric-alphabetic';
  if (typeof lastNamePartNumber === 'number') return 'numeric';
  return 'unknown';
};

const checkCount = (str: string, word: string) => str.split(word).length - 1;
const isFirstCharacterLetter = (str: string) => /^[a-z]/i.test(str.charAt(0));
const isLastCharacterLetter = (str: string) =>
  /[a-z]$/i.test(str.charAt(str.length - 1));
const isFirstCharacterNumber = (str: string) => /^[0-9]/i.test(str.charAt(0));
const doesStringHaveNumber = (str: string) => /\d/.test(str);
