import { exec } from 'child_process';

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

export default executeCommand