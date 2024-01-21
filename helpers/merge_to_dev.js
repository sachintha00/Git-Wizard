import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import executeCommand from './execute_command.js';
import { createSpinner } from 'nanospinner';

const headerStyle = (text, color) => chalk.bold[color](text);

const getUnmergedBranches = async () => {
    const filterBranchSpinner = createSpinner('Please wait while filter the branches...');
    filterBranchSpinner.start();
    const commandOutput = await executeCommand('git branch --no-merged');
    const unmergedBranches = commandOutput
        .split('\n')
        .filter(branch => branch.trim().startsWith('do') || branch.trim().startsWith('fix'))
        .map(branch => branch.trim());
    filterBranchSpinner.success()

    return unmergedBranches;
};

const mergeToDev = async (branch) => {
    const isFixBranch = branch.startsWith('fix');

    if (isFixBranch) {
        const mergeSpinner = createSpinner("Merging branch into 'dev' branch. This may take a moment, please stand by..");
        mergeSpinner.start();
        await executeCommand(`git merge --no-ff "${branch}" -m "Merge branch '${branch}' into dev"`);
        await executeCommand('git push');
    } else {
        const mergeSpinner = createSpinner("Merging branch into 'dev' branch. This may take a moment, please stand by..");
        mergeSpinner.start();
        await executeCommand(`git merge ${branch}`);
        await executeCommand('git push');
    }

    await executeCommand(`git branch --delete "${branch}" && git push origin --delete "${branch}"`);
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
        await mergeToDev(selectedBranch);
    }
};

const mergeBranchesToDev = async () => {
    console.log(gradient.instagram(figlet.textSync('Merge  To  Dev')));

    try {
        await chooseBranch();
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }
};

export default mergeBranchesToDev
