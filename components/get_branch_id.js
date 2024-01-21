import getCurrentGitBranch from '../helpers/current_git_branch.js'

async function getBranchIdFromBranchName() {
    const branchName = await getCurrentGitBranch()
    const match = branchName.match(/\d+/);

    if (match) {
        return parseInt(match[0], 10);
    }

    return null;
}

export default getBranchIdFromBranchName