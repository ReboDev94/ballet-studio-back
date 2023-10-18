/*
  Debe contener al menos una letra minúscula (a-z).
  Debe contener al menos una letra mayúscula (A-Z).
  Debe contener al menos un dígito (\d).
  Debe contener al menos un carácter especial entre '#', '$', '@', '!', '%', '&', '*', o '?'.
  La longitud de la cadena debe estar entre 8 y 30 caracteres.
*/
export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/;
