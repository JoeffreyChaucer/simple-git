import simpleGit, { SimpleGit, Tag } from 'simple-git';


async function deleteOldTags(): Promise<void> {
  const git: SimpleGit = simpleGit();

  // Get the name of the current branch
  const currentBranch = await git.branch();

  // Get a list of all tags
  const tags: Tag = await git.tags();

  // Iterate through the tags and delete any that are older than 180 days
  for (const tag of tags.all) {
    const date = new Date(tag.date);
    const ageInDays = (Date.now() - date.getTime()) / (1000 * 3600 * 24);
    if (ageInDays > 180) {
      await git.raw(['tag', '-d', tag.name]);
      await git.push('origin', `:refs/tags/${tag.name}`, { '--delete': null });
    }
  }

  // Checkout the original branch
  await git.checkout(currentBranch.current);
}

export default deleteOldTags;
