# OmniClaw

OmniClaw is a minimal MVP built with Solana Anchor: **Autonomous AI Hiring Protocol on Solana**

This project is designed for a hackathon demo. The goal is not to build a complex protocol, but to demonstrate the core on-chain hiring flow end-to-end:

1. Register an AI Agent  
2. Create a job with title and requirement description  
3. Lock SOL bounty inside a PDA vault  
4. Agent owner submits a delivery URI/hash  
5. Job creator approves the work and payment is automatically released  
6. Agent reputation increases  
7. Unsubmitted jobs can be cancelled and refunded; bad agents can be slashed and bounty returned to the creator  

This project intentionally excludes SPL Token support, staking, DAO governance, disputes, and complicated permission systems so the entire protocol can be demonstrated and explained within a few hours.

---

# Features Implemented

- Agent registration: one Agent PDA per wallet
- Job creation: creator assigns a job to an Agent and sets a SOL bounty
- Job metadata: title and requirement description stored on-chain
- PDA vault escrow: each Job has an independent vault PDA
- Work submission: only the Agent owner can submit a `result_uri`
- Job completion: only the original creator can approve submitted work
- Automatic payment: SOL inside the vault is transferred to the Agent owner
- Reputation rewards: `reputation += 10` after successful completion
- Job cancellation: creators can cancel unsubmitted jobs and receive refunds without affecting reputation
- Agent slashing: only the original creator can slash jobs in `Open` or `Submitted` state
- Refund system: after slashing, SOL is returned to the creator
- Reputation penalty: `reputation -= 20` after slashing, minimum value is 0
- TypeScript tests with full demo state logs
- Frontend helper located at `app/omniclawClient.ts`

---

# Account Model

## AgentAccount

PDA seed:

```text
["agent", owner]
```

Fields:

| Field | Type | Description |
| --- | --- | --- |
| `owner` | `Pubkey` | Wallet that owns the Agent and receives payments |
| `name` | `String` | Agent name, max 32 bytes |
| `skill` | `String` | Agent skill description, max 64 bytes |
| `reputation` | `u64` | Reputation score, starts at 100, +10 on completion, -20 on slash, minimum 0 |
| `completed_jobs` | `u64` | Number of completed and approved jobs |

---

## JobAccount

`JobAccount` is created using a normal keypair. Its public key is used to derive the vault PDA.

Fields:

| Field | Type | Description |
| --- | --- | --- |
| `creator` | `Pubkey` | Wallet that created the job and funded the bounty |
| `agent` | `Pubkey` | Assigned `AgentAccount` PDA |
| `bounty` | `u64` | Locked bounty amount in lamports |
| `status` | `u8` | `0 = Open`, `1 = Submitted`, `2 = Completed`, `3 = Cancelled`, `4 = Slashed` |
| `title` | `String` | Job title, max 64 bytes |
| `description` | `String` | Job requirement description, max 256 bytes |
| `result_uri` | `String` | Submitted delivery URI/hash, max 128 bytes |
| `created_at` | `i64` | Unix timestamp when job was created |
| `submitted_at` | `i64` | Submission timestamp, 0 if not submitted |
| `closed_at` | `i64` | Completion/cancellation/slash timestamp, 0 if still active |

---

## Vault PDA

PDA seed:

```text
["vault", job_account]
```

The vault is a system account PDA:

- During `create_job`, the creator transfers SOL into the vault
- During `complete_job`, the program signs with PDA seeds and transfers SOL to the Agent owner
- During `cancel_job`, the program signs with PDA seeds and refunds SOL to the creator
- During `slash_agent`, the program signs with PDA seeds and refunds SOL to the creator

---

# Instruction Reference

## `register_agent(name, skill)`

Creates an `AgentAccount` PDA for the signer wallet.

Validation:

- `name` cannot be empty
- `skill` cannot be empty
- `name` max length: 32 bytes
- `skill` max length: 64 bytes

Default values:

- `reputation = 100`
- `completed_jobs = 0`

---

## `create_job(agent, bounty, title, description)`

Creates a `JobAccount` and locks SOL bounty inside the job vault PDA.

Rules:

- `bounty` must be greater than 0
- `title` cannot be empty and max 64 bytes
- `description` cannot be empty and max 256 bytes
- `agent` parameter must equal the provided `AgentAccount`
- Initial job status is `Open`

Effects:

- Creates `JobAccount`
- Stores title, description, and creation timestamp
- Transfers `bounty` lamports from creator into the vault PDA

---

## `submit_work(result_uri)`

Agent owner submits a delivery URI/hash and moves the job into review state.

Rules:

- Only `agent.owner` can call
- Job must be in `Open` state
- `result_uri` cannot be empty and max 128 bytes
- Provided `AgentAccount` must equal `job.agent`

Effects:

- Stores `result_uri` and `submitted_at`
- Job status becomes `Submitted`

---

## `complete_job()`

Job creator approves the work and releases the bounty.

Rules:

- Only the original creator can call
- Job must be in `Submitted` state
- Provided `AgentAccount` must equal `job.agent`
- Provided `agent_owner` must equal `agent.owner`
- Vault balance must be sufficient to pay `job.bounty`

Effects:

- Vault transfers bounty to `agent_owner`
- `reputation += 10`
- `completed_jobs += 1`
- Job status becomes `Completed`
- Writes `closed_at`

---

## `cancel_job()`

Job creator cancels an unsubmitted job and receives a refund without penalizing the Agent.

Rules:

- Only the original creator can call
- Job must be in `Open` state
- Vault balance must be sufficient to refund `job.bounty`

Effects:

- Vault refunds SOL to creator
- Agent reputation remains unchanged
- Job status becomes `Cancelled`
- Writes `closed_at`

---

## `slash_agent()`

Job creator rejects the work, slashes the Agent, and refunds the bounty.

Rules:

- Only the original creator can call
- Job must be in `Open` or `Submitted` state
- Provided `AgentAccount` must equal `job.agent`
- Vault balance must be sufficient to refund `job.bounty`

Effects:

- Vault refunds SOL to creator
- `reputation -= 20` using saturating math (minimum 0)
- Job status becomes `Slashed`
- Writes `closed_at`

---

# Events

The program emits the following events for frontend logs, indexers, and demo visualization:

- `AgentRegistered`
- `JobCreated`
- `JobWorkSubmitted`
- `JobCompleted`
- `JobCancelled`
- `AgentSlashed`

---

# Running the Demo

Install dependencies:

```bash
npm install
```

Build the program and generate IDL/types:

```bash
anchor build
```

Run the full local test suite:

```bash
anchor test
```

If you already have a healthy local validator running on `8899`:

```bash
npm run test:reuse-validator
```

The tests print important demo states:

```text
1. Agent registered
2. Job created and SOL locked
3. Agent submitted work and awaits approval
4. Job completed and bounty automatically paid
5. Bad Agent job submitted and bounty still locked
6. Bad Agent slashed and bounty refunded
7. Unsubmitted job cancelled without reputation penalty
8. Reputation minimum bound check completed
```

---

# Common Commands

```bash
npm run lint
npm run typecheck
cargo fmt --all -- --check
```

---

# Important Files

- `programs/omniclaw/src/lib.rs` — Anchor smart contract
- `tests/omniclaw.ts` — End-to-end demo tests
- `app/omniclawClient.ts` — Frontend helper
- `docs/frontend-integration.md` — Frontend integration guide

---

# Current MVP Scope

To keep the hackathon demo focused and easy to understand, this version intentionally excludes:

- SPL Tokens
- Staking
- Dispute resolution systems
- DAO governance
- Account closing and rent reclaiming

The core focus of this MVP is to clearly demonstrate:

**job creation, delivery submission, SOL escrow, automatic payment, reputation growth, cancellation, slashing, and refunds.**
