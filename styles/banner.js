import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

function welcomeBanner({welcomeText, description, versionTag}) {
    figlet(welcomeText, (error, data) => {
        console.clear()
        console.log(gradient.pastel.multiline(data));

        console.log(`\t\t ${description}`);
        console.log(`\t\t\t    ${versionTag}`);

        console.log("\n\n")
    })
}

export default welcomeBanner