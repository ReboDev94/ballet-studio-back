export const IsOlder = (dateOfBirth: string) => {
  const currentDate = new Date();
  const date = new Date(dateOfBirth);
  return currentDate.getFullYear() - date.getFullYear() >= 18;
};
