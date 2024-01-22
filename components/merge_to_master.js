import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import executeCommand from '../helpers/execute_command.js';
import getLatestCommitMessage from '../helpers/get_latest_commit_message_from_origin_master.js';
import { createSpinner } from 'nanospinner';
import { exit } from 'process'

const headerStyle = (text, color) => chalk.bold[color](text);

const getUnmergedBranches = async () => {
    const filterBranchSpinner = createSpinner('Please wait while filter the branches...');
    filterBranchSpinner.start();
    const commandOutput = await executeCommand('git branch --no-merged');
    const unmergedBranches = commandOutput
        .split('\n')
        .filter(branch => branch.trim() === 'dev' || branch.trim().startsWith('fix'))
        .map(branch => branch.trim());
    filterBranchSpinner.success()

    return unmergedBranches;
};

const getCommitNewVersionCommitMessage = async (branch) => {
    try {
        const latestCommitMessage = await getLatestCommitMessage()
        const [, major, minor, patch] = latestCommitMessage.match(/v(\d+)\.(\d+)\.(\d+)/) || [];
        let updatedMinor = 0;
        let updatedPatch = 0;
        
        if (!latestCommitMessage || major === undefined) {
            major = 1
            updatedMinor = 1
            updatedPatch = 0
        } else if (branch.startsWith('fix')) {
            updatedMinor = minor
            updatedPatch = parseInt(patch, 10) + 1;
        } else if (branch === "dev") {
            updatedMinor = parseInt(minor, 10) + 1;
            updatedPatch = 0
        } else {
            console.warn('Unknown branch. Keeping the current version.');
            exit(0);
        }
        
        const updatedCommitVersion = `v${major}.${updatedMinor}.${updatedPatch}`;
        return updatedCommitVersion;
    } catch (error) {
        console.error(chalk.red('Error updating version:', error.message));
        throw error;
    }
}

const mergeToMaster = async (branch) => {
    const commitMessage = await getCommitNewVersionCommitMessage(branch)
    console.log("\n")
    const mergeSpinner = createSpinner("Merging branch into 'master' branch. This may take a moment, please stand by...");

    mergeSpinner.start();
    await executeCommand(`git merge --no-ff "${branch}" -m ${commitMessage} `);
    await executeCommand('git push');
    mergeSpinner.success();
};

const chooseBranch = async () => {
    const unmergedBranches = await getUnmergedBranches();

    if (unmergedBranches.length > 0) {
        console.log(`Choose branches to operate on:`);

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedBranch',
                message: 'Select branch:',
                choices: unmergedBranches,
            },
        ]);

        const selectedBranch = answers.selectedBranch;
        await mergeToMaster(selectedBranch);
    }
};

const mergeBranchesToMaster = async () => {
    console.log(gradient.instagram(figlet.textSync('Merge  To  Master')));
    console.log("\n")

    try {
        await chooseBranch();
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }
};

export default mergeBranchesToMaster
