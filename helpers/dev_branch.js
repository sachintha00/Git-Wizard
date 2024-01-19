import devBranchMenu from '../styles/dev_branch_menu.js'
import { devMenu } from '../constants/enums.js'
import { exit } from 'process'
import mergeBranchesToDev from './merge_to_dev.js'


async function devBranch() {
    const selectedOption = await devBranchMenu()
    console.clear()
    switch (selectedOption.dev_branch_option) {
        case devMenu.MERGE_BRANCH:
            await mergeBranch()
            break;
        case devMenu.TAG_RELEASE:
            await tagRelease()
            break;
        case devMenu.REVERT_LATEST_BETA_TAG:
            await tagRevert()
            break;
        case devMenu.EXIT:
            exit(0)
        default:
            break;
    }
}

async function mergeBranch() {
    await mergeBranchesToDev()
}

async function tagRelease() {
    console.log("Under the development1...")
}

async function tagRevert() {
    console.log("Under the development2...")
}

export default devBranch