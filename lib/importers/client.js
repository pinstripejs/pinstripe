
export const filePaths = [];

export default async ({ extension, filePath }) => {
    if(extension == 'js' && !filePaths.includes(filePath)){
        filePaths.push(filePath);
    }
};