# Contextual Graph Knowledge Base

We present *Contextual Graph Knowledge Base (CGKB)* as the TM memory implementation of *HTMI*. This shall be consistent with design outlines of *HTMI*

## Design

Recall that TM is equivalent to `{Fn, I}`. CGKB serves as the implementation for `I`. To also satisfy the approximation of human-human interaction, we have the following design outlines:

- graph: just as all enumerable data types, this supports TM completeness. Besides, its generality and features are established. `Fn` includes generic TM functions and graph operations on `I`, which is information encoded in graph nodes and edges that richly represent properties and relationships.

- context: the collective term for fundamental information types. E.g. time, entity, contraints, ranking, graph properties, etc. To make TM operations tractable, contextualization restricts the scope to a manageable subgraph.

- ranking: graph indexing analogous to how humans rank memories, for tractability. Ranking can use (human analogies) emotions, LSTM (long-short term memories) for quick graph search.

- learning: consistent with the "inquiries" feature of HTMI, the KB will extend itself by inquiring any missing information.


#### Terminologies

- cognition: graph operations using `I`, analogous to human cognition.
- causality: The directed structure of the graph. Useful feature in search, planning, dependencies, chronology, etc.
- constraint: e.g. privacy (public/private knowledge), existence, soundness.
- norm: preferred defaults to resolve ambiguities.
- plan: The causal graph of the necessary information in `I` to execute in `Fn`.
- plan-execution: calling `fn ∈ Fn` on `i ∈ I`, or `fn(i)`.
- auto-planning: the brain can build up and provide plans as causal graph automatically, such as in the simple case of getting a friend's phone number, or in the more complex case of playing chess. This utilizes all features of the brain enumerated above.


## CGKB algorithm

For searching the graph and executing the plan.
