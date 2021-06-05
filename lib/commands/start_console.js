
import * as Repl from 'repl';
import * as vm from 'vm';
import * as util from 'util';

export default ({ environment, serviceNames, resetEnvironment }) => {
    const repl = Repl.start({
        prompt: 'pinstripe > ',

        preview: true,

        async eval(cmd, context, filename, callback) {
            if(cmd.length > 1){
                let result;
                try {
                    result = await vm.runInContext(cmd, context);
                    if(result != null && typeof result.__beforeInspect == 'function'){
                        await result.__beforeInspect();
                    }
                    callback(null, result);
                } catch (e) {
                    callback(e);
                }
            } else {
                callback();
            }
        },

        writer(out){
            if(out != null && typeof out.__inspect == 'function'){
                return out.__inspect();
            }
            return util.inspect(out, false, 2, true);
        }
    });

    serviceNames.forEach(serviceName => 
        Object.defineProperty(repl.context, serviceName, {
            get: () => environment[serviceName]
        })
    );

    repl.on('exit', resetEnvironment);
};

const isRecoverableError = (error) => {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
};
