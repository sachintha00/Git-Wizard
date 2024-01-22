import executeCommand from './execute_command.js';

const getVersionTagsWithHashes = async () => {
    try {
        const gitShowRefOutput = await executeCommand(`git show-ref --tags -d | grep -E '^(.*refs/tags/v.*)$' | awk '{print $1, $2}' | sed 's#refs/tags/##'`);
        const tags = gitShowRefOutput
            .trim()
            .split('\n')
            .map(async (line) => {
                const [hash, tag] = line.split(' ');

                // Get the parent commit hash using git rev-list
                const parentHash = await executeCommand(`git rev-list -n 2 ${hash} | tail -n 1`);
                const parentCommitHash = parentHash.trim();

                return { tag, hash, parentCommitHash };
            });

        return Promise.all(tags);
    } catch (error) {
        console.error(`Error getting version tags message: ${error}`);
        return null;
    }
};

export default getVersionTagsWithHashes