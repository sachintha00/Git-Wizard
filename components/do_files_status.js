import chalk from 'chalk'
import gradient from 'gradient-string'
import figlet from 'figlet'
import inquirer from 'inquirer'

import executeCommand from './execute_command.js'
import getBranchIdFromBranchName from './get_branch_id.js'
import {getCommitMessage} from './git_commits.js'
import {commitAndPush} from './git_push.js'


async function displayGitStatus() {
    try {
        const gitStatus = await executeCommand('git status --porcelain');
        const commitLogs = await executeCommand('git log --name-status --oneline');

        console.log(chalk.bold(gradient.rainbow(figlet.textSync('Git Status'))));

        if (!gitStatus && !commitLogs) {
            console.log(chalk.green('No changes. Working directory is clean.'));
        } else {
            const statusLines = gitStatus.split('\n');

            console.log(chalk.yellow('\nChanges not staged for commit:'));
            statusLines
                .filter((line) => line.startsWith('M') || line.startsWith('??'))
                .forEach((line) => {
                    const file = line.substring(3);
                    console.log(chalk.red(`\tUnstaged: ${file}`));
                });


            console.log(chalk.red('\nChanges to be committed:'));
            statusLines
                .filter((line) => line.startsWith('A') || line.startsWith('M'))
                .forEach((line) => {
                    const file = line.substring(3);
                    console.log(chalk.green(`\tStaged: ${file}`));
                });


            console.log(chalk.blue('\nCommitted changes:'));
            const commitLines = commitLogs.split('\n');
            commitLines.forEach((line) => {
                const [commitInfo, ...files] = line.split('\t');
                const [commitHash, commitMessage] = commitInfo.split(' ');

                console.log(chalk.bold(`\tCommit: ${commitHash}`));
                console.log(chalk.yellow(`\t\tMessage: ${commitMessage}`));
                files.forEach((file) => {
                    console.log(chalk.blue(`\t\tFile: ${file}`));
                });
            });

            const branchId = await getBranchIdFromBranchName()
            const commitMessage = await getCommitMessage({branchNumber: branchId, issueType: "Feat"})
            await commitAndPush(commitMessage)
        }
    } catch (error) {
        console.error(chalk.red('Error fetching git status:', error));
    }
}

export default displayGitStatus