import { exec } from 'child_process';
import util from "util"

const execAsync = util.promisify(exec);

async function getCurrentGitBranch() {
  try {
    // Execute the 'git rev-parse --abbrev-ref HEAD' command to get the current branch
    const { stdout, stderr } = await execAsync('git rev-parse --abbrev-ref HEAD');

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return null;
    }

    const currentBranch = stdout.trim();
    // console.log(`Current Git branch: ${currentBranch}`);
    return currentBranch;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return null;
  }
}

export default getCurrentGitBranch