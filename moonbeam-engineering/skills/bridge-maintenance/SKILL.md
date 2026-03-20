---
name: bridge-maintenance
description: Maintains bridge infrastructure for Moonbeam including substrate-relay updates, zombienet chain spec generation, and bridge integration testing. Use when upgrading polkadot-sdk stable versions, updating the substrate-relay binary, regenerating relay chain specs, or debugging bridge relayer issues.
license: MIT OR Apache-2.0
---

# Bridge Maintenance

## Contents
- [Overview](#overview)
- [Repository Layout](#repository-layout)
- [Regenerating Relay Chain Specs](#regenerating-relay-chain-specs)
- [Updating the Substrate Relay](#updating-the-substrate-relay)
- [Running Bridge Integration Tests](#running-bridge-integration-tests)
- [Debugging Bridge Issues](#debugging-bridge-issues)
- [CI Configuration](#ci-configuration)

## Overview

Moonbeam uses a GRANDPA-based bridge to connect Moonbeam (on Polkadot) with
Moonriver (on Kusama). The bridge infrastructure consists of:

| Component         | Repository                                  | Purpose                                                 |
|-------------------|---------------------------------------------|---------------------------------------------------------|
| Bridge pallets    | `moonbeam-foundation/polkadot-sdk`          | On-chain bridge logic (GRANDPA verifier, message lanes) |
| Substrate relay   | `moonbeam-foundation/parity-bridges-common` | Off-chain relayer that syncs headers and messages       |
| Zombienet configs | Moonbeam repo (`zombienet/`)                | Local test network definitions                          |
| Chain specs       | Moonbeam repo (`zombienet/specs/`)          | Relay chain genesis specs for local testing             |

When upgrading to a new `polkadot-sdk` stable version, **all components must be
updated together** to ensure bridge pallet version compatibility.

## Repository Layout

```
zombienet/
├── bin/                          # Binaries (downloaded by Makefile)
│   ├── polkadot                  # Relay chain node
│   ├── polkadot-execute-worker
│   ├── polkadot-prepare-worker
│   ├── substrate-relay           # Bridge relayer
│   ├── moonbeam -> ../../target/release/moonbeam  # Symlink
│   └── zombienet                 # Zombienet CLI wrapper
├── configs/
│   ├── moonbeam-polkadot.toml    # Moonbeam + Polkadot relay network
│   └── moonriver-kusama.toml     # Moonriver + Kusama relay network
├── specs/
│   ├── polkadot-local.json       # Polkadot relay chain spec
│   ├── kusama-local.json         # Kusama relay chain spec
│   └── README.md                 # Generation instructions
└── integration-tests/bridges/
    ├── run-test.sh               # Main test entry point
    ├── environments/moonbeam-moonriver/
    │   ├── spawn.sh              # Spawns both networks
    │   ├── start_relayer.sh      # Starts bridge relayers
    │   └── bridge.sh             # Bridge operations (init, relay, transfer)
    └── tests/0001-moonbeam-moonriver-asset-transfer/
        ├── run.sh
        ├── glmr-reaches-moonriver.zndsl
        └── movr-reaches-moonbeam.zndsl
```

Key version pins in the `Makefile`:

```makefile
POLKADOT_VERSION := stable2512-2
BRIDGE_RELAY_VERSION := v1.8.19-moonbeam-stable2512
```

## Regenerating Relay Chain Specs

Since polkadot-sdk stable2512, the `polkadot` binary no longer ships
`polkadot-local` or `kusama-local` as built-in chain specs. They must be
generated from the `polkadot-fellows/runtimes` repo using its
`chain-spec-generator` binary.

**Important:** The zombienet configs must use `chain_spec_path` pointing to
committed JSON specs. Do NOT use `chain = "rococo-local"` as a substitute —
using the wrong relay chain type is dangerous for bridge testing.

### Steps

1. Find the `polkadot-fellows/runtimes` commit that matches the SDK version.
   Look for commits like "Update crates to SDK 2512-2 via psvm":

   ```bash
   cd ../runtimes  # or clone polkadot-fellows/runtimes
   git log --oneline --grep="SDK 2512"
   ```

2. Build the chain-spec-generator (only relay runtimes needed):

   ```bash
   git checkout <matching-commit>
   cargo build --release -p chain-spec-generator \
     --features polkadot,kusama,fast-runtime --no-default-features
   ```

3. Generate the specs:

   ```bash
   ./target/release/chain-spec-generator polkadot-local > zombienet/specs/polkadot-local.json
   ./target/release/chain-spec-generator kusama-local > zombienet/specs/kusama-local.json
   ```

4. Verify the specs look correct:

   ```bash
   python3 -c "
   import json
   for f in ['polkadot-local', 'kusama-local']:
       d = json.load(open(f'zombienet/specs/{f}.json'))
       print(f'{f}: name={d[\"name\"]}, id={d[\"id\"]}, chainType={d[\"chainType\"]}')
   "
   ```

5. Ensure the zombienet configs reference them via `chain_spec_path`:

   ```toml
   # zombienet/configs/moonbeam-polkadot.toml
   [relaychain]
   chain_spec_path = "zombienet/specs/polkadot-local.json"

   # zombienet/configs/moonriver-kusama.toml
   [relaychain]
   chain_spec_path = "zombienet/specs/kusama-local.json"
   ```

## Updating the Substrate Relay

The substrate-relay binary lives in `moonbeam-foundation/parity-bridges-common`.
It must be built against the same polkadot-sdk version as the Moonbeam runtime
to ensure bridge pallet compatibility.

### Branch structure

| Branch                         | Purpose                                                   |
|--------------------------------|-----------------------------------------------------------|
| `master`                       | Tracks upstream `paritytech/parity-bridges-common` master |
| `master-with-moonbeam`         | master + moonbeam/moonriver relay client code (4 commits) |
| `moonbeam-polkadot-stable2503` | Pinned to polkadot-sdk stable2503                         |
| `moonbeam-polkadot-stable2512` | Pinned to polkadot-sdk stable2512                         |

### Creating a new stable branch

1. Start from the latest upstream master:

   ```bash
   cd ../parity-bridges-common
   git remote add upstream https://github.com/paritytech/parity-bridges-common.git
   git fetch upstream master
   git fetch origin master-with-moonbeam
   git checkout -b moonbeam-polkadot-stable<NNNN> upstream/master
   ```

2. Cherry-pick the moonbeam-specific commits from `master-with-moonbeam`:

   ```bash
   # List moonbeam commits (should be ~4 commits)
   git log --oneline --reverse origin/master..origin/master-with-moonbeam
   # Cherry-pick them all
   git cherry-pick <commit1> <commit2> <commit3> <commit4>
   ```

   These commits add:
   - `chains/chain-moonbeam/`, `chains/chain-moonriver/`, `chains/chain-moonbase/`
   - `relay-clients/client-moonbeam/`, `client-moonriver/`, `client-moonbase/`
   - Bridge definitions in `substrate-relay/src/bridges/kusama_polkadot/`
   - CLI commands: `polkadot-to-moonriver`, `kusama-to-moonbeam`, etc.
   - `.github/workflows/build-binaries.yml`

3. Pin polkadot-sdk to the stable branch:

   ```bash
   # On Linux / GNU sed:
   sed -i 's|git = "https://github.com/paritytech/polkadot-sdk", branch = "master"|git = "https://github.com/moonbeam-foundation/polkadot-sdk", branch = "moonbeam-polkadot-stable<NNNN>"|g' Cargo.toml
   # On macOS / BSD sed:
   sed -i '' 's|git = "https://github.com/paritytech/polkadot-sdk", branch = "master"|git = "https://github.com/moonbeam-foundation/polkadot-sdk", branch = "moonbeam-polkadot-stable<NNNN>"|g' Cargo.toml
   ```

4. Fix compilation issues. Common ones:
   - **`MultiSignature::Eth` variant**: Added in stable2512. Fix in
     `chains/chain-moonbeam/src/temporary.rs` and `chains/chain-moonbase/src/temporary.rs`:
     ```rust
     sp_runtime::MultiSignature::Eth(sig) => Self(ecdsa::Signature::from(sig.0)),
     ```

5. Resolve `Cargo.lock`. The `ark-vrf` crate is yanked from crates.io, so a
   fresh `cargo generate-lockfile` will fail. Workaround: seed from the moonbeam
   repo's lockfile:

   ```bash
   cp ../moonbeam-stable2512/Cargo.lock Cargo.lock
   cargo update --workspace
   ```

6. Build and verify:

   ```bash
   cargo build --release -p substrate-relay
   ./target/release/substrate-relay --version
   # Verify moonbeam bridges are registered:
   ./target/release/substrate-relay relay-headers --help 2>&1 | grep moon
   ```

7. Commit, push, and create a release:

   ```bash
   git add -A
   git commit -m "update pins to moonbeam-polkadot-stable<NNNN>"
   git push origin moonbeam-polkadot-stable<NNNN>

   # Trigger CI to build linux-x64 and macos-arm64 binaries
   gh workflow run build-binaries.yml \
     --ref moonbeam-polkadot-stable<NNNN> \
     -R moonbeam-foundation/parity-bridges-common

   # Wait for CI, download artifacts, create release
   gh run watch <RUN_ID> -R moonbeam-foundation/parity-bridges-common
   mkdir -p /tmp/relay-artifacts && cd /tmp/relay-artifacts
   gh run download <RUN_ID> -R moonbeam-foundation/parity-bridges-common
   mv substrate-relay-linux-x64/substrate-relay ./substrate-relay-linux-x64
   mv substrate-relay-macos-arm64/substrate-relay ./substrate-relay-macos-arm64

   gh release create v1.8.19-moonbeam-stable<NNNN> \
     --repo moonbeam-foundation/parity-bridges-common \
     --target moonbeam-polkadot-stable<NNNN> \
     --title "v1.8.19-moonbeam-stable<NNNN>" \
     --notes "substrate-relay for polkadot-sdk stable<NNNN>" \
     substrate-relay-linux-x64 \
     substrate-relay-macos-arm64
   ```

8. Update the moonbeam `Makefile`:

   ```makefile
   BRIDGE_RELAY_VERSION := v1.8.19-moonbeam-stable<NNNN>
   ```

## Running Bridge Integration Tests

### Prerequisites

- `polkadot`, `moonbeam`, `substrate-relay` binaries (run `make all` to download/build)
- `polkadot-js-api` CLI: `npm install -g @polkadot/api-cli@beta`
- Zombienet CLI (downloaded by Makefile)

### Quick run

```bash
# Ensure PATH includes zombienet/bin
export PATH="${PWD}/zombienet/bin:$PATH"

# Download/build all binaries + run the test
make run-bridge-integration-tests
```

### Manual run

```bash
export PATH="${PWD}/zombienet/bin:$PATH"
export FRAMEWORK_REPO_PATH="$HOME/local_bridge_testing/downloads/polkadot-sdk"
./zombienet/integration-tests/bridges/run-test.sh 0001-moonbeam-moonriver-asset-transfer
```

### What the test does

1. Spawns **Moonbeam + Polkadot** relay network (port 9900/8800)
2. Spawns **Moonriver + Kusama** relay network (port 9901/8801)
3. Initializes bridges (`init-bridge kusama-to-moonbeam`, `polkadot-to-moonriver`)
4. Starts GRANDPA finality relayer and headers-and-messages relayer
5. Submits a reserve transfer of 5 GLMR from Moonbeam → Moonriver
6. Verifies bridge events:
   - "Message has been accepted and is waiting to be delivered"
   - "Best finalized chain header has been updated"
   - "Messages in the inclusive range have been delivered"

## Debugging Bridge Issues

### "Transaction Already Imported" errors

The finality relayer and the headers-and-messages relayer both submit GRANDPA
header proofs and can conflict. Check `start_relayer.sh` — it runs both
`run-finality-relay` and `relay-headers-and-messages` concurrently. The
headers-and-messages relayer already includes finality sync, so the standalone
finality relayer may be redundant.

### Bridge pallet version mismatch

If the relayer gets stuck or transactions fail silently, verify the bridge pallet
versions match between the runtime and the relayer:

```bash
# Runtime versions (from Cargo.lock)
grep -A2 'name = "bp-header-chain"' Cargo.lock | head -3

# Relayer versions
grep -A2 'name = "bp-header-chain"' ../parity-bridges-common/Cargo.lock | head -3
```

They must use the same polkadot-sdk branch.

### Checking relayer logs

Logs are written to `/tmp/bridge-integration-tests/run-*/logs/`:

```bash
# Finality relayer
tail -f /tmp/bridge-integration-tests/run-*/logs/relayer_finality.log

# Parachains + messages relayer
tail -f /tmp/bridge-integration-tests/run-*/logs/relayer_parachains.log
```

### "polkadot-local is not supported" error

The polkadot binary no longer has `polkadot-local` built-in. Regenerate chain
specs as described in [Regenerating Relay Chain Specs](#regenerating-relay-chain-specs).

### Killing leftover zombie processes

```bash
pkill -9 -f 'bridge-integration-tests'
```

## CI Configuration

The bridge integration tests run in `.github/workflows/build.yml` under the
`bridge-integration-tests` job. It:

1. Downloads the built `moonbeam` binary from the `build` job
2. Installs `polkadot-js-api`
3. Runs `make run-bridge-integration-tests`

The `Makefile` handles downloading all required binaries (`polkadot`,
`substrate-relay`, `zombienet`) from their respective GitHub releases using the
version pins at the top of the file.

When updating versions, ensure:

- `POLKADOT_VERSION` matches the polkadot-sdk release tag
- `BRIDGE_RELAY_VERSION` points to a published release on
  `moonbeam-foundation/parity-bridges-common` with the correct binary assets
- Asset names match the pattern `substrate-relay-{linux-x64,macos-arm64}`
