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
            { name: '[02] Release version tag', value: masterMenu.TAG_RELEASE },
            { name: '[03] Revert latest version tag', value: masterMenu.REVERT_LATEST_VERSION_TAG },
            { name: '[04] Version rollback', value: masterMenu.ROLL_BACK },
            { name: '[00] Exit', value: masterMenu.EXIT }
        ]
    })

    return answer;
}

export default masterBranchMenu