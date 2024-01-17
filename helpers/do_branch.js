import doBranchMenu from '../styles/do_branch_menu.js'
import { doMenu } from '../constants/enums.js'
import getBranchIdFromBranchName from './get_branch_id.js'
import { getCommitMessage } from './git_commits.js'
import { commitAndPush } from './git_push.js'
import { squashToFirstCommitMessage } from './git_squash.js'
import { exit } from 'process'


async function doBranch() {
    const selectedOption = await doBranchMenu()
    console.clear()
    switch (selectedOption.do_branch_option) {
        case doMenu.STASH:
            await stash()
            break;
        case doMenu.ADD_CHANGES:
            await addChangesToRemote()
            break;
        case doMenu.SQUASH:
            await squashCommitMessage()
            break;
        case doMenu.EXIT:
            exit(0)
        default:
            break;
    }
}

async function stash() {
    console.log("Under the development...")
}

async function addChangesToRemote() {
    const branchId = await getBranchIdFromBranchName()
    const commitMessage = await getCommitMessage({ branchNumber: branchId, issueType: "Feat", topic: "Add Changes" })
    await commitAndPush(commitMessage)
}

async function squashCommitMessage() {
    await squashToFirstCommitMessage("Feat")
}

async function tagRelease() {
    console.log("Under the development...")
}

export default doBranch