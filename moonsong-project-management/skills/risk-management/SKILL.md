---
name: risk-management
description: "Use when identifying project risks, creating risk registers, building mitigation plans, or assessing impact and likelihood of threats to delivery"
---

# Risk Management

## Overview

Structured risk assessment that produces a risk register with dual scoring (inherent and residual) and actionable mitigation plans. Aligned with ISO 31000:2018 principles using a 5x5 likelihood-impact matrix.

**Announce at start:** "I'm using the risk-management skill to create a risk register and mitigation plan."

## When Not to Use

- Incident postmortems (use a postmortem template instead)
- Security-only threat modeling that doesn't need a project-level register
- Informal risk brainstorming without intent to track and mitigate

## Workflow

### 1. Define Scope and Audience

Before identifying risks, establish:

- What system or project boundary are we assessing?
- What are the key deliverables, dependencies, and deadlines?
- Who is the audience? (engineering team, leadership, auditors, external stakeholders)
- Is this a discovery-phase assessment or an update to an existing register?

### 2. Establish Risk Taxonomy

Define risk categories tailored to the project. Start with these defaults and adapt:

| Category | Code | Covers |
|----------|------|--------|
| Security | SEC | Key material, access control, cryptographic soundness, contract vulnerabilities |
| Operational | OPS | Infrastructure failures, procedural errors, monitoring gaps, incident readiness |
| Protocol / Technical | PRO | Design-level vulnerabilities, integration assumptions, performance, compatibility |
| Governance | GOV | Decision authority, collusion, compliance, decentralization |

Add or remove categories based on the project domain. Every risk gets a category code prefix in its ID.

### 3. Define Likelihood and Impact Scales

Use these scales. Adapt the impact definitions to the project domain (the examples below are for infrastructure/protocol projects).

**Likelihood:**

| Score | Label | Definition |
|-------|-------|------------|
| 1 | Rare | < 5% probability |
| 2 | Unlikely | 5-20%; has occurred in similar systems but conditions differ |
| 3 | Possible | 20-50%; plausible given current architecture |
| 4 | Likely | 50-80%; expected without additional controls |
| 5 | Almost Certain | > 80%; has occurred in comparable systems |

**Impact:**

| Score | Label | Definition |
|-------|-------|------------|
| 1 | Insignificant | No financial loss; minor delay; self-correcting |
| 2 | Minor | Limited financial impact; recoverable within hours; no user impact |
| 3 | Moderate | Significant operational disruption; partial service degradation; reputation damage |
| 4 | Major | Material financial loss; extended downtime; potential data or fund exposure |
| 5 | Catastrophic | Total loss of critical assets; unrecoverable compromise; project-ending event |

### 4. Set Severity Bands

Risk score = Likelihood x Impact. Map scores to severity bands:

| Score Range | Severity | Required Action |
|-------------|----------|-----------------|
| 1-3 | Low | Accept; monitor with documented rationale |
| 4-6 | Low-Medium | Monitor; review periodically |
| 8-10 | Medium | Active mitigation required; assign owner and timeline |
| 12-16 | High | Immediate mitigation plan; escalate to project leadership |
| 20-25 | Critical | Must resolve before launch; potential blocker |

### 5. Define Risk Appetite

For each category, set the maximum acceptable residual severity. Example:

| Category | Max Acceptable Residual Severity | Notes |
|----------|----------------------------------|-------|
| Security (SEC) | Medium (10 or below) | No unmitigated High or Critical security risks at launch |
| Operational (OPS) | Medium (10 or below) | Disruptions must be recoverable within defined SLAs |
| Protocol (PRO) | Medium (10 or below) | Risks above Medium require design changes before launch |
| Governance (GOV) | Medium (10 or below) | Governance gaps must be resolved before production |

Adapt thresholds to the project's risk tolerance.

### 6. Build the Risk Register

Score each risk twice:

- **Inherent risk** = Likelihood x Impact (before any controls)
- **Residual risk** = Likelihood x Impact (after planned controls are applied)

The gap between inherent and residual makes the effectiveness of mitigations visible and auditable.

**Risk register table format (one table per category):**

| ID | Risk | Description | Inherent Likelihood | Inherent Impact | Inherent Score | Existing Controls | Mitigation Strategy | Control Type | Residual Likelihood | Residual Impact | Residual Score | Owner | Status | Related Docs |
|----|------|-------------|---------------------|-----------------|----------------|-------------------|---------------------|--------------|---------------------|-----------------|----------------|-------|--------|--------------|

- **ID format:** `R-{CATEGORY}-{NNN}` (e.g., `R-SEC-001`, `R-OPS-003`)
- **Control Type:** Preventive, Detective, or Corrective (see below)
- **Status:** Open, In Progress, Closed

### 7. Build Detailed Mitigation Plans

For every risk with an inherent score of 12 or above (High/Critical), write a detailed mitigation plan. Medium and lower risks are tracked in the register with mitigation strategies noted inline.

**Control types:**

| Type | When It Acts | Purpose | Example |
|------|-------------|---------|---------|
| Preventive | Before the event | Stop the risk from materializing | Access controls, audits, input validation |
| Detective | During / immediately after | Detect that a risk event has occurred | Monitoring, alerting, anomaly detection |
| Corrective | After the event | Limit damage and restore operation | Incident response, rollback, emergency pause |

**Response strategies:**

| Strategy | When to Use |
|----------|-------------|
| Avoid | Eliminate the risk by changing the design |
| Reduce | Lower likelihood or impact through controls |
| Transfer | Shift the risk to a third party (audits, insurance, bug bounties) |
| Accept | Acknowledge and monitor; appropriate for low-severity risks |

**Mitigation plan format for each High/Critical risk:**

```markdown
---

| R-XXX-NNN: Risk title |
|:--|
| **Risk:** Description of what could go wrong. |
| **Inherent Score:** L x I = Score (Severity) |
| **Target Residual Score:** L x I = Score (Severity) |

**Preventive Controls:**

- [ ] Control description (owner: TBD)

**Detective Controls:**

- [ ] Control description (owner: TBD)

**Corrective Controls:**

- [ ] Control description (owner: TBD)

**Acceptance Criteria:** What must be true for this risk to be considered mitigated.

---
```

### 8. Define Roles and Review Cadence

**Roles:**

| Role | Responsibility |
|------|---------------|
| Risk Owner | Keeps the risk entry current; implements or oversees mitigation; reports status; escalates if residual risk exceeds appetite |
| Project Team | Assigns risk owners; ensures mitigations are resourced; reviews register regularly |
| Leadership | Sets risk appetite; approves acceptance of high/critical residual risks |

**Review cadence (adapt to project phase):**

| Activity | Frequency |
|----------|-----------|
| Full register review | Quarterly |
| High/Critical risk check | Monthly |
| Event-triggered update | As needed (incidents, architecture changes, new threats) |
| Risk owner status update | Monthly |
| Risk appetite review | Quarterly |

## Output Location

Use the [plan location discovery](../../shared/plan-location-discovery.md) process to find the right directory. Default filename: `risk-register-and-mitigation-plan.md`.

Announce the chosen path and wait for user confirmation before writing.

## Example

A single worked example showing a risk register entry and its mitigation plan.

**Register entry:**

| ID | Risk | Description | Inherent L | Inherent I | Inherent Score | Existing Controls | Mitigation Strategy | Control Type | Residual L | Residual I | Residual Score | Owner | Status | Related Docs |
|----|------|-------------|-----------|-----------|----------------|-------------------|---------------------|--------------|-----------|-----------|----------------|-------|--------|--------------|
| `R-SEC-003` | Smart contract vulnerability | Logic bug or upgrade proxy exploit in the EVM verifier contract | 3 | 4 | 12 | None yet | Reduce | Preventive, Corrective | 2 | 4 | 8 | TBD | Open | ADR-002 |

**Detailed mitigation plan (required because inherent score is 12, High):**

---

| R-SEC-003: Smart contract vulnerability |
|:--|
| **Risk:** Logic bug or upgrade proxy exploit in the EVM verifier contract. |
| **Inherent Score:** 3 x 4 = 12 (High) |
| **Target Residual Score:** 2 x 4 = 8 (Medium) |

**Preventive Controls:**

- [ ] Commission independent security audit of EVM verifier contract (owner: TBD)
- [ ] Establish bug bounty program covering EVM contracts (owner: TBD)

**Corrective Controls:**

- [ ] Emergency pause capability via multisig (owner: TBD)
- [ ] Documented contract incident response procedure (owner: TBD)

**Acceptance Criteria:** At least one independent audit with no critical/high findings unresolved.

---

## Common Mistakes

- Describing risks too vaguely ("something might go wrong with the API")
- Skipping residual scoring, making it impossible to measure mitigation effectiveness
- Not assigning owners, making mitigation nobody's responsibility
- Rating everything as High/Critical, which dilutes focus
- Writing mitigation plans for low-severity risks instead of accepting them with documented rationale
- Forgetting to adapt impact definitions to the project domain
