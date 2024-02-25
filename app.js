#!/usr/bin/env node

import getCurrentGitBranch from "./helpers/current_git_branch.js";
import welcomeBanner from "./styles/banner.js";
import doBranch from './components/do_branch.js'
import devBranch from './components/dev_branch.js'
import masterBranch from './components/master_branch.js'
import fixBranch from './components/fix_branch.js'

welcomeBanner({ welcomeText: "~GIT  WIZARD~", description: "Code Dreams, Build Realities!", versionTag: "v1.8.1" })
const branch = await getCurrentGitBranch()
if (branch.startsWith("do")) {
    await doBranch()
} else if (branch.startsWith("fix")) {
    await fixBranch()
} else if (branch === "master") {
    await masterBranch()
} else if (branch === "dev") {
    await devBranch()
} else {
    console.log("didn't match");
}