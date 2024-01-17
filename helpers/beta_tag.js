import chalk from 'chalk';
import inquirer from 'inquirer';
import executeCommand from './execute_command.js';
import getCurrentGitBranch from './current_git_branch.js';
import getBranchIdFromBranchName from './get_branch_id.js';
import { exit } from 'process';
import gradient from 'gradient-string'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner';

async function getLatestBetaTag() {
    try {
        const latestBetaTag = await executeCommand(`git ls-remote --tags origin | awk '{print $2}' | grep -E '^(refs/tags/beta-v)' | sed 's#refs/tags/##' | sort -V | tail -n 1`);
        return latestBetaTag;
    } catch (error) {
        console.error(chalk.red('Error getting the latest beta tag:', error.message));
        throw error;
    }
}

async function updateVersion(currentVersion) {
    try {
        const currentBranch = await getCurrentGitBranch();
        let updatedMinor = 0;
        let updatedPatch = 0;
        const [, major, minor, patch] = currentVersion.match(/beta-v(\d+)\.(\d+)\.(\d+)/) || [];

        if (currentBranch.startsWith('do')) {
            const branchId = await getBranchIdFromBranchName(currentBranch)
            // updatedMinor = parseInt(minor, 10) + 1;
            updatedMinor = branchId
        } else if (currentBranch.startsWith('fix')) {
            const branchId = await getBranchIdFromBranchName(currentBranch)
            // updatedPatch = parseInt(patch, 10) + 1;
            updatedPatch = branchId
        } else {
            console.warn('Unknown branch. Keeping the current version.');
            exit(0);
        }

        const updatedVersion = `beta-v${major}.${updatedMinor}.${updatedPatch}`;
        return updatedVersion;
    } catch (error) {
        console.error(chalk.red('Error updating version:', error.message));
        throw error;
    }
}

async function releaseBetaTag() {
    try {
        console.log(chalk.bold(gradient.pastel(figlet.textSync("Releasing Beta Tag"))));
        console.log("\n")
        const spinnerReleaseBetaTag = createSpinner('Processing beta tags...')
        spinnerReleaseBetaTag.start()
        const latestTag = await getLatestBetaTag();
        spinnerReleaseBetaTag.stop()

        if (latestTag) {
            spinnerReleaseBetaTag.start()
            const newUpdatedTag = await updateVersion(latestTag);
            spinnerReleaseBetaTag.success("Process completed successfully.")

            console.log("\n")

            console.log(chalk.bold(chalk.green("Latest Beta Tag:")));
            console.log(chalk.yellow(`\t${latestTag}\n`));

            console.log(chalk.bold(chalk.blue("Updated Beta Tag:")));
            console.log(chalk.yellow(`\t${newUpdatedTag}`));

            console.log("\n")

            const { shouldContinue } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'shouldContinue',
                    message: 'Do you want to continue with the release?',
                },
            ]);

            if (shouldContinue) {
                const spinnerRelease = createSpinner('Releasing beta tag...')
                spinnerRelease.start()
                await executeCommand(`git tag ${newUpdatedTag} && git push origin ${newUpdatedTag}`)
                spinnerRelease.success()
                console.log('Successfuly release tag...');
            } else {
                console.log('Release aborted by the user.');
                exit(0)
            }
        } else {
            const spinnerFirstBeta = createSpinner('Releasing beta tag...')
            spinnerFirstBeta.start()
            let updatedMinor = 0;
            let updatedPatch = 0;

            const currentBranch = await getCurrentGitBranch();

            if (currentBranch.startsWith('do')) {
                const branchId = await getBranchIdFromBranchName(currentBranch)
                updatedMinor = branchId
                updatedPatch = 0
            } else if (currentBranch.startsWith('fix')) {
                const branchId = await getBranchIdFromBranchName(currentBranch)
                updatedMinor = 0
                updatedPatch = branchId
            }

            const updatedVersion = `beta-v1.${updatedMinor}.${updatedPatch}`;
            await executeCommand(`git tag ${updatedVersion} && git push origin ${updatedVersion}`)
            spinnerFirstBeta.success()
            console.log(chalk.green('Successfuly release tag...'));
        }
    } catch (error) {
        console.error(chalk.red('Error in release process:', error.message));
    }
}

async function revertLatestBetaTag() {
    try {
        console.log(chalk.bold(gradient.pastel(figlet.textSync("Revert Beta Tag"))));
        console.log("\n")
        const spinnerReleaseBetaTag = createSpinner('Fetching latest tag...')
        spinnerReleaseBetaTag.start()
        const latestTag = await getLatestBetaTag();
        spinnerReleaseBetaTag.success("Process completed successfully.")

        if (latestTag) {

            console.log("\n")

            console.log(chalk.bold(chalk.green("Latest Beta Tag:")));
            console.log(chalk.yellow(`\t${latestTag}\n`));

            console.log("\n")

            const { shouldContinue } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'shouldContinue',
                    message: 'Do you want to continue with the revert tag?',
                },
            ]);

            if (shouldContinue) {
                const spinnerRevert = createSpinner('Reverting beta tag...')
                spinnerRevert.start()
                await executeCommand(`git tag --delete ${latestTag} && git push origin --delete ${latestTag}`)
                spinnerRevert.success()
                console.log(chalk.green('Successfuly revert tag...'));
            } else {
                console.log('Revert aborted by the user.');
                exit(0)
            }
        } else {
            console.log(chalk.red(`Didn't find any tags!`));
        }
    } catch (error) {
        console.error(chalk.red('Error in revert process:', error.message));
    }
}

export { releaseBetaTag, revertLatestBetaTag };
