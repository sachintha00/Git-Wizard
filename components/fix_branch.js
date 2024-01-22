import fixBranchMenu from '../styles/fix_branch_menu.js'
import { fixMenu } from '../constants/enums.js'
import getBranchIdFromBranchName from './get_branch_id.js'
import { getCommitMessage } from './git_commits.js'
import { commitAndPush } from './git_push.js'
import { releaseBetaTag, revertLatestBetaTag } from './beta_tag.js'
import { squashToFirstCommitMessage } from './git_squash.js'
import { exit } from 'process'


async function fixBranch() {
    const selectedOption = await fixBranchMenu()
    console.clear()
    switch (selectedOption.fix_branch_option) {
        case fixMenu.STASH:
            await stash()
            break;
        case fixMenu.ADD_CHANGES:
            await addChangesToRemote()
            break;
        case fixMenu.SQUASH:
            await squashCommitMessage()
            break;
        case fixMenu.TAG_RELEASE:
            await tagRelease()
            break;
        case fixMenu.REVERT_LATEST_BETA_TAG:
            await tagRevert()
            break;
        case fixMenu.EXIT:
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
    const commitMessage = await getCommitMessage({ branchNumber: branchId, issueType: "Fix", topic: "Add Changes" })
    await commitAndPush(commitMessage)
}

async function squashCommitMessage() {
    await squashToFirstCommitMessage("Fix")
}

async function tagRelease() {
    await releaseBetaTag()
}

async function tagRevert() {
    await revertLatestBetaTag()
}

export default fixBranch