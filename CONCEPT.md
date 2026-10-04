# CONCEPT.md — locked by Tanmay (Sat Oct 3)

This is the chosen direction. `artdirector` Phase A does NOT pitch new premises; it develops this one. DESIGN.md must implement it.

## Premise: the construct is a place, not a page

The red-pill side is a navigable space you're *inside*. Projects aren't cards on a page. They are **programs** you load, and each one is its own sub-world inside one shared system.

## 1. The terminal (signature moment)

- Press `` ` `` anywhere on the red side to open it. It's real and typeable, not decorative:
  - `help`
  - `ls programs`
  - `run gods-eye` (or any project slug)
  - `cat resume`
  - `contact`
  - `whoami`
  - `exit`
- It's the thing a recruiter retells later. Polish it obsessively:
  - tab completion
  - command history (↑/↓)
  - helpful errors (`command not found: rnu — did you mean run?`)
  - instant response
- It doubles as accessibility:
  - fully keyboard-driven
  - proper ARIA (`role="log"` output, labelled input)
  - screen-reader friendly
- **It never replaces normal navigation.** Everything the terminal reaches is also reachable by plain clicking. The terminal is the shortcut and the delight, not a gate.
- **It must not look like a generic hacker terminal.** No green-on-black cliché by default. Its look comes from DESIGN.md and from real terminal history: VT100, a BBS, an ops console.

## 2. Each program is a sub-world

Same shared system (tokens, motion, terminal, navigation), but a distinct world per program:

| program | sub-world | built from |
|---|---|---|
| God's Eye | **surveillance footage** | CCTV timecodes, REC indicator, camera IDs, grainy feeds. The vision AI is literally watching the player. The game is the feed |
| AlgoLend AI | **trading floor** | ticker tape, order book, risk-agent readouts, the three agents as desks calling out decisions |
| TRINITY | **the 3 personalities talking** | ARIA, ECHO, and NEXUS converse with each other and the visitor, each with its own voice and color within the system |
| Sweet-Bite / RAG / others | artdirector derives each world from what the project actually does | same rule: the world comes from the work |

**Entering a program is a transition, not a page load.** The `motion` agent owns the "loading a program" moment, shared by every world.

## 3. Easter eggs: one or two, not twenty

Candidates:
- **spoon:** "there is no spoon"
- **white rabbit:** follow it
- **déjà vu cat:** the glitch repeats

artdirector picks **at most 2** and hides them in the terminal or the interface. Discovery should feel earned, never in the way.

## 4. Blue pill stays boring on purpose

- `/blue` is plain, fast, and printable, with zero theatrics.
- The contrast is the joke, and it keeps recruiters safe.
- A recruiter who never takes the red pill still gets everything in under 10 seconds.

## Still applies

AGENTS.md §0 in full: source rule, swap test, banned list. The concept tells us *what*. §0 keeps the *how* from going generic.
