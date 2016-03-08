# Human-Turing Machine Interface

We present *Human-Turing Machine Interface (HTMI)* that is human-bounded Turing complete.

## Design

**HTMI** consists of a human, a Turing Machine, and an interface. The human sends queries and responses to the interface, which maps and canonicalizes them as inputs to the TM. Symmetrically, the TM sends queries and responses to the interface, which verbalize them as output to the human.

The design outlines of HTMI are as follow:

- approximate human-human interaction
- implement of Human-Centered Design (HCD): discoverability (no manual), with affordances, signifiers, mapping
- constraints and forcing functions (HCD)
- feedback (HCD)
- just as we don't see "human errors" in human-human interaction but to simply ask for clarification, the machine shall do the same. It should treat "human error" as approximation, ask for clarification, and try to complete the action (HCD). Call this "error-resilience", and the machine reaction as "inquiries"
- long-short term memory (LSTM) on both human and TM
- TM must approximate human behavior and human-like brain function, using Contextual Graph Knowledge Base (CGKB)

## Theorem

*HTMI is human-bounded Turing complete.*

#### Definition

**Human-bounded Turing complete**: The class that is the intersection between the Turing complete class and the class of problems enumerable by humans, i.e. the latter class bounds its Turing completeness. Note that it may be Turing complete class itself, if the latter class is bigger than the former.

#### Proof

1. Let a HTMI be given. A TM is Turing complete. For practical interpretation, TM is equivalent to a pair `{Fn, I}`, where `Fn` is the set of functions invokable by a TM with random access of its information `I` on its tape.
2. The interface takes a human input and maps surjectively into `Fn`. If the input cannot be mapped, it is rejected by the interface.
3. For the mapped `fn ∈ Fn`, TM computes using `fn, I`.
4. When the TM halts, the interface passes its output to the human, optionally verbalized.
5. The map above is surjective, mapping from the class of problems enumerable by humans into the TM class.
6. Since only `fn ∈ Fn` are mapped into surjectively and computed, the HTMI class is a subset of the TM class. Since it maps from the class of problems enumerable by humans, the HTMI class is at the intersection between the two classes. Therefore HTMI is human-bounded Turing complete.
