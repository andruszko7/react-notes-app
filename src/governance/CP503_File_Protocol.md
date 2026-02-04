# CP‑503 File Handling Protocol
Author: Bobby  
System: CP‑503 AI Routing Architecture  
Purpose: Enforce deterministic, reproducible, zero‑ambiguity file operations.

---

## 1. Full‑File Replacement Rule
Every file delivered by the AI is a **complete, ready‑to‑paste file**.

**You MUST:**
- **Create the file** if it does not exist.
- **Overwrite the file completely** if it already exists.

**You MUST NOT:**
- Merge code manually
- Append code
- Edit partial sections
- Apply diffs or patches
- Attempt to “blend” old and new content

All updates are **atomic**.

---

## 2. Directory Structure Enforcement
Files must be placed exactly in the directory path specified by the AI.

If the folder does not exist:
- You MUST create it.

If the folder exists:
- You MUST NOT rename or restructure it.

---

## 3. Deterministic Build Guarantee
This protocol ensures:
- Zero ambiguity  
- Zero stale code  
- Zero merge conflicts  
- Perfect reproducibility  
- Deterministic behavior across all CP‑503 modules  

This is essential for:
- D30–D40 optimizer logic  
- D41–D45 governance and persistence  
- D50+ productization  
- Sales, architecture, and pitch‑ready documentation  

---

## 4. AI Responsibilities
The AI MUST:
- Deliver full files only  
- Never deliver partials  
- Always include the CP‑503 File Handling Protocol block  
- Never assume the user will merge code  
- Never provide diffs or patch instructions  

---

## 5. Contributor Responsibilities
Contributors MUST:
- Follow this protocol exactly  
- Never modify files outside the AI’s instructions  
- Never restructure directories without explicit instruction  
- Treat all AI‑delivered files as authoritative  

---

## 6. Versioning
This protocol governs:
- All CP‑503 modules  
- All D‑series development phases (D1–D100)  
- All future architectural expansions  

This file itself is governed by the same rules:
- **Create if missing**  
- **Overwrite if present**  
- **Never merge**  

---

End of CP‑503 File Handling Protocol