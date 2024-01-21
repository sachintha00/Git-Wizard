import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import executeCommand from './execute_command.js';
import { createSpinner } from 'nanospinner';

const headerStyle = (text, color) => chalk.bold[color](text);

const getUnmergedBranches = async () => {
    const commandOutput = await executeCommand('git branch --no-merged');
    const unmergedBranches = commandOutput
        .split('\n')
        .filter(branch => /^( |\*) (do|fix)/.test(branch))
        .map(branch => branch.trim());

    return unmergedBranches;
};

const mergeToDev = async (branch) => {
    const isFixBranch = branch.startsWith('fix');

    if (isFixBranch) {
        await executeCommand(`git merge --no-ff "${branch}" -m "Merge branch '${branch}' into dev"`);
        await executeCommand('git push');
    } else {
        await executeCommand(`git merge ${branch}`);
        await executeCommand('git push');
    }

    await executeCommand(`git branch --delete "${branch}" && git push origin --delete "${branch}"`);
};

const chooseBranch = async () => {
    const unmergedBranches = await getUnmergedBranches();

    if (unmergedBranches.length > 0) {
        console.log(`Choose ${headerStyle('branches', '#E36D5D')} to operate on:`);

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

    const spinner = createSpinner('Loading...');
    spinner.start();

    try {
        await chooseBranch();
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    } finally {
        spinner.stop();
    }
};

export default mergeBranchesToDev
