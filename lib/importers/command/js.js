
export default async ({ filePath, name, defineCommand, dasherize }) => {
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineCommand(dasherize(name), fn);
    }
};
