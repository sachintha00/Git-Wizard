import chalk from 'chalk';
import inquirer from 'inquirer';
import executeCommand from '../helpers/execute_command.js';
import getCurrentGitBranch from '../helpers/current_git_branch.js';
import getBranchIdFromBranchName from './get_branch_id.js';
import { exit } from 'process';
import gradient from 'gradient-string'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner';
import getVersionTagsWithHashes from '../helpers/get_version_tags_with_hashes.js'
import { masterMenu } from '../constants/enums.js'
import getLatestCommitMessage from '../helpers/get_latest_commit_message_from_origin_master.js'

async function getLatestVersionTag() {
    try {
        const latestVersionTag = await executeCommand(`git ls-remote --tags origin | awk '{print $2}' | grep -E '^(refs/tags/v)' | sed 's#refs/tags/##' | sort -V | tail -n 1`);
        return latestVersionTag;
    } catch (error) {
        console.error(chalk.red('Error getting the latest Version tag:', error.message));
        throw error;
    }
}

async function releaseVersionTag() {
    try {
        console.log(chalk.bold(gradient.pastel(figlet.textSync("Releasing Version Tag"))));
        console.log("\n")
        const spinnerReleaseVersionTag = createSpinner('Processing Version tags...')
        spinnerReleaseVersionTag.start()
        const latestTag = await getLatestVersionTag()
        spinnerReleaseVersionTag.stop()

        if (latestTag) {
            spinnerReleaseVersionTag.start()
            const newUpdatedTag = await getLatestCommitMessage();
            spinnerReleaseVersionTag.success("Process completed successfully.")

            console.log("\n")

            console.log(chalk.bold(chalk.green("Latest Version Tag:")));
            console.log(chalk.yellow(`\t${latestTag}\n`));

            console.log(chalk.bold(chalk.blue("Updated Version Tag:")));
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
                const spinnerRelease = createSpinner('Releasing Version tag...')
                spinnerRelease.start()
                await executeCommand(`git tag ${newUpdatedTag} && git push origin ${newUpdatedTag}`)
                spinnerRelease.success()
                console.log('Successfuly release tag...');
            } else {
                console.log('Release aborted by the user.');
                exit(0)
            }
        } else {

            const updatedVersion = `v1.1.0`;

            console.log("\n")

            console.log(chalk.bold(chalk.blue("First Version Tag:")));
            console.log(chalk.yellow(`\t${updatedVersion}`));

            console.log("\n")

            const { shouldContinue } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'shouldContinue',
                    message: 'Do you want to continue with the release?',
                },
            ]);

            if (shouldContinue) {
                const spinnerFirstVersion = createSpinner('Releasing Version tag...')
                spinnerFirstVersion.start()
                await executeCommand(`git tag ${updatedVersion} && git push origin ${updatedVersion}`)
                console.log(chalk.green('Successfuly release tag...'));
                spinnerFirstVersion.success()
                console.log('Successfuly release tag...');
            } else {
                console.log('Release aborted by the user.');
                exit(0)
            }
        }
    } catch (error) {
        console.error(chalk.red('Error in release process:', error.message));
    }
}

async function revertLatestVersionTag() {
    try {
        console.log(chalk.bold(gradient.pastel(figlet.textSync("Revert Version Tag"))));
        console.log("\n")
        const spinnerReleaseVersionTag = createSpinner('Fetching latest tag...')
        spinnerReleaseVersionTag.start()
        const latestTag = await getLatestVersionTag();
        spinnerReleaseVersionTag.success("Process completed successfully.")

        if (latestTag) {

            console.log("\n")

            console.log(chalk.bold(chalk.green("Latest Version Tag:")));
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
                const spinnerRevert = createSpinner('Reverting Version tag...')
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

const rollBackVersion = async () => {
    try {
        const tagsWithHashes = await getVersionTagsWithHashes()

        const choices = tagsWithHashes.map(({ tag, hash }, index) => ({
            name: `[${index + 1}] ${tag}`,
            value: { tag, hash }
        }));

        choices.push({ name: '[0] Exit', value: masterMenu.EXIT });

        const tag = await inquirer.prompt({
            name: "tag_info",
            type: 'list',
            message: 'Choose one',
            choices: choices
        });

        if (tag.tag_info === masterMenu.EXIT) {
            console.log('Rollback aborted by the user.');
            exit(0)
        } else {
            const spinnerRollback = createSpinner('Rollback Version tag...')
            spinnerRollback.start()
            await executeCommand(`git tag --delete ${tag.tag_info.tag} && git push origin --delete ${tag.tag_info.tag}`)
            await executeCommand(`git tag ${tag.tag_info.tag} ${tag.tag_info.hash} && git push origin ${tag.tag_info.tag}`)
            spinnerRollback.success()
        }
    } catch (error) {
        console.error(chalk.red('Error in rollback process:', error.message));
    }
}

export { releaseVersionTag, revertLatestVersionTag, rollBackVersion };