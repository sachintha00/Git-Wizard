import chalk from 'chalk';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import executeCommand from '../helpers/execute_command.js';
import getCurrentGitBranch from '../helpers/current_git_branch.js';
import getBranchIdFromBranchName from './get_branch_id.js';
import { getCommitMessage } from './git_commits.js';
import { exit } from 'process';

async function getFirstCommitSHA() {
    const currentBranch = await getCurrentGitBranch();
    const sha = await executeCommand(`git rev-list ^dev ${currentBranch} | tail -n 1`);
    const message = await executeCommand(`git log --format=%B -n 1 ${sha}`);
    return { sha, message };
}

async function squashToFirstCommitMessage(issueType) {
    try {
        const currentBranch = await getCurrentGitBranch();
        const currentBranchId = await getBranchIdFromBranchName(currentBranch);
        const firstCommit = await getFirstCommitSHA();
        const formattedNewCommitMessage = await getCommitMessage({ branchNumber: currentBranchId, issueType: issueType, topic: "Squash Commit" });

        console.log("\n")

        console.log(chalk.bold(gradient.instagram("First Commit Information")));
        console.log(chalk.green(`\tSHA: ${firstCommit.sha}`));
        console.log(chalk.blue(`\tMessage: ${firstCommit.message}\n`));

        console.log(chalk.bold(gradient.instagram("Formatted New Commit Message")));
        console.log(chalk.yellow(`\t${formattedNewCommitMessage}`));

        console.log("\n\n")

        const confirmSquash = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmSquash',
                message: `Do you want to squash to the first commit?`,
                default: true,
            },
        ]);

        if (confirmSquash.confirmSquash) {
            const spinnerSquash = createSpinner('Squashing to the first commit...')
            spinnerSquash.start()
            await executeCommand(`git reset --soft ${firstCommit.sha}`);
            await executeCommand(`git commit --amend -m "${formattedNewCommitMessage}"`);
            await executeCommand(`git push -f`);
            spinnerSquash.success("Squashing completed successfully.")
            console.log(chalk.green('Squashing completed successfully.'));
        } else {
            console.log(chalk.yellow('Squash canceled by user.'));
            exit(0)
        }
    } catch (error) {
        console.error(chalk.red(`Error in squashing to the first commit: ${error}`));
    }
}

export {squashToFirstCommitMessage };
