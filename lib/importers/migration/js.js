
export const js = async ({ filePath, name, defineMigration, snakeify }) => {
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineMigration(snakeify(name), fn);
    }
}
