# Verifying Cherry-Picks Against a Branch

For each repo (e.g., `polkadot-sdk`), find the moonbeam-only commits:

```bash
cd ../polkadot-sdk
git fetch upstream stable2512
MERGE_BASE=$(git merge-base origin/moonbeam-polkadot-stable2512 upstream/stable2512)
git log --format="%H %s" $MERGE_BASE..origin/moonbeam-polkadot-stable2512
```

Upstream remotes by repo:

| Repo         | Origin (fork)                        | Upstream                                             |
|--------------|--------------------------------------|------------------------------------------------------|
| polkadot-sdk | moonbeam-foundation/polkadot-sdk     | paritytech/polkadot-sdk (branch: `stable<YYMM>`)     |
| frontier     | moonbeam-foundation/frontier         | polkadot-evm/frontier (tag: `frontier-stable<YYMM>`) |
| evm          | moonbeam-foundation/evm              | rust-ethereum/evm (branch: `master`)                 |
| ethereum     | moonbeam-foundation/ethereum         | rust-ethereum/ethereum (branch: `master`)            |
| moonkit      | moonbeam-foundation/moonkit (origin) | Moonsong-Labs/moonkit (branch: `main`)               |

Then for each "Included" row, confirm the commit exists on the branch. For each "Dropped" row, confirm it does not.

## Verify the branch compiles

After confirming the cherry-picks are present, check that the fork branch still
builds — **including test code**:

```bash
cargo check --workspace --tests
```

Always pass `--tests`. Plain `cargo check --workspace` skips `#[cfg(test)]`
modules and integration tests, so a cherry-pick — or an upstream refactor the
cherry-pick lands on top of — can leave a test module that no longer compiles
while the check still reports success. This bit us in the stable2603 cycle:
evm's `evm-core` `delegation.rs` test module had been broken since an
`Option`→`Result` API refactor, and a `--tests`-less check let it ride along
undetected from one stable branch to the next.
