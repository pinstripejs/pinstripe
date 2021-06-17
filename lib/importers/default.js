
export default async ({ extension, filePath }) => {
    if(extension != 'js'){
        return;
    }
    await import(filePath);
};
