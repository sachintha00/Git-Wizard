import executeCommand from './execute_command.js';

const getLatestCommitMessage = async () => {
    try {
        const commandOutput = await executeCommand('git log -1 --pretty=%B origin/master');
        if (!commandOutput.trim()) {
            return "v1.0.0"
        }
        return commandOutput.trim();
    } catch (error) {
        console.error(`Error getting latest commit message: ${error}`);
        return null;
    }
};

export default getLatestCommitMessage