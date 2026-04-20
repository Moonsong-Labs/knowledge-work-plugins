# ADR Worked Examples

Use these examples when a user asks what a good ADR looks like or when converting notes into MADR.

## Contents

* [Minimal Example](#minimal-example)
* [Full Example With All Optional Sections](#full-example-with-all-optional-sections)
* [Bad-To-Good Rewrite](#bad-to-good-rewrite)
* [Superseding Example](#superseding-example)

## Minimal Example

```markdown
# Use Database Row Locks for Job Claiming

## Context and Problem Statement

Workers in the billing service must claim scheduled invoice jobs without processing the same job twice. The current in-memory lock only works inside one process, but production runs multiple worker replicas. Which coordination mechanism should the billing service use for job claiming?

## Considered Options

* Database row locks with `FOR UPDATE SKIP LOCKED`
* Redis distributed locks
* Single worker replica

## Decision Outcome

Chosen option: "Database row locks with `FOR UPDATE SKIP LOCKED`", because the billing jobs already live in Postgres, this avoids adding a new operational dependency, and the expected job volume is well within the database capacity envelope.

### Consequences

* Good, because job claiming is durable and uses the same transaction as job state updates.
* Good, because the team does not need to operate Redis for this workflow.
* Bad, because the billing database now carries worker coordination load and needs query-level monitoring.
```

## Full Example With All Optional Sections

This example intentionally includes every optional MADR section. In real ADRs, remove sections that do not add value.

```markdown
---
status: accepted
date: "2026-04-20"
decision-makers:
  - Platform tech lead
  - Billing tech lead
consulted:
  - SRE lead
  - Security reviewer
  - Data engineering lead
informed:
  - Product manager for billing
  - Customer support lead
---

# Use Managed Postgres for Audit Event Storage

## Context and Problem Statement

The billing platform must retain customer-visible audit events for seven years. Today, audit events are mixed into application logs, which are difficult for support to query and are not covered by the same retention guarantees as billing data. Which storage approach should we use for billing audit events?

## Decision Drivers

* Seven-year retention must be enforceable without relying on application log retention.
* Support needs to query events by customer, invoice, actor, and time range.
* The team has two engineers on the billing rotation, so operational burden must stay low.
* Security needs clear access control and deletion behavior for non-audit metadata.
* The first production version must ship before the next invoicing milestone.
* The design should not block a later analytics pipeline.

## Considered Options

* Managed Postgres audit table in the billing database
* Append-only object storage files
* Dedicated event store service
* Continue using application logs

## Decision Outcome

Chosen option: "Managed Postgres audit table in the billing database", because it satisfies the retention and query requirements with the least new operational burden, reuses existing access controls and backup procedures, and can ship within the milestone. We accept that high-volume analytics will need a later export path rather than direct analytical queries against the billing database.

### Consequences

* Good, because support can query audit events using existing internal tooling and customer identifiers.
* Good, because retention, backups, and access control reuse the managed Postgres controls already reviewed for billing data.
* Good, because implementation can be delivered without introducing a new service dependency.
* Neutral, because analytics remains possible through later CDC or scheduled export, but is not solved by this ADR.
* Bad, because the billing database stores more rows and needs table partitioning plus query monitoring.
* Bad, because audit write latency is now on the billing request path unless the implementation batches non-critical events.

### Confirmation

* Before acceptance: security review confirms event fields do not store unrestricted personal data.
* Before release: migration creates monthly partitions and an index on `(customer_id, occurred_at)`.
* Before release: integration tests verify audit writes happen in the same transaction as invoice state changes.
* After two billing cycles: SRE reviews table growth, slow query logs, and backup duration.
* Kill criteria: if audit writes add more than 50 ms p95 to invoice finalization for two consecutive releases, revisit with an asynchronous write path or event store ADR.

## Pros and Cons of the Options

### Managed Postgres audit table in the billing database

Stores audit events in an append-only table beside billing records.

* Good, because existing retention, backup, monitoring, and access control procedures apply.
* Good, because support queries can join to billing entities without a second system.
* Good, because the team already has Postgres migration and performance experience.
* Neutral, because it supports moderate reporting but not high-volume analytics.
* Bad, because the billing database takes on additional write and storage load.
* Bad, because schema mistakes are harder to change after events become compliance records.

### Append-only object storage files

Writes audit events as immutable JSONL objects partitioned by date.

* Good, because storage is cheap and retention controls are strong.
* Good, because it decouples audit retention from the billing database.
* Neutral, because analytics tools can process the files later.
* Bad, because support queries by customer or invoice require additional indexing.
* Bad, because implementation needs a new read path and operational runbook.

### Dedicated event store service

Introduces a separate event storage system for audit and future event workflows.

* Good, because it separates audit writes from billing data storage.
* Good, because it could support future event-driven workflows.
* Neutral, because it may become useful for other teams, but no committed user exists yet.
* Bad, because it adds service selection, provisioning, access control, backup, and on-call burden.
* Bad, because it risks missing the invoicing milestone.

### Continue using application logs

Keep emitting audit-like records into structured application logs.

* Good, because no new implementation work is needed.
* Good, because developers already know how to emit and inspect logs.
* Bad, because log retention does not satisfy the seven-year requirement.
* Bad, because support cannot reliably query by customer, invoice, actor, and time range.
* Bad, because access control is tied to log tooling rather than billing audit needs.

## More Information

* Evidence: billing support request `BILL-1842` shows current audit lookup takes more than one hour.
* Evidence: load test `2026-04-billing-audit-postgres.md` estimates 1.8 million audit rows per month.
* Assumption: audit event volume grows linearly with invoice volume for the next twelve months.
* Confidence: medium-high for the first production version; revisit after two billing cycles.
* Related: this decision may require a later ADR for analytics export if product asks for aggregate audit reporting.
```

## Bad-To-Good Rewrite

Weak note:

```markdown
We chose Kafka because it is scalable and everyone uses it.
```

Problems:

* No problem statement.
* No real options.
* Promotional and subjective language.
* No consequences.
* No confirmation or evidence.

Better ADR fragment:

```markdown
## Context and Problem Statement

Order updates must be delivered to inventory and notification services without coupling those services to the checkout database. The current synchronous callback path causes checkout latency spikes when downstream services are slow. Which integration style should checkout use for order update publication?

## Considered Options

* Kafka topic for order updates
* Postgres outbox table polled by downstream workers
* Keep synchronous callbacks

## Decision Outcome

Chosen option: "Postgres outbox table polled by downstream workers", because it removes downstream services from the checkout request path without introducing a new streaming platform before the team has operational ownership for it.

### Consequences

* Good, because checkout can commit order state and publication intent in one transaction.
* Bad, because downstream delivery is eventually consistent and workers need lag monitoring.
```

## Superseding Example

Old ADR metadata update:

```yaml
---
status: superseded by ADR-0018
date: "2026-04-20"
---
```

Old ADR `More Information` addition:

```markdown
## More Information

Superseded by [ADR-0018](0018-use-managed-postgres-for-audit-event-storage.md) because audit retention requirements changed from 90 days to seven years.
```

New ADR `More Information` addition:

```markdown
## More Information

This supersedes [ADR-0007](0007-keep-audit-events-in-application-logs.md). The old decision was valid for 90-day operational debugging, but it no longer satisfies the seven-year billing audit retention requirement.
```
