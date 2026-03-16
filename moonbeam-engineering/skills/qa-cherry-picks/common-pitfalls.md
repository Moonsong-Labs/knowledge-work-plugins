# Common Pitfalls

- **Commit hashes change between branches** — the same logical cherry-pick has different hashes on `stable2506` vs `stable2512`. Always look up the new hash by commit message or content.
- **Merge commits** — some cherry-picks land as merge PRs (e.g., `Merge pull request #8`). Check the diff, not just the subject line.
- **Cross-repo entries** — the original Notion export occasionally placed frontier cherry-picks in the polkadot-sdk table. Flag these.
- **"Applied" vs "Cherry pick"** — `Applied` refers to the *previous* branch; `Cherry pick` refers to the *current* branch. An item can be `Applied=Yes, Cherry pick=Dropped` (was on old branch, removed from new one because upstream merged it).
- **EVM fork divergence** — upstream `rust-ethereum/evm` did a v1.0 rewrite. Moonbeam is on the 0.43.x fork, so "PR Upstream Merged" doesn't mean the cherry-pick can be dropped.
