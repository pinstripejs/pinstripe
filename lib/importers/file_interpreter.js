

export default async ({ extension, filePath, name, defineFileInterpreter }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineFileInterpreter(name, fn);
    }
}
