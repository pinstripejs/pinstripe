
export const js = async ({ filePath }) => {
    await import(filePath);
}
