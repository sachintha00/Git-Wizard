import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

import {fixMenu} from '../constants/enums.js'

async function fixBranchMenu(){
    const answer = await inquirer.prompt({
        name: "fix_branch_option",
        type: 'list',
        message: 'Choose one',
        choices: [
            { name: '[01] Stash the changes', value: fixMenu.STASH },
            { name: '[02] Add changes to remote', value: fixMenu.ADD_CHANGES },
            { name: '[03] Squash to first commit', value: fixMenu.SQUASH },
            { name: '[04] Release beta tag', value: fixMenu.TAG_RELEASE },
            { name: '[05] Revert latest beta tag', value: fixMenu.REVERT_LATEST_BETA_TAG },
            { name: '[00] Exit', value: fixMenu.EXIT }
        ]
    })

    return answer;
}

export default fixBranchMenu