# Creating a New Cherry-Pick Document

When upgrading to a new stable branch (e.g., `stable2603`):

1. **Copy the previous doc** as a starting point.
2. **For each "Included" item**, check if it's still needed:
   - Search for the upstream PR — if merged into the new stable, mark as `Dropped`.
   - Otherwise, find the new commit hash on the new branch and update the Commit column.
3. **For each "Dropped" item from the previous doc**, keep it for historical reference.
4. **Check for gaps** — diff the previous doc's "Included" items against the new doc to catch anything forgotten:
   - Items absorbed into upstream need no action.
   - Items with `Temporary` or `Needs PR upstream` status need careful review.
5. **Verify every row** by running the merge-base method from `./verify-cherry-picks.md` on each repo.
