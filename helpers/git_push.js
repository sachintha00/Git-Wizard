import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

import executeCommand from './execute_command.js';
import getCurrentGitBranch from './current_git_branch.js'
import { gitStatus } from './git_status.js'
import { exit } from 'process';


async function commitAndPush(commitMessage) {
    try {
        const branchName = await getCurrentGitBranch()

        const confirmAddandCommit = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmAddandCommit',
                message: `Do you want to add and commit the changes to remote branch #${branchName}?`,
                default: true,
            },
        ]);

        if (confirmAddandCommit.confirmAddandCommit) {
            await executeCommand(`git add .`);
            await gitStatus()
            console.log("\n")
            await executeCommand(`git commit -m "${commitMessage}"`);
        } else {
            console.log(chalk.yellow('Push canceled by user.'));
            exit(0)
        }


        const spinnerCommit = createSpinner('Committing changes...')
        spinnerCommit.start()
        const remoteBranchExists = await executeCommand(`git ls-remote --heads origin ${branchName}`);
        spinnerCommit.success("done")
        console.log("\n")


        if (remoteBranchExists) {
            const confirmPush = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirmPush',
                    message: `Do you want to push changes to remote branch #${branchName}?`,
                    default: true,
                },
            ]);

            if (confirmPush.confirmPush) {
                await executeCommand(`git push origin ${branchName}`);
                console.log(chalk.green('Changes pushed successfully.'));
            } else {
                console.log(chalk.yellow('Push canceled by user.'));
                exit(0)
            }
        } else {
            const confirmForcePush = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirmForcePush',
                    message: `Remote branch #${branchName} does not exist. Do you want to force push?`,
                    default: false,
                },
            ]);

            if (confirmForcePush.confirmForcePush) {
                await executeCommand(`git push -f origin ${branchName}`);
                console.log(chalk.green('Force push successful.'));
            } else {
                console.log(chalk.yellow('Push canceled by user.'));
                exit(0)
            }
        }
    } catch (error) {
        console.error(chalk.red(`Error committing and pushing changes: ${error}`));
    }
}

export { commitAndPush }