import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

import {masterMenu} from '../constants/enums.js'

async function masterBranchMenu(){
    const answer = await inquirer.prompt({
        name: "master_branch_option",
        type: 'list',
        message: 'Choose one',
        choices: [
            { name: '[01] Merge', value: masterMenu.MERGE_BRANCH },
            { name: '[02] Release beta tag', value: masterMenu.TAG_RELEASE },
            { name: '[03] Revert latest beta tag', value: masterMenu.REVERT_LATEST_BETA_TAG },
            { name: '[00] Exit', value: masterMenu.EXIT }
        ]
    })

    return answer;
}

export default masterBranchMenu