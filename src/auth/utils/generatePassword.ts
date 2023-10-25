import { regexPassword } from 'src/common/utils';

const UPPERLETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERLETTERS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '1234567890';
const SPECIALS = '#$@!%&*?';

const randomLetters = (seed: string) => {
  const randomUpperLetters = Math.floor(Math.random() * seed.length);
  return seed.substring(randomUpperLetters, randomUpperLetters + 1);
};

const sortPassword = (password: string) => {
  const passwordArray = password.split('');
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  return passwordArray.join('');
};

export const generatePassword = () => {
  let password = '';
  password += [...Array(3)].map(() => randomLetters(UPPERLETTERS)).join('');
  password += [...Array(4)].map(() => randomLetters(LOWERLETTERS)).join('');
  password += [...Array(4)].map(() => randomLetters(NUMBERS)).join('');
  password += [...Array(2)].map(() => randomLetters(SPECIALS)).join('');
  password = sortPassword(password);
  if (!regexPassword.test(password)) generatePassword();
  return password;
};
