# Moonbeam Engineering

A collection of skills that enhance AI agents with specialized capabilities for developing on the Moonbeam parachain. Each skill provides actionable instructions that enable agents to perform specific development tasks effectively.

## Available Skills

| Skill | Capability |
| --- | --- |
| [Adding Pallets](./skills/adding-pallets/SKILL.md) | Create new FRAME pallets for the runtime |
| [Adding Precompiles](./skills/adding-precompiles/SKILL.md) | Build EVM precompiled contracts |
| [Analyzing Weights](./skills/analyzing-weights/SKILL.md) | Analyze weight file diffs and flag regressions |
| [Benchmarking Pallets](./skills/benchmarking-pallets/SKILL.md) | Benchmark performance and calculate weights |
| [Debugging Moonbeam](./skills/debugging-moonbeam/SKILL.md) | Debug runtime and EVM issues |
| [Developing RPCs](./skills/developing-rpcs/SKILL.md) | Develop and extend RPC endpoints |
| [Developing Runtime](./skills/developing-runtime/SKILL.md) | Configure and modify the runtime |
| [Developing XCM](./skills/developing-xcm/SKILL.md) | Implement cross-chain messaging |
| [Implementing EIPs](./skills/implementing-eips/SKILL.md) | Add Ethereum Improvement Proposals support |
| [Managing Staking](./skills/managing-staking/SKILL.md) | Work with the parachain staking system |
| [Patching Dependencies](./skills/patching-dependencies/SKILL.md) | Manage dependencies across repositories |
| [PR Description](./skills/pr-desc/SKILL.md) | Generate pull request descriptions from git changes |
| [Testing Moonbeam](./skills/testing-moonbeam/SKILL.md) | Write and run tests |
| [Writing Migrations](./skills/writing-migrations/SKILL.md) | Create runtime migrations |

## Technologies

- **Rust** — Core development using Substrate/FRAME
- **TypeScript** — Integration testing with Moonwall
- **Solidity** — EVM smart contracts
- **XCM** — Cross-consensus messaging

## Runtimes

Moonbeam maintains three runtime variants:

| Runtime | Network | Chain ID |
| --- | --- | --- |
| Moonbase | Testnet | 1287 |
| Moonriver | Kusama | 1285 |
| Moonbeam | Polkadot | 1284 |

## Installation

**Note:** Installation differs by platform. Claude Code and Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add Moonsong-Labs/knowledge-work-plugins
```

Then install the plugin:

```bash
/plugin install moonbeam-engineering@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/moonbeam-engineering/.codex/INSTALL.md
```

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/moonbeam-engineering/.opencode/INSTALL.md
```

## Maintainers

- [Moonbeam Devs](https://github.com/orgs/Moonsong-Labs/teams/moonbeam-devs)
