import json
import re
import spacy
import numpy as np
from autocorrect import spell
from copy import deepcopy
from os import path
from os.path import basename

# the ioid of this script for JSON payload 'from'
ioid = basename(__file__)  # 'hello.py'
# Load the spacy english model
nlp = spacy.load('en')

CONVO_CLASSES_PATH = path.join(
    path.dirname(__file__), '..', '..', 'data', 'convo_classes.json')
CONVO_CLASSES = json.load(open(CONVO_CLASSES_PATH))

MIN_SIM_THRESHOLD = 0.7


def vectorize_queries(convo_classes):
    for topic in convo_classes:
        topic_convo = convo_classes[topic]
        topic_convo['queries_wordvecs'] = []
        for q in topic_convo['queries']:
            q_vector = nlp(q)
            topic_convo['queries_wordvecs'].append(q_vector)
    return convo_classes

vectorize_queries(CONVO_CLASSES)


# helper to clean all text before operation
def clean_input(text):
    # first clean out symbols
    text = re.sub(r'[^\w]', ' ', text)
    # then tokenize
    text = text.split()
    # then correct all spellings
    text = map(spell, text)
    text = " ".join(text)
    return text


# classify a conversation (topic) using wordvec
# return a convo copy,
# i.e. an object in convo_classes
def wordvec_classify(input_str):
    input_str = clean_input(input_str)
    input_v = nlp(input_str)
    high_score = 0
    high_topic = 'exception'
    org_convo = CONVO_CLASSES['exception']  # default
    for topic in CONVO_CLASSES:
        topic_convo = CONVO_CLASSES[topic]
        local_high_score = max([
            input_v.similarity(q_v) for q_v in topic_convo['queries_wordvecs']
        ]) if topic_convo['queries_wordvecs'] else 0
        if (local_high_score > high_score and
                local_high_score > MIN_SIM_THRESHOLD):
            high_score = local_high_score
            high_topic = topic
            org_convo = topic_convo
    convo = deepcopy(org_convo)
    convo['score'] = high_score
    convo['topic'] = high_topic
    return convo


def compose_response(convo):
    options = convo['responses']
    response = np.random.choice(options)
    return {
        'score': convo['score'],
        'topic': convo['topic'],
        'response': response
    }


# basic way to classify convo topic
# then reply by predefined responses in data/convo_classes.json
def classify_convo(input_str):
    convo = wordvec_classify(input_str)
    response_payload = compose_response(convo)
    return response_payload


# module method for socketIO
def classify(msg):
    # the reply JSON payload.
    reply = {
        'output': classify_convo(msg.get('input')),
        'to': msg.get('from'),
        'from': ioid,
        'hash': msg.get('hash')
    }
    # the py client will send this to target <to>
    return reply

def getSimilarWord(input_word):
    input_v = nlp(input_word)
    high_score = 0
    high_convo = {}
    commands = CONVO_CLASSES['commands'] # default
    topic_convo = commands['queries_wordvecs']
    # max([input_v.similarity(q_v) for q_v in topic_convo]) if topic_convo else 0
    for index, conv in enumerate(topic_convo, start=0):
        local_high_score = input_v.similarity(conv)
        if (local_high_score > high_score):
            high_score = local_high_score
            high_convo = commands['queries'][index]
    convo = { 'convo': high_convo }
    convo['score'] = high_score
    return convo

def getCommand(msg):
    reply = {
        'output': getSimilarWord(msg.get('input')),
        'to': msg.get('from'),
        'from': ioid,
        'hash': msg.get('hash')
    }
    return reply
