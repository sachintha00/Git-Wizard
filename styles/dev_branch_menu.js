import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

import {devMenu} from '../constants/enums.js'

async function devBranchMenu(){
    const answer = await inquirer.prompt({
        name: "dev_branch_option",
        type: 'list',
        message: 'Choose one',
        choices: [
            { name: '[01] Merge', value: devMenu.MERGE_BRANCH },
            { name: '[02] Release beta tag', value: devMenu.TAG_RELEASE },
            { name: '[03] Revert latest beta tag', value: devMenu.REVERT_LATEST_BETA_TAG },
            { name: '[00] Exit', value: devMenu.EXIT }
        ]
    })

    return answer;
}

export default devBranchMenu