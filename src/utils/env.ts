export function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var ${name}. Check your .env file or the GitHub secrets.`);
  }
  return value;
}
