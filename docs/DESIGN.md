# Design of AIVA

This outlines the abstract design for AIVA. The A.I. components are:

- NLP (Natural Language Processing) interface
- KB (Knowledge Base) for the brain memory
- other ML (machine learning) modules we add progressively



## Guiding principles

1. Low complexity for developers, so they can focus on things that matter.
2. Proper usage of AI/ML: NLP, KB, DNN; most of which we handle for developers.
3. One bot, all platforms. More shall benefit when everyone can use the bot from anywhere.



## New System Design (Mar 19 2016)

#### NLP interface

- basic NLP extraction from Textblob: sentiment, POS etc. so people can still use it.
- parse human input into `intent` and `args`. If `intent` is a registered function, execute it with `args`; else, `intent` is KB-access, direct it to KB.
- NLP for human input to KB: see how ConceptNet does that during their Turing test

#### KB

- General knowledge: offload to Google Graph Search API & Google Search
- General knowledge: offload to `ConceptNet5`. Optionally on can into neo4j http://neo4j.com/blog/conceptnet-neo4j-database/ 
- Local knowledge: localized, user-specific, extend brain KB with neo4j. HTMI and CGKB for brain-building and AI interface. Regex fallback?



## Survey on NLP and KB tools

#### low level

- NLTK
- TextBlob
- Tensorflow
- gensim
- gloVe

#### mid level

- API.ai (interface; no KB)
- msg.ai (interface; no KB)
- wit.ai (interace; no KB)
- MIT START (KB, no interface)
- ConceptNet (KB, no interface)
- BabelNet (KB, no interface)

#### high level

- Watson
- FB bot
- Google bot
- SuperScript (partial)
