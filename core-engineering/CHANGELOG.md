# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-05-21

- feat(core-engineering)!: rewrite worktrees, consolidate code-reviewer (#56)

## [1.7.1] - 2026-05-21

- fix(core-engineering): quote SessionStart hook path with double quotes (#54)

## [1.7.0] - 2026-04-13

- Port upstream improvements from superpowers (#42)

## [1.6.0] - 2026-04-04

- feat(session-start): integrate MSL engineering values into session context (#38)

## [1.5.0] - 2026-03-16

- fix(core-engineering): Add notion of phased work and improve the naming for plan files (#31)

## [1.4.0] - 2026-03-13

- feat(core-engineering): proactive specialist agent dispatch (#26)

## [1.3.0] - 2026-03-13

- feat(core-engineering): add plan location discovery to brainstorming and writing-plans (#27)

## [1.2.0] - 2026-03-12

- feat(core-engineering): enhance brainstorming, writing-plans and executing-plans skills (#22)

## [1.1.0] - 2026-03-10

- feat(core-engineering): add improvements to the core-engineering plugin (#12)
  - Add instruction priority hierarchy to using-skills
  - Add scope assessment and spec review loop to brainstorming
  - Add user review gate between spec and writing-plans
  - Add spec/plan document reviewer prompt templates
  - Add scope check, file structure section, and plan review loop to
  writing-plans
  - Add model selection and implementer status protocol to
  subagent-driven-development
  - Add code organization and escalation guidance to implementer prompt
  - Add architecture checks to code quality reviewer
  - Default to subagent-driven execution on capable harnesses

## [1.0.0] - 2026-03-09

- Initial release with base skills and agents
