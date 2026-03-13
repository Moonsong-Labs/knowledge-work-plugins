<!-- markdownlint-disable MD001 -->
# Caching Layer Implementation Plan

> **For Claude:** REQUIRED: Use core-engineering:subagent-driven-development (if subagents available) or core-engineering:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an LRU cache with TTL support in Rust

**Architecture:** Generic cache struct using Arc<RwLock<_>> for thread safety, with tokio for async TTL eviction.

**Tech Stack:** Rust, tokio, Cargo

---

### Task 1: Implement the LRU cache

**Files:**
- Create: `src/cache/lru.rs`
- Modify: `Cargo.toml`

- [ ] **Step 1: Add tokio dependency to Cargo.toml**

- [ ] **Step 2: Create `src/cache/lru.rs` with `LruCache<K, V>` struct**

Implement a generic LRU cache with:
- Configurable capacity and TTL
- Thread-safe access using `Arc<RwLock<_>>`
- `get`, `put`, `remove` methods
- Eviction on capacity overflow and TTL expiry

- [ ] **Step 3: Write unit tests for concurrent access patterns**

- [ ] **Step 4: Run `cargo test` and verify all tests pass**

- [ ] **Step 5: Commit**
