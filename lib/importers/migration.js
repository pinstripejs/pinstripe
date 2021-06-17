
export const js = async ({ extension, filePath, name, defineMigration, snakeify }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineMigration(snakeify(name), fn);
    }
}
