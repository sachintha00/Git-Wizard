#!/usr/bin/env node

import getCurrentGitBranch from "./helpers/current_git_branch.js";
import welcomeBanner from "./styles/banner.js";
import doBranch from './helpers/do_branch.js'

welcomeBanner({ welcomeText: "~GIT  WIZARD~", description: "Code Dreams, Build Realities!", versionTag: "v1.0.0" })
const test = await getCurrentGitBranch()
if (test.startsWith("do")) {
    await doBranch()
} else if (test.startsWith("fix")) {
    console.log("this is fix branch");
} else if (test === "master") {
    console.log("this is master branch");
} else if (test === "dev") {
    console.log("this is dev branch");
} else {
    console.log("didn't match");
}