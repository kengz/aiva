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

- basic NLP extraction from Textblob: sentiment, POS etc. so people can still use it. (don't really need textblob if wordnet got this covered)
- parse human input into `intent` and `args`. If `intent` is a registered function, direct to `Fn` (registered functions) and execute with `args`; else, `intent` is KB-access, direct it to 3 KB types below.
- tools: [node word2vec](https://github.com/Planeshifter/node-word2vec), [node natural with wordnet and more](https://github.com/NaturalNode/natural), [wordpos](https://github.com/moos/wordpos), for parsing, canonicalization, normal NLP stuff.


#### KB

- General knowledge: offload to Google Graph Search API & Google Search
- General concepts: offload to `ConceptNet5`. Use [node conceptnet](https://github.com/Planeshifter/node-concept-net)
- Local knowledge: localized, user-specific, extend brain KB with neo4j. Implementation standard can refer to conceptnet. HTMI and CGKB for brain-building and AI interface. Regex fallback?



## Survey on NLP and KB tools

#### low level

- NLTK
- TextBlob
- Tensorflow
- gensim
- gloVe
- [node word2vec](https://github.com/Planeshifter/node-word2vec)
- [node wordnet](https://github.com/Planeshifter/node-wordnet-magic)
- [node natural with wordnet and more](https://github.com/NaturalNode/natural)
- [node conceptnet](https://github.com/Planeshifter/node-concept-net)
- [wordpos](https://github.com/moos/wordpos)

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
