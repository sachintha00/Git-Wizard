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
            { name: '[01] stash the changes', value: doMenu.STASH },
            { name: '[02] add changes to remote', value: doMenu.ADD_CHANGES },
            { name: '[03] squash commit message', value: doMenu.SQUASH },
            { name: '[04] release tag', value: doMenu.TAG_RELEASE },
            { name: '[00] exit', value: doMenu.EXIT }
        ]
    })

    return answer;
}

export default doBranchMenu