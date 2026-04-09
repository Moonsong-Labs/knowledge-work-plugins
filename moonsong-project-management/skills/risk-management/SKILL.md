---
name: risk-management
description: "Use when identifying project risks, creating risk registers, building mitigation plans, or assessing impact and likelihood of threats to delivery"
---

# Risk Management

## Overview

Structured risk assessment that produces a risk register with dual scoring (inherent and residual) and actionable mitigation plans. Uses a 5x5 likelihood-impact matrix aligned with ISO 31000:2018 principles.

The [risk register template](risk-register-template.md) contains the full document structure with all scales, tables, diagrams, and guidance on what to adapt per project. This skill describes when and how to use it.

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

### 2. Discover Output Location

Use the [plan location discovery](../../shared/plan-location-discovery.md) process to find the right directory. Default filename: `risk-register-and-mitigation-plan.md`.

Announce the chosen path and wait for user confirmation before writing.

### 3. Copy and Adapt the Template

Start from the [risk register template](risk-register-template.md). Adapt it to the project:

- **Purpose and Scope** (section 1): Fill in the project boundary, audience, and phase context.
- **Impact scale** (section 3): Rewrite impact definitions for the project domain. The template defaults are for infrastructure/protocol projects.
- **Risk appetite** (section 4): Set maximum acceptable residual severity per category based on the project's risk tolerance.
- **Risk taxonomy** (section 5): Add, remove, or rename categories to match the domain. The defaults (SEC, OPS, PRO, GOV) work for most technical projects.
- **Roles** (section 8): Map roles to actual people or teams.
- **Review cadence** (section 9): Adjust frequencies for the project phase and team size.

### 4. Identify and Score Risks

For each risk:

1. Assign a category and sequential ID (e.g., `R-SEC-001`)
2. Describe what could go wrong, clearly and specifically
3. Score **inherent risk** (Likelihood x Impact, before controls)
4. Document existing controls and planned mitigation
5. Score **residual risk** (Likelihood x Impact, after planned controls)

The gap between inherent and residual makes mitigation effectiveness visible and auditable.

### 5. Write Detailed Mitigation Plans

For every risk with an inherent score of 12 or above (High/Critical), write a detailed mitigation plan using the template format in section 7. Organize controls by type:

- **Preventive**: stops the risk from materializing
- **Detective**: detects that a risk event has occurred
- **Corrective**: limits damage and restores operation

Medium and lower risks are tracked in the register with mitigation strategies noted inline.

### 6. Review with Stakeholders

Present the completed register for review. Check that:

- No High/Critical risk is missing a detailed mitigation plan
- Every mitigation has an owner assigned
- Risk appetite thresholds are not exceeded by residual scores
- Impact definitions match the project domain (not left as generic defaults)

## Common Mistakes

- Describing risks too vaguely ("something might go wrong with the API")
- Skipping residual scoring, making it impossible to measure mitigation effectiveness
- Not assigning owners, making mitigation nobody's responsibility
- Rating everything as High/Critical, which dilutes focus
- Writing mitigation plans for low-severity risks instead of accepting them with documented rationale
- Forgetting to adapt impact definitions to the project domain
