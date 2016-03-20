# Design of AIVA

This outlines the top level design for AIVA. The A.I. component comes from its NLP (Natural Language Processing) and KB (Knowledge Base), along with other smart things you can plug in to extend AIVA, for example, pattern recognition with deep learning.

For now, design is still underway, and I do my design-thinking here. There are 3 main compoenents: NLP, KB, System.


## Analysis of NLP and KB tools


#### low level

- NLTK
- TextBlob
- Tensorflow
- gensim
- gloVe

#### mid level

- API.ai (interface; no KB)
- wit.ai (interace; no KB)
- MIT START (KB, no interface)
- ConceptNet (KB, no interface)
- BabelNet (KB, no interface)

#### high level

- Watson
- FB bot
- Google bot
- SuperScript (partial)


## New System Design (Mar 19 2016)


#### NLP for interface
- basic shit from Textblob: sentiment, POS etc in case people want it.
- parse input into intent & <args>, and if intent is not a recognized fn, direct to KB
- intent can be "question" if user is querying KB


#### KB

- General knowledge: offload to Google Graph Search API & Google Search
- General knowledge: (can offload via API), import conceptnet5 into neo4j http://neo4j.com/blog/conceptnet-neo4j-database/ Also people have used conceptnet in turing test, see how the NLP part is done for KB-extension, and answering user
- Local knowledge: localized, user-specific, extend brain KB with neo4j. HTMI and CGKB for brain-building and AI interface. Regex fallback?

