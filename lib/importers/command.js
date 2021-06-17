
export default async ({ extension, filePath, name, defineCommand, dasherize }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineCommand(dasherize(name), fn);
    }
};
