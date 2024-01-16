import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

function welcomeBanner({welcomeText, description, versionTag, paddingDescription = 7, paddingVersionTag = 5}) {
    figlet(welcomeText, (error, data) => {
        console.clear()
        const paddingAuther = Math.floor((process.stdout.columns - description.length) / paddingDescription);
        const paddingVersion = Math.floor((process.stdout.columns - versionTag.length) / paddingVersionTag);

        console.log(gradient.pastel.multiline(data));

        console.log(" ".repeat(paddingAuther) + description);
        console.log(" ".repeat(paddingVersion) + versionTag);

        console.log("\n\n")
    })
}

export default welcomeBanner