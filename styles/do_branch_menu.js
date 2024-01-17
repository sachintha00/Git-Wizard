import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'

import {doMenu} from '../constants/enums.js'

async function doBranchMenu(){
    const answer = await inquirer.prompt({
        name: "do_branch_option",
        type: 'list',
        message: 'Choose one',
        choices: [
            { name: '[01] Stash the changes', value: doMenu.STASH },
            { name: '[02] Add changes to remote', value: doMenu.ADD_CHANGES },
            { name: '[03] Squash to first commit', value: doMenu.SQUASH },
            { name: '[04] Release beta tag', value: doMenu.TAG_RELEASE },
            { name: '[05] Revert latest beta tag', value: doMenu.REVERT_LATEST_BETA_TAG },
            { name: '[00] Exit', value: doMenu.EXIT }
        ]
    })

    return answer;
}

export default doBranchMenu