
export default async filePath => (await import(filePath)).default;
