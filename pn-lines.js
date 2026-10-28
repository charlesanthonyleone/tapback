window.PocketNagLines = {
 "meta": {
  "version": 1,
  "placeholders": [
   "{count}",
   "{merchant}",
   "{amount}"
  ],
  "tiers": "1,2,3 = visit number this week; 4 = 4th or more. big/small used ~50% of the time when amount >= big_threshold or <= small_threshold",
  "big_threshold": 75,
  "small_threshold": 5,
  "order": [
   "fast_food",
   "coffee",
   "gas",
   "bars",
   "groceries",
   "online",
   "big_box",
   "generic"
  ],
  "display_names": {
   "mcdonald": "McDonald's",
   "amzn": "Amazon",
   "amazon": "Amazon",
   "starbucks": "Starbucks",
   "chick-fil-a": "Chick-fil-A",
   "wendy": "Wendy's",
   "dunkin": "Dunkin'",
   "target": "Target",
   "walmart": "Walmart",
   "whole foods": "Whole Foods",
   "trader joe": "Trader Joe's",
   "doordash": "DoorDash",
   "costco": "Costco",
   "taco bell": "Taco Bell",
   "burger king": "Burger King",
   "kfc": "KFC",
   "bp": "BP",
   "cvs": "CVS"
  }
 },
 "categories": {
  "fast_food": {
   "keywords": [
    "mcdonald",
    "burger king",
    "wendy",
    "taco bell",
    "kfc",
    "chick-fil-a",
    "popeyes",
    "five guys",
    "subway",
    "sonic",
    "arby",
    "jack in the box",
    "in-n-out",
    "chipotle",
    "domino",
    "pizza hut",
    "papa john",
    "whataburger",
    "shake shack",
    "panda express",
    "doordash",
    "uber eats",
    "grubhub"
   ],
   "1": [
    "{merchant}! Ooh, treat yourself. Just this once.",
    "Fries are a vegetable if you believe hard enough.",
    "Welcome to {merchant}. Your wallet has been notified.",
    "A {merchant} run? Bold. Respect."
   ],
   "2": [
    "{merchant} AGAIN? Twice in one week, okay chef.",
    "Second {merchant} this week. The cashier knows your order now, don't they?",
    "Back at {merchant}? The fries called, didn't they?",
    "Two {merchant} trips this week. That's a pattern, friend."
   ],
   "3": [
    "THIRD time at {merchant} this week?! Are you collecting the toys?",
    "Three {merchant} runs? I'm calling it a lifestyle.",
    "{merchant}, the {count} time this week. At this point, ask for a loyalty plaque.",
    "{count} trip to {merchant}! Somebody hide the car keys."
   ],
   "4": [
    "DAMN, FOR THE {count} TIME THIS WEEK?! EAT SOMETHING HEALTHY FOR ONCE!",
    "{count} {merchant} this week?! A salad just filed a missing person report!",
    "Okay, {count} time. {merchant} should be paying YOU at this point.",
    "{count} visit to {merchant}! Somebody get this person a vegetable, I'm begging!"
   ],
   "big": [
    "{amount} at {merchant}?! Are you feeding the whole block?",
    "{amount} of fast food. Either it's a party or I need to worry."
   ],
   "small": [
    "{amount}? Just a little snack. I see you.",
    "{amount} at {merchant}. Dollar menu legend."
   ],
   "match": "mcdonald|burger king|wendy|taco bell|\\bkfc\\b|chickfila|popeyes|five guys|subway|sonic|arby|jack in the box|innout|chipotle|domino|pizza hut|papa john|whataburger|shake shack|panda express|doordash|uber eats|grubhub"
  },
  "coffee": {
   "keywords": [
    "starbucks",
    "dunkin",
    "coffee",
    "cafe",
    "café",
    "peet",
    "tim hortons",
    "dutch bros",
    "blue bottle",
    "espresso",
    "caribou",
    "costa"
   ],
   "1": [
    "Coffee time! You've earned it. Probably.",
    "{merchant}, a classic. Enjoy that bean juice.",
    "First coffee of the week. Let's keep it classy.",
    "Ah, liquid motivation. Go get 'em."
   ],
   "2": [
    "Coffee number two this week. We're warming up.",
    "{merchant} again? Your barista is starting to like you.",
    "Second coffee this week. Still totally normal. Probably.",
    "Another {merchant}? Your heart rate says hi."
   ],
   "3": [
    "Man, AGAIN? Third coffee this week!",
    "{count} coffee this week. Have you considered a coffee maker?",
    "{merchant} for the {count} time? They should name a drink after you.",
    "Three coffees in. You are now powered by espresso."
   ],
   "4": [
    "{count} COFFEE THIS WEEK?! You're vibrating! I can SEE you vibrating!",
    "{count} time at {merchant}! At this point just move in!",
    "DAMN, {count} coffee this week! That's not a habit, that's a part-time job!",
    "{count} coffee?! Your blood type is officially oat milk latte!"
   ],
   "big": [
    "{amount} at a coffee shop?! Did you buy the espresso machine?",
    "{amount} on coffee. Buying a round for the office, I hope?"
   ],
   "small": [
    "{amount}, plain coffee. Responsible AND caffeinated. Love it.",
    "Just {amount}? A humble cup. Respect."
   ],
   "match": "starbucks|dunkin|coffee|cafe|\\bcaf\\b|peet|tim hortons|dutch bros|blue bottle|espresso|caribou|costa"
  },
  "gas": {
   "keywords": [
    "shell",
    "chevron",
    "exxon",
    "mobil",
    "bp",
    "speedway",
    "wawa",
    "sheetz",
    "marathon",
    "sunoco",
    "circle k",
    "valero",
    "citgo",
    "quiktrip",
    "76",
    "arco",
    "gas",
    "fuel"
   ],
   "1": [
    "Gas! The car says thank you.",
    "Fueling up. Places to be, people to see.",
    "{merchant}. Fill 'er up!",
    "Gas money. The least fun way to spend money."
   ],
   "2": [
    "Gas again? Where are you driving, Canada?",
    "Second fill-up this week. Road trip I wasn't told about?",
    "Back at {merchant}. That car is thirsty.",
    "Two tanks this week. You're basically a delivery driver."
   ],
   "3": [
    "{count} gas stop this week?! Your car's got a drinking problem.",
    "Three fill-ups? Are you running from someone?",
    "{merchant} for the {count} time. Just ask for a reserved pump.",
    "{count} tank this week. Have you considered a bicycle? Kidding. Mostly."
   ],
   "4": [
    "{count} TIME AT THE PUMP THIS WEEK?! Are you driving cross-country for fun?!",
    "{count} fill-up! The gas station should send you a birthday card!",
    "DAMN, {count} tank this week! Is the car leaking or are you just popular?",
    "{count} gas stop?! Okay, NASCAR, slow down!"
   ],
   "big": [
    "{amount} on gas?! Is that a car or a cruise ship?",
    "{amount} at the pump. Ouch. My condolences to your wallet."
   ],
   "small": [
    "{amount} of gas? Just enough to get home. I respect the hustle.",
    "{amount}. A little sip for the car."
   ],
   "match": "shell|chevron|exxon|mobil|\\bbp\\b|speedway|wawa|sheetz|marathon|sunoco|circle k|valero|citgo|quiktrip|\\b76\\b|arco|\\bgas\\b|fuel"
  },
  "groceries": {
   "keywords": [
    "whole foods",
    "trader joe",
    "kroger",
    "safeway",
    "publix",
    "aldi",
    "costco",
    "sprouts",
    "wegmans",
    "h-e-b",
    "heb",
    "food lion",
    "giant",
    "stop & shop",
    "albertsons",
    "market",
    "grocery",
    "foods"
   ],
   "1": [
    "Nice, groceries. That's a responsible one.",
    "Groceries! Look at you, being an adult.",
    "{merchant}! Real food. I'm so proud.",
    "Groceries. Cooking at home? Who are you?"
   ],
   "2": [
    "Groceries again! Forgot the milk, didn't you?",
    "Second grocery run this week. A true chef.",
    "Back at {merchant}. The fridge must be looking great.",
    "Two grocery trips. Honestly? Love this for you."
   ],
   "3": [
    "{count} grocery run this week. Are you opening a restaurant?",
    "{merchant} again! You forgot something AGAIN, didn't you?",
    "Three trips to {merchant}. Make. A. List.",
    "{count} time at {merchant}. They're going to give you an employee badge."
   ],
   "4": [
    "{count} GROCERY TRIP THIS WEEK?! Just write a list, I'm begging you!",
    "{count} time at {merchant}! At this point you live there!",
    "DAMN, {count} grocery run! Your fridge must be a shrine!",
    "{count} visit! The cashier and you are basically family now!"
   ],
   "big": [
    "{amount} on groceries! Feeding an army or just really hungry?",
    "{amount} at {merchant}. That had better be a LOT of vegetables."
   ],
   "small": [
    "{amount}? Just popped in for one thing, huh? Sure.",
    "{amount}. The classic 'I only came for bread' run."
   ],
   "match": "whole foods|trader joe|kroger|safeway|publix|aldi|costco|sprouts|wegmans|\\bheb\\b|\\bheb\\b|food lion|giant|stop shop|albertsons|market|grocery|foods"
  },
  "online": {
   "keywords": [
    "amazon",
    "amzn",
    "ebay",
    "etsy",
    "temu",
    "shein",
    "wayfair",
    "best buy",
    "apple.com",
    "online"
   ],
   "1": [
    "Ooh, a package! Something fun on the way?",
    "Online shopping. The mail carrier thanks you.",
    "{merchant}. Add to cart, huh? Okay.",
    "One little order. What could it hurt?"
   ],
   "2": [
    "Another {merchant} order? Your porch is getting crowded.",
    "Second order this week. The delivery driver knows your dog's name.",
    "Back on {merchant}? Your cart is never really empty, is it?",
    "Two orders. That's two boxes for the recycling."
   ],
   "3": [
    "{count} order this week?! Your porch is a warehouse now!",
    "Three {merchant} orders. Are you building something?",
    "{count} package! Your mailbox needs a vacation.",
    "{merchant} for the {count} time. I'm starting to think you need help."
   ],
   "4": [
    "{count} ORDER THIS WEEK?! The delivery driver is getting your Christmas card!",
    "DAMN, {count} {merchant} order! Your house is turning into a fulfillment center!",
    "{count} order?! Step away from the Buy Now button!",
    "{count} package this week! Your recycling bin is crying!"
   ],
   "big": [
    "{amount} online?! I hope it's something with wheels.",
    "{amount} on {merchant}. Big one. Hope it's worth it!"
   ],
   "small": [
    "{amount}. A cute little impulse buy. I'll allow it.",
    "{amount}? Just a small treat. Cart cleared."
   ],
   "match": "amazon|amzn|ebay|etsy|temu|shein|wayfair|best buy|applecom|online"
  },
  "bars": {
   "keywords": [
    "bar",
    "pub",
    "tavern",
    "brewery",
    "brewing",
    "saloon",
    "lounge",
    "taproom",
    "wine",
    "liquor",
    "cocktail",
    "beer"
   ],
   "1": [
    "Cheers! Have fun, and hydrate.",
    "Night out! Drink some water in between, okay?",
    "{merchant}! Have a great time.",
    "Round one. Pace yourself, superstar."
   ],
   "2": [
    "Back at the bar? Thirsty week!",
    "Second round this week. Remember, water is also a drink.",
    "{merchant} again? The bartender's got your usual ready.",
    "Two nights out. Social butterfly alert."
   ],
   "3": [
    "{count} night out this week?! Your liver wants a word.",
    "Three bar tabs. Are you the mayor of this place?",
    "{count} time at {merchant}. Ask about the frequent flyer program.",
    "{count} round this week. Water. Please. I'm begging."
   ],
   "4": [
    "{count} BAR TAB THIS WEEK?! Your liver has filed a formal complaint!",
    "DAMN, {count} time out! Should we just get your name on a stool?",
    "{count} visit to {merchant}! At this point they should pay you to hang out!",
    "{count} night out?! Go home, drink water, love you!"
   ],
   "big": [
    "{amount} at the bar?! Did you buy a round for the whole room?",
    "{amount} bar tab! Somebody had a GOOD night."
   ],
   "small": [
    "{amount}. One drink and out. Very classy.",
    "{amount}? Just one? Look at you, being responsible."
   ],
   "match": "\\bbar\\b|\\bpub\\b|tavern|brewery|brewing|saloon|lounge|taproom|wine|liquor|cocktail|beer"
  },
  "big_box": {
   "keywords": [
    "target",
    "walmart",
    "wal-mart",
    "kohl",
    "tj maxx",
    "marshalls",
    "ross",
    "home depot",
    "lowe",
    "dollar",
    "cvs",
    "walgreens",
    "ikea"
   ],
   "1": [
    "{merchant}! Did you get what you came for? Just that?",
    "Ah, {merchant}. Came for one thing, left with eleven.",
    "{merchant} run! A classic.",
    "Welcome to {merchant}, where lists go to die."
   ],
   "2": [
    "Back at {merchant}? Forgot something?",
    "Second {merchant} trip. The cart pulled to the left again, huh?",
    "{merchant} again! They put the good stuff by the door, don't they?",
    "Two {merchant} runs. Somebody's redecorating."
   ],
   "3": [
    "{count} {merchant} run this week! They're going to give you a red vest!",
    "Three trips to {merchant}? Are you living in the home goods aisle?",
    "{merchant}, {count} time. Do you need an intervention?",
    "{count} visit. Okay, which aisle is your bedroom in?"
   ],
   "4": [
    "DAMN, {count} {merchant} trip THIS WEEK?! Just ask them for a job!",
    "{count} TIME AT {merchant}?! The greeters know your birthday!",
    "{count} trip?! Someone take away the cart!",
    "{count} visit! At this point, {merchant} should put your photo on the wall!"
   ],
   "big": [
    "{amount} at {merchant}?! You only came for toothpaste!",
    "{amount}. That was NOT a quick trip."
   ],
   "small": [
    "{amount}! In and out of {merchant}. Truly legendary self control.",
    "Just {amount}? You resisted the dollar section. A hero."
   ],
   "match": "target|walmart|walmart|kohl|tj maxx|marshalls|ross|home depot|lowe|dollar|\\bcvs\\b|walgreens|ikea"
  },
  "generic": {
   "keywords": [],
   "1": [
    "Whoa, what are you doing? Okay, okay. Enjoy it!",
    "Ka-ching! {amount} at {merchant}.",
    "{merchant}! Hope it's worth it.",
    "Spending money! I see you. Carry on."
   ],
   "2": [
    "{merchant} again? Twice this week!",
    "Back at {merchant}. They must be nice to you.",
    "Second time at {merchant}. Should I be worried?",
    "Man, AGAIN? {merchant} twice this week."
   ],
   "3": [
    "{count} time at {merchant} this week! Pick a new hobby!",
    "Three trips to {merchant}. Commitment. I respect it.",
    "{merchant}, {count} time! They should name a booth after you.",
    "{count} visit! Are you sure you don't work here?"
   ],
   "4": [
    "DAMN, FOR THE {count} TIME THIS WEEK?! {merchant} should give you a parking spot!",
    "{count} time at {merchant}?! At this point, just move in!",
    "{count} visit this week! Okay, I'm officially worried!",
    "WHOA, {count} TIME?! Even {merchant} wants you to take a break!"
   ],
   "big": [
    "{amount}?! Whoa, whoa, whoa. What are you doing?!",
    "{amount} at {merchant}! Big spender alert! Everybody look!"
   ],
   "small": [
    "{amount}. A tiny one. I'll let it slide.",
    "{amount}? Pocket change. Carry on."
   ],
   "match": "(?!)"
  }
 }
};
