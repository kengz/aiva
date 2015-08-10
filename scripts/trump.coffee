# Description:
#   Donal Trump's quotes
#
# Commands:
#   hubot trump - Gets a random Donald Trump's quote
#
# Author:
#   kengz
  
_ = require 'lomath'

QUOTES = [ "When was the last time anybody saw us beating let’s say " + "China in a trade deal? They kill us. I beat China all the time."
    "The U.S. has become a dumping ground for everybody else’s problems."
    "And our real unemployment is anywhere from 18 to 20 percent. Don't believe " + "the 5.6. Don't believe it."
    "I will be the greatest jobs president that God ever created."
    "Hillary Clinton was the worst Secretary of State in the history of the " + "United States. There's never been a Secretary of State so bad as Hillary. " + "The world blew up around us. We lost everything including all relationships. " + "There wasn't one good thing that came out of that administration or her being " + "Secretary of State."
    "I don’t frankly have time for total political correctness. " + "And to be honest you this country doesn't have time either. " + "This country is in big trouble. We don't win anymore. We lose to China. " + "We lose to Mexico both in trade and at the border. We lose to everybody."
    "If it weren't for me you wouldn't even be talking about illegal immigration. This was " + "not a subject on anybody's mind at my announcement except the reporters are a very dishonest lot."
    "When Mexico sends its people they’re not sending their best. " + "They’re sending people that have lots of problems."
    "I will build a great wall — and nobody builds walls better than me " + "believe me —and I’ll build them very inexpensively. I will build " + "a great great wall on our southern border and I will make Mexico " + "pay for that wall. Mark my words."
    "They’re bringing drugs. They’re bringing crime. They’re rapists. " + "And some I assume are good people."
    "Mexico is becoming the new China!"
    "Mexico’s totally corrupt government looks horrible with El Chapo’s" + " escape—totally corrupt. U.S. paid them $3 billion."
    "Jeb Bush has to like the Mexican illegals because of his wife."
    "A nation WITHOUT BORDERS is not a nation at all. We must have a wall. " + "The rule of law matters. Jeb just doesn’t get it."
    "When did we beat Japan at anything? They send their cars over " + "here by the millions and what do we do? When was the last time " + "you saw a Chevrolet in Tokyo? It doesn't exist folks."
    "I know the Chinese. I've made a lot of money with the Chinese. I understand " + " the Chinese mind."
    "That's one of the nice things. I mean part of the beauty of me " + "is that I'm very rich. So if I need $600 million I can put $600 " + "million myself. That's a huge advantage. I must tell you that's a " + "huge advantage over the other candidates."
    "Do you mind if I sit back a little? Because your breath is very bad."
    "Sorry losers and haters but my I.Q. is one of the highest—and you all " + "know it! Please don’t feel so stupid or insecure. It’s not your fault."
    "As everybody knows but the haters & losers refuse to acknowledge I do not " + "wear a “wig.” My hair may not be perfect but it’s mine."
    "I would bomb the hell out of those oilfields. I wouldn't send many " + "troops because you won't need 'em by the time I'm finished."
    "They just built a hotel in Syria. Can you believe this? They built a hotel. " + "When I have to build a hotel I pay interest. They don't have to pay interest " + "because they took the oil that when we left Iraq I said we should've taken."
    "If Iran was a stock you should go out and buy it cause you'll quadruple."
    "I'm very disappointed in John McCain because the vets are horribly treated " + "in this country. I'm fighting for the vets. I've done a lot for the vets."
    "He's not a war hero. He's a war hero because he was captured. I like people that " + "weren't captured OK I hate to tell you."
    "I try to learn from the past but I plan for the future by focusing exclusively on the present." + "That's where the fun is."
    "You have to think anyway so why not think big?"
    "In the end you're measured not by how much you undertake but by what you finally accomplish."
    "He may have one but there's something on that maybe religion maybe it says he is a Muslim. " + "I don't know. Maybe he doesn't want that. Or he may not have one. I will tell you this: " + "if he wasn't born in this country it's one of the great scams of all time."
    "An 'extremely credible source' has called my office and told me that Barack Obama's birth " + "certificate is a fraud."
    "We have nobody in Washington that sits back and said you're not going to raise that fucking price."
    "I dealt with Gaddafi. I rented him a piece of land. He paid me more for " + "one night than the land was worth for two years and then I didn't let him use the land. "+ "That's what we should be doing. I don't want to use the word 'screwed'' but I screwed him. " + "That's what we should be doing."
    "Rosie is crude rude obnoxious and dumb - other than that I like her very much!"
    "You mean George Bush sends our soldiers into combat they are severely wounded and then he" + "wants $120000 to make a boring speech to them?"
    "You can’t have Bush. The last thing we need is another Bush"
    "What people don’t know about Kasich- he was a managing partner of the horrendous Lehman Brothers" + " when it totally destroyed the economy!"
    "I now see John Kasich from Ohio- who is desperate to run- is using my line" + " 'Make America Great Again'. Typical pol- no imagination!"
    "I’m talking about a lot of leverage. I want to win and we will win."
    "I can't say that I have to respect that person who wins. If I'm" + "the nominee I pledge I will not run as an independent."
    "The other candidates — they went in they didn’t know the air conditioning didn’t work. They sweated" + "like dogs. They didn’t know the room was too big because they didn’t have anybody there. How are they" + "gonna beat ISIS? I don’t think it’s gonna happen."
    "Free trade is terrible. Free trade can be wonderful if you have smart people. But we have stupid people."
    "My Twitter account has over 3.5 million followers. Beat that!"
]


module.exports = (robot) ->
  robot.respond /trump/i, (msg) ->
    msg.send "Trump: _"+ QUOTES[_.random(QUOTES.length-1)] + "_"
