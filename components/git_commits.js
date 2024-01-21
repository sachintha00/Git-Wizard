import chalk from 'chalk'
import gradient from 'gradient-string'
import figlet from 'figlet'
import inquirer from 'inquirer'

async function getCommitMessage({ branchNumber, issueType, topic }) {
    console.log(chalk.bold(gradient.pastel(figlet.textSync(topic))));
    console.log("\n\n")
    const { commitMessage } = await inquirer.prompt([
        {
            type: 'input',
            name: 'commitMessage',
            message: `Enter your commit message for ${chalk.blue(`#${branchNumber} ${issueType}:`)}`,
            validate: (input) => input.trim() !== '',
        },
    ]);

    return `#${branchNumber} Feat: ${commitMessage}`;
}

export { getCommitMessage }