
import { FileInterpreter } from '../file_interpreter.js';

export default async ({ filePath, relativeFilePath, defineController }) => {
    const name = relativeFilePath.replace(/^\//, '').replace(/\.[^\/]*$/, '');
    const fn = await FileInterpreter.interpret(filePath);
    if(typeof fn == 'function'){
        defineController(name, fn);
    }
};
