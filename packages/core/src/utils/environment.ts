export const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) throw new Error(`${name} not found`);

  return value;
};

export default getEnvironmentVariable;
