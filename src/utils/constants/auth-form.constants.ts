export const EMAIL_LENGTH_MIN = 5;
export const EMAIL_LENGTH_MAX = 255;
export const EMAIL_REGEXP = new RegExp(/^[\w\.-]+@[\w\.-]+\.\w+$/);

/*
  This regular expression enforces the following criteria:
  At least one alphabetical character.
  At least one digit.
  At least one special character from @$!%*#?&.
  Minimum length of 8 characters.
  Maximum length of 128 characters.
*/
export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 128;
export const PASSWORD_REGEXP = new RegExp(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._-])[A-Za-z\d@$!%*#?&._-]{8,128}$/
);
