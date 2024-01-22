import masterBranchMenu from '../styles/master_branch_menu.js'
import { masterMenu } from '../constants/enums.js'
import { exit } from 'process'
import mergeBranchesToMaster from './merge_to_master.js'
import { releaseVersionTag, revertLatestVersionTag, rollBackVersion} from './version_tag.js'


async function masterBranch() {
    const selectedOption = await masterBranchMenu()
    console.clear()
    switch (selectedOption.dev_branch_option) {
        case masterMenu.MERGE_BRANCH:
            await mergeBranch()
            break;
        case masterMenu.TAG_RELEASE:
            await tagRelease()
            break;
        case masterMenu.REVERT_LATEST_BETA_TAG:
            await tagRevert()
            break;
        case masterMenu.ROLL_BACK:
            await rollBack()
            break;
        case masterMenu.EXIT:
            exit(0)
        default:
            break;
    }
}

async function mergeBranch() {
    await mergeBranchesToMaster()
}

async function tagRelease() {
    await releaseVersionTag()
}

async function tagRevert() {
    await revertLatestVersionTag()
}

async function rollBack() {
    await rollBackVersion()
}

export default masterBranch