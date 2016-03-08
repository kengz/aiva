# Contextual Graph Knowledge Base

We present *Contextual Graph Knowledge Base (CGKB)* as the TM memory implementation of *HTMI*. This shall be consistent with design outlines of *HTMI*

## Design

Recall that TM is equivalent to `{Fn, I}`. CGKB serves as the implementation for `I`. To also satisfy the approximation of human-human interaction, we have the following design outlines:

- graph: just as all enumerable data types, this supports TM completeness. Besides, its generality and features are established mathematically. `Fn` includes generic TM functions and graph operations on `I`, which is information encoded in graph nodes and edges that richly represent properties and relationships.

- context: the collective term for fundamental information types. To make TM operations tractable, contextualization restricts the scope to a manageable subgraph. The enumerated contexts are: privacy (public/private knowledge), entity, ranking, time, constraints, graph properties. 

- ranking: graph indexing analogous to how humans rank memories, for tractability. Ranking can use emotions (human analogy), LSTM (long-short term memories) for quick graph search.

- learning: consistent with the "inquiry" feature of HTMI, CGKB will extend itself by inquiring for missing information.


#### Terminologies

- auto-planning: the brain can build up and provide plans as causal graph automatically, such as in the simple case of getting a friend's phone number, or in the more complex case of playing chess. This utilizes all features of the brain enumerated above.
- canonicalized input `<fn, i_p>`: where `fn` is a TM function, and `i_p` the partial information needed for `fn`'s functional arguments. The output of the interface in HTMI on taking human input, for the TM to use. CGKB will attempt to extract the full information `i` required for `fn`.
- causality: The directed structure of the graph. Used in search, planning, dependencies, chronology, etc.
- cognition: graph operations as `Fn` on `I`, to mimic human cognition.
- constraint: e.g. existence, soundness.
- function execution `fn(i)`: Execute TM function `fn ∈ Fn` on information `i ∈ I` to yield output
- graph: the entire CGKB graph
- norm: preferred defaults to resolve ambiguities.
- plan: The causal graph of the necessary information in `I` to execute in `Fn`.
- plan execution: Extraction of information by traversing plan in reverse causal order from leaves to root, using the supplied `i_p` and contexts. Returns a subgraph for the extraction of `i`


## Autoplanning algorithm

This algorithm operates on the abstract level of CGKB to extract a sufficient plan, or to learn a plan from human.

Is this step context-free? shan't be, cuz planning can be contextual too. ahh how does it use contextualize.

## Contextualize algorithm

This algorithm operates on the concrete level of CGKB 

#### Contextualize:

**input**: graph, plan, partial information `i_p`

**output**: subgraph for the extraction of `i`




## CGKB algorithm

For searching the graph and executing the plan.
