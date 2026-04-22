// ── Section 2: All Journeys ────────────────────────────────────────────────────

const EP_LIST = ['I','II','III','IV','V','VI','VII','VIII','IX'];

// Episode metadata — representative scene image + full title
const EPISODE_DATA = {
  'I':    { title:'The Phantom Menace',       img: _SCENE.BATTLE_NABOO      },
  'II':   { title:'Attack of the Clones',     img: _SCENE.GEONOSIS_BATTLE   },
  'III':  { title:'Revenge of the Sith',      img: _SCENE.MUSTAFAR_DUEL     },
  'IV':   { title:'A New Hope',               img: _SCENE.BATTLE_YAVIN      },
  'V':    { title:'The Empire Strikes Back',  img: _SCENE.CLOUD_CITY_DUEL   },
  'VI':   { title:'Return of the Jedi',       img: _SCENE.BATTLE_ENDOR      },
  'VII':  { title:'The Force Awakens',        img: _SCENE.TAKODANA_SKIRMISH },
  'VIII': { title:'The Last Jedi',            img: _SCENE.BATTLE_CRAIT      },
  'IX':   { title:'The Rise of Skywalker',    img: _SCENE.BATTLE_EXEGOL     },
};

// Episode selector button grid (3 × 3)
const EP_ROWS = [['I','II','III'], ['IV','V','VI'], ['VII','VIII','IX']];

// ── Episode + planet synopses ─────────────────────────────────────────────────
// Key: "episode:planet" — used as the beat description in the journeys panel.
// Falls back to the per-character beat texts for any unlisted combination.
const EPISODE_SYNOPSES = {

  // ── Episode I · The Phantom Menace ──
  'I:Tatooine':
    `Qui-Gon and Obi-Wan make an emergency landing while escorting Queen Amidala from the Trade Federation blockade. In Mos Espa, Qui-Gon meets nine-year-old slave Anakin Skywalker — a boy with an unprecedented midichlorian count who builds droids and races pods. He bets Anakin's freedom on the Boonta Eve Classic; Anakin wins. The boy says goodbye to his mother Shmi and the protocol droid he built for her, C-3PO. Darth Maul intercepts them on the outskirts with a lightsaber before the Naboo starship escapes. Tatooine produces a Chosen One and a parting that will define the next thirty years of galactic history.`,

  'I:Coruscant':
    `Queen Amidala's delegation arrives to find Senate bureaucracy as hostile as the blockade they fled. Palpatine engineers a no-confidence vote against Chancellor Valorum, clearing his own path to power. Qui-Gon presents Anakin to the Jedi Council; Yoda and Mace Windu sense fear in the boy and refuse to train him — too old, too attached. Padmé, frustrated by procedural paralysis, chooses to return to Naboo and fight. Anakin, rejected by the Council but promised training by Qui-Gon regardless, departs with the delegation. Palpatine's election as Supreme Chancellor is confirmed before they leave.`,

  'I:Naboo':
    `Amidala's liberation runs on three simultaneous fronts: the Gungan Grand Army draws the droid forces; Anakin accidentally destroys the Droid Control Ship from inside its own hangar; and the Queen's team battles through the Theed palace. In the generator complex, Darth Maul confronts both Jedi. He kills Qui-Gon. Obi-Wan, driven past grief into pure focus, bisects Maul and falls back into the processing shaft. Anakin is recovered alive. The occupation ends — but costs the Jedi who most believed in the boy he brought home. Obi-Wan inherits both the Padawan and the promise.`,

  // ── Episode II · Attack of the Clones ──
  'II:Coruscant':
    `Padmé's return for the Military Creation Act vote triggers an assassination attempt — poisonous kouhuns in her bedroom, her decoy Cordé killed instead. Obi-Wan and Anakin are assigned as her protectors. Obi-Wan pursues the attacker, Zam Wesell, through the cityscape before she is silenced by a saberdart traced to the ocean world Kamino. Anakin escorts Padmé to Naboo. Palpatine quietly notes the attachment. Meanwhile his emergency-powers legislation moves through Senate committees, and a secret army grows in an ocean on a world erased from the Jedi Archives.`,

  'II:Naboo':
    `Under the guise of protection, Anakin and Padmé retreat to the Varykino lake country. Anakin declares his feelings; Padmé deflects — a senator and a Jedi cannot afford this. When his visions of Shmi suffering overwhelm him, they leave together for Tatooine. The film closes where it opened: they return to Naboo for a secret wedding on the Varykino terrace, witnessed only by R2-D2 and C-3PO. No announcement is made. The marriage violates the Jedi Code and senatorial convention. They make it anyway — with the conviction of people who have decided the rules cannot contain what they feel.`,

  'II:Tatooine':
    `Anakin's visions of his mother intensify until they travel to the Lars moisture farm. Owen and Beru confirm the worst: Tusken Raiders took Shmi a month ago. Anakin rides into the Jundland Wastes alone, finds her alive — and she dies in his arms moments later. He kills the entire Tusken camp: men, women, children. He returns carrying her body and confesses the massacre to Padmé. She holds him rather than condemning him. Cliegg Lars buries his wife on the farm. Anakin makes a silent promise — that he will learn to prevent death — that no one can keep.`,

  'II:Kamino':
    `Obi-Wan's investigation leads to an ocean world deliberately erased from the Jedi Archives. The Kaminoans receive him as if expected and show him a clone army commissioned in the name of the late Jedi Master Sifo-Dyas: two hundred thousand units growing in tanks, trained from birth, templated from bounty hunter Jango Fett. A rain-soaked duel on the landing platform sends Jango into the clouds; Obi-Wan attaches a tracker before he goes. The army's true chain of command runs through Darth Sidious, who commissioned it to execute Order 66 on the day it was needed. The Republic's salvation has been engineered as its executioner.`,

  'II:Geonosis':
    `The red-dust arena nearly kills three of the saga's most important people before a single soldier is officially deployed. Obi-Wan, captured mid-investigation, is joined in the execution arena by Anakin and Padmé. Mace Windu arrives with two hundred Jedi before the execution beasts warm up. Count Dooku watches from a box; Jango Fett dies by Mace's blade in front of his son Boba. Yoda arrives with the first clone deployment. Anakin loses his right forearm to Dooku's saber in a brief exchange. The Clone Wars open on two fronts simultaneously — one military, one personal.`,

  // ── Episode III · Revenge of the Sith ──
  'III:Alderaan':
    `Bail Organa flies to Alderaan carrying the infant Leia Amidala Skywalker — one of two children whose existence must remain hidden from the Empire taking shape above Coruscant. On Alderaan's mountain terrace, Queen Breha Organa receives the child Bail promised her. They have long wanted to adopt; the galaxy's most catastrophic night has given them a daughter. Leia will be raised as Princess of Alderaan with no knowledge of her true parentage. Bail ensures household droids are wiped. The decision made at Polis Massa — split the twins, hide them in plain sight — is carried out. Two children begin their lives at opposite ends of the galaxy on the same morning.`,

  'III:Coruscant':
    `Obi-Wan and Anakin rescue Chancellor Palpatine from a Separatist siege — though the enemy seemed to allow it. On the ground, Anakin's visions of Padmé dying in childbirth make him desperate, and Palpatine offers the only solution: dark side knowledge that can conquer death. Mace Windu's arrest attempt ends with Anakin severing his arm; Palpatine hurls him from a window. Order 66 transmits simultaneously to clone commanders across the galaxy. Anakin leads the 501st into the Jedi Temple. Palpatine addresses the Senate and declares the First Galactic Empire to thunderous applause. The Republic ends not with a battle, but with a vote.`,

  'III:Utapau':
    `Obi-Wan is sent alone to deal with General Grievous, separating him from Anakin at the worst possible moment. The confrontation moves from a sinkhole landing platform to a wheel-bike chase through the inhabited walls, ending when Obi-Wan kills Grievous with a blaster and remarks on the indignity. Clone Commander Cody receives Order 66 and fires on Obi-Wan with an AT-TE cannon. Obi-Wan survives the fall, recovers Grievous's starfighter, and escapes — the only Jedi general to survive Order 66's initial strike with enough clarity to act. He carries the knowledge of what happened on Coruscant, and what must come next.`,

  'III:Kashyyyk':
    `Yoda commands clone forces on the Wookiee homeworld alongside Master Luminara Unduli, defending the forest beaches against Separatist battle droids. When Order 66 activates, two clone troopers turn on Yoda from behind — he kills both before the turn completes, sensing the simultaneous deaths of Jedi across the galaxy. Wookiee chieftain Tarfful and a young Chewbacca conceal him in the forest and smuggle him off-planet in an escape pod. What Yoda leaves behind is a world soon to be occupied, its people enslaved by Imperial labor programs. Chewbacca watches his home fall and carries the memory for fifty years.`,

  'III:Mustafar':
    `Darth Vader executes the Separatist Council without hesitation, then waits. Padmé follows; the reunion fractures instantly — Vader believes Obi-Wan used her against him and Force-chokes her. Obi-Wan emerges from the ship and the duel begins across platforms above active lava. Obi-Wan takes the high ground. Vader leaps and loses both legs and his remaining arm to a single stroke. Obi-Wan leaves him burning on the volcanic bank, unable to deliver the killing blow. Palpatine retrieves what remains. The reconstruction on Coruscant produces the armored figure the galaxy will spend twenty-three years fearing. Padmé dies giving birth to twins she names Luke and Leia.`,

  'III:Polis Massa':
    `The isolated asteroid medical facility becomes the site of the galaxy's most consequential night. Padmé gives birth to twins — Luke, then Leia — before dying from injuries the droids classify partly as a loss of will to live. Luke goes to Tatooine; Leia goes to Alderaan with Bail Organa. Their existence must remain hidden. C-3PO's memory is wiped; R2-D2 refuses and is kept anyway. Padmé's body is staged to appear still pregnant to protect the secret at her funeral. Three people leave Polis Massa carrying the only genuine resistance to the Empire: two newborns hidden at opposite ends of the galaxy.`,

  'III:Naboo':
    `Padmé Amidala's state funeral fills Theed with mourners. Her body is staged to appear still pregnant — protecting the twins' existence from Vader. The people of Naboo grieve their former senator without knowing the Empire she helped create killed her. The procession moves through Theed's baroque archways as Imperial administration tightens its grip. Jar Jar Binks walks among the official mourners. The surviving Jedi cannot appear publicly. Naboo becomes the last moment the galaxy mourns openly — after this, grief becomes private and dangerous. The planet buries its queen as the Empire announces its own name.`,

  'III:Tatooine':
    `Obi-Wan delivers the infant Luke Skywalker to Owen and Beru Lars at the moisture farm. Owen accepts the child with the wariness of a man who understands the cost of Skywalker proximity. Obi-Wan settles into the Jundland Wastes as Ben and begins a nineteen-year vigil — watching from a distance, invisible otherwise. The film's final image — Luke silhouetted against the twin suns — mirrors a composition that will recur when he stands in the same place dreaming of leaving. Yoda goes to Dagobah. The galaxy does not know what has been hidden here. Two suns set over the son of the man who destroyed the Republic.`,

  'III:Dagobah':
    `After Order 66, Yoda chooses Dagobah as his exile — a remote swamp world dense enough in organic life to mask a Force-sensitive presence from Imperial detection. No sentient inhabitants, only ancient trees and a dark-side cave that waits patiently for whoever needs testing. The canonical silence between Revenge of the Sith and A New Hope is not idle: Yoda uses the years to commune with Qui-Gon Jinn's Force ghost and learn the technique for maintaining consciousness after death — the foundation of Jedi continuity. He is preparing for Luke Skywalker, who will not arrive for twenty-three years.`,

  // ── Episode IV · A New Hope ──
  'IV:Tatooine':
    `Leia hides the Death Star plans inside R2-D2 before her capture. The droids land on Tatooine, are separated, and are sold to the Lars moisture farm — where Luke discovers the partial hologram and brings R2 to the hermit Ben Kenobi. Obi-Wan gives Luke his father's lightsaber and a carefully edited story of Anakin Skywalker. Luke returns to find the homestead in smoking ash: Owen and Beru dead, stormtroopers executing a droid recovery protocol. His last reason to stay is gone. A cantina in Mos Eisley, a negotiation with a Corellian smuggler, and the Falcon lifts off with the Death Star plans, an old Jedi, a farm boy, and a smuggler who hasn't yet decided to care.`,

  'IV:Alderaan':
    `Alderaan barely exists as a location before it ceases to exist as a planet. Tarkin selects it as the Death Star's demonstration target — a peaceful, unarmed world whose destruction communicates Imperial resolve more clearly than any policy statement. Leia is forced to watch as the superlaser fires. Two billion people and every memory of her childhood become an expanding debris field. She does not collapse. Obi-Wan staggers from a disturbance in the Force — two billion deaths echoing through him simultaneously. Han flies the Falcon through the asteroid field that used to be a planet and cannot explain what he is seeing.`,

  'IV:Yavin 4':
    `The Rebel base in the Massassi temple identifies the Death Star's critical weakness: a two-meter exhaust port at the end of a trench run. Thirty fighters launch as the station enters the system. Red and Gold Squadrons absorb devastating attrition. Luke switches off his targeting computer and trusts Obi-Wan's voice. Han Solo returns from hyperspace — having taken his payment and apparently reconsidered — and clears Vader's wingmen at the last second. The torpedo finds the port. The Death Star explodes. The galaxy's first collective exhale since Order 66. Leia presents medals. The Rebellion has won the battle that proves it can win.`,

  // ── Episode V · The Empire Strikes Back ──
  'V:Hoth':
    `A probe droid locates Echo Base and General Rieekan orders immediate evacuation. Snowspeeder squadrons topple AT-AT walkers with tow cables, buying time as the shield generator falls. Han finds Luke near death in the wilderness — kept alive overnight in a tauntaun's thermal interior — and gets him back to base. Leia and Han escape on the Falcon with a hyperdrive that refuses to engage, pursued into an asteroid field. Luke takes a separate ship toward Dagobah, guided by Obi-Wan's ghost. The Alliance scatters. The Empire wins the battle decisively and the Rebellion is running, everything depending on whether a hermit in a swamp can finish what Qui-Gon started.`,

  'V:Dagobah':
    `Yoda receives Luke with deliberate misdirection — an eccentric swamp creature testing his patience before revealing himself. Training runs through fog, mud, and the dark-side cave, where Luke faces a vision of Vader and finds his own face in the helmet. The message lands but isn't understood. When Luke senses his friends suffering on Bespin, he cuts training short over both masters' objections. Yoda warns that incomplete training produces incomplete Jedi — and that choosing friends over completion is exactly how the dark side recruits. Luke leaves anyway. What he can't yet grasp is that Yoda is describing his father's history with perfect accuracy.`,

  'V:Bespin':
    `Cloud City is Han's last available card — a neutral port run by Lando Calrissian, who has made a deal with the Empire he'll spend the film quietly undoing. The trap is already set when the Falcon arrives. Han is frozen in carbonite as a test subject and handed to Boba Fett as Jabba's payment. Luke arrives and fights Vader through the carbon-freezing chamber and reactor shaft below the city — losing his right hand and absorbing a truth that reframes everything Obi-Wan told him. He falls. The Falcon retrieves him from an antenna below the city. Vader achieved every objective. The Falcon escapes into hyperspace carrying a wound that will take the rest of the saga to heal.`,

  // ── Episode VI · Return of the Jedi ──
  'VI:Tatooine':
    `The Rebel rescue of Han unfolds in layers: Lando infiltrates as a guard; Leia arrives as bounty hunter Boushh and is enslaved when Jabba anticipates the thaw; R2-D2 and C-3PO arrive as gifts; Luke walks in last, kills the rancor, and is sentenced to the Sarlacc. The execution at the Pit of Carkoon becomes a three-way battle: R2 launches Luke's saber, Leia strangles Jabba with his own chain, and the barge explodes over the Dune Sea. Jabba is dead, Han is free, Boba Fett falls into the Sarlacc. The team departs without explaining anything to anyone.`,

  'VI:Dagobah':
    `Luke returns to complete his training and finds Yoda dying — nine hundred years old and at peace. The conversation is brief: Yoda confirms Vader is Luke's father, tells him there is another Skywalker, and becomes one with the Force, his body fading from the bed. Obi-Wan's ghost supplies what Yoda's last breath left out — Leia is Luke's twin sister, the deception was a mistake. Luke accepts what facing Vader requires and what he may not survive. He leaves Dagobah for the last time with nine centuries of Jedi wisdom distilled into two conversations and one instruction: face Darth Vader.`,

  'VI:Endor':
    `The forest moon hosts the Rebellion's most improbable alliance. While the fleet is drawn into a trap above the planet, Han's strike team allies with Ewoks to destroy the Death Star II's shield generator. The Ewoks contribute catapults, log drums, and a hijacked AT-ST. Inside the station, Luke surrenders to Vader and is brought before the Emperor, who attempts to turn him through his friends' deaths. Vader watches his son being destroyed by lightning, then lifts the Emperor and throws him into the reactor shaft — dying not as Darth Vader but as Anakin Skywalker, redeemed in his final moments. The Death Star explodes. Twenty-three years after Order 66, the Skywalker arc reaches its first resolution.`,

  // ── Episode VII · The Force Awakens ──
  'VII:Jakku':
    `Jakku holds two stories on the same desert night. In the village of Tuanul, Kylo Ren leads the First Order in search of a map to Luke Skywalker — kills Resistance ally Lor San Tekka, captures Poe Dameron, orders the village executed. Poe hides the map in BB-8, who escapes into the dark. Across the same planet, scavenger Rey has waited eleven years for family that isn't coming back. FN-2187 — conscience broken by the massacre — frees Poe and defects; both crash back on the surface. Rey and BB-8 flee the First Order pursuit in the Millennium Falcon, discovering mid-flight that its owner has reclaimed it. The trilogy's central alliance assembles by accident on a planet most of the galaxy has already forgotten.`,

  'VII:Takodana':
    `Maz Kanata's thousand-year-old castle holds everyone's secrets. In the basement, Anakin Skywalker's lightsaber calls to Rey through a closed chest. She opens it, receives a Force vision — corridor darkness, a child in rain, a voice saying she already knows — and runs from it directly into Kylo Ren in the forest. The First Order destroys the castle from orbit; X-wings arrive from the Resistance. Finn fights a former colleague with a lightsaber he was never trained to use. Kylo captures Rey and withdraws. Han and Chewie recover the saber. What the vision showed Rey matches events she has never witnessed. The Force has begun its longest argument about who she is.`,

  'VII:D\'Qar':
    `R2-D2 — dormant since Luke's disappearance — powers on without warning and completes the Jakku map fragment. The full star map resolves to a location at the galaxy's edge. Han is dead. Leia knows before anyone tells her, reaching for him through the Force the moment it happens. Rey finds her and they hold each other without words. The debrief, the grief, and the departure are compressed into minutes — the First Order is still operational and the galaxy needs Ahch-To. Rey boards an X-wing with R2 and the lightsaber. The Resistance has destroyed Starkiller Base, but the question of who destroyed it — a scavenger who called a lightsaber from the snow — remains open.`,

  'VII:Starkiller Base':
    `The First Order's planet-weapon fires once, destroying the entire Hosnian system — the Republic capital, five planets — in a beam visible across the galaxy. Han, Rey, and Finn infiltrate to disable the shields. Han finds his son on an interior bridge; the conversation ends with Kylo Ren's lightsaber through his father's chest. Finn fights Kylo in the snow and is incapacitated. Rey calls the lightsaber over Kylo's competing attempt and holds her own until the planet tears itself apart beneath them. Poe destroys the oscillator. The weapon implodes. Han Solo is dead. The First Order survives with its most dangerous officer still breathing.`,

  'VII:Ahch-To':
    `The star map ends on an island at the edge of the known galaxy. Stone steps lead up past Lanai caretakers who have tended this place far longer than anyone remembers. Rey climbs alone and finds Luke Skywalker at the cliff's edge with his back to the horizon. She holds out his father's lightsaber. He turns and looks at her. The Force Awakens ends on this image. The island — ancient Jedi temple structures, sacred texts in a hollow tree, a dark-side cave that waits — will be the setting for the next film's central confrontation. Luke came here to ensure the Jedi end with him. What arrives instead is a young woman the Force is already moving around like weather.`,

  // ── Episode VIII · The Last Jedi ──
  'VIII:D\'Qar':
    `The Resistance evacuates under fire. The First Order's Dreadnought charges its surface cannons while Poe Dameron stalls it solo — saving the base but costing every bomber and crew member in the wing. Leia is blown off the bridge into space and survives through a Force ability she has never consciously used. Poe is demoted for the bomber loss, crystallizing the film's central argument: who decides which lives are worth spending? The fleet escapes into hyperspace with First Order tracking technology following them. The evacuation succeeds by the only available measure: the important people lived. Everything the film asks about authority and sacrifice begins here.`,

  'VIII:Ahch-To':
    `Luke gives Rey three lessons, then tries to burn the Jedi texts. The Force-bond between Rey and Kylo activates without warning — conversations across space give Rey a more complex picture of Ben Solo than Luke's silence offers. Luke's account of nearly killing Ben in his sleep — one moment of fear he cannot forgive himself for — comes out in pieces. Yoda's ghost arrives and burns the ancient tree himself; the texts are already in Rey's bag. Luke agrees to face what he fled, then refuses at the last moment to go to Crait in person. He changes his mind. The island records the story of a master who finally learns that failure is something you can also teach.`,

  'VIII:Cantonica':
    `Canto Bight exists to show the war from the perspective of those who fund it. Finn and Rose arrive to find a codebreaker who can disable the First Order's hyperspace tracker. The mission immediately fails: arrested for a parking violation, they find DJ in a jail cell instead — not the one Maz recommended but functionally available. Canto Bight's towers are built on weapons dealing; the city supplies both sides of every conflict. DJ boards the Supremacy and immediately sells Finn and Rose to the First Order for personal survival. The detour accomplishes nothing tactically and raises a moral question the film refuses to answer: who is ultimately responsible for wars that keep happening?`,

  'VIII:Crait':
    `The old Rebel outpost on Crait hosts the Resistance's last stand. Twenty-seven survivors hold a bunker against the First Order's battering-ram cannon and Kylo Ren in personal command. Luke Skywalker appears on the salt flats — calm, unhurried, wearing the face of the man he was before his failure — and walks out alone to face the entire deployment. He is a Force projection from Ahch-To. His blade touches nothing Kylo throws at him. He buys exactly enough time for the survivors to escape through a mountain passage the crystal foxes revealed, then vanishes — becoming one with the Force. Thirty people escape on the Falcon. The spark, as Leia says, that will light the fire.`,

  // ── Episode IX · The Rise of Skywalker ──
  'IX:Mustafar':
    `Years after Vader's death, Mustafar has begun to recover — lava flows receding at the edges, the first trees pushing through volcanic rock. Kylo Ren arrives at Fortress Vader with a stormtrooper escort, hunting the Sith wayfinder his grandfather once possessed — the only device that can navigate to Exegol. The Alazmec of Winsit, a cultist sect that colonized the ruins to absorb Vader's dark-side legacy, refuse to yield to the Supreme Leader. Kylo cuts through them and retrieves the wayfinder from the fortress depths. Palpatine's broadcast has already reached the galaxy. Kylo now has coordinates. The quest to find the dead Emperor — and the war it will start — begins here.`,

  'IX:Ahch-To':
    `Rey flies to Ahch-To to stop herself — to burn the ship, refuse the mission, ensure Palpatine's heir never reaches Exegol. Luke's Force ghost arrives with the patience of someone who has already been through the version of this that ends badly. He tells her the truth he failed to tell himself: running from what you fear is how you become it. He gives her Leia's lightsaber. He raises his X-wing from the ocean floor and sends her toward Exegol with coordinates only a Sith wayfinder could have provided. Luke's final act is giving someone else the tools he spent thirty years refusing to use himself.`,

  'IX:Ajan Kloss':
    `The Resistance's jungle moon base hums with urgency. Rey trains with General Leia as her Jedi Master while Poe and Finn run intelligence operations. Palpatine's galaxy-wide broadcast — announcing his return, revealing the Sith fleet on Exegol — forces the mission to accelerate: find a wayfinder, navigate to the hidden world, stop the fleet before it deploys. R2-D2 backs up C-3PO's memory before the wipe Babu Frik will perform on Kijimi. Leia holds on past her body's limits to complete the transfer of what she knows. The base launches its last mission — the jungle going on making its sounds, indifferent to whether the galaxy's remaining resistance is large enough.`,

  'IX:Exegol':
    `Palpatine's Final Order fleet — thousands of Xyston-class Star Destroyers with axial superlasers — fills the space above the dark world. The Resistance broadcasts a call and the galaxy answers: Lando returns with civilian ships from hundreds of systems. Rey faces Palpatine alone; he attempts Sith transference to move his consciousness into her. The voices of every Jedi reach across the Force. She raises both lightsabers and his own lightning returns to him. The fleet loses its signal and falls. Ben Solo arrives just in time: he gives Rey what remains of his life force. She opens her eyes. He becomes one with the Force, smiling. The war that began at Naboo sixty-seven years earlier ends above Exegol.`,

  'IX:Pasaana':
    `The Festival of the Ancestors fills Pasaana's desert with Aki-Aki lanterns rising every forty-two years — an event that has nothing to do with the Resistance team's arrival. They find Ochi's Sith dagger, its Old Tongue inscription pointing toward a wayfinder and, through it, Exegol. C-3PO can read the inscription but his programming prevents translation, requiring a memory wipe on Kijimi. Kylo Ren arrives with the Knights of Ren. A Force-lightning discharge from Rey apparently destroys Chewbacca's transport — Kylo reveals hours later he transported Chewie to the Steadfast instead. The mission has its clue and has just lost Chewbacca to a First Order prison ship above the planet.`,

  'IX:Kijimi':
    `Babu Frik's workshop on the mountain city can do things with droid memory that no one else manages. C-3PO carries the Sith inscription in his optical memory but a deep programming lock prevents him from translating it — a restriction Babu Frik can bypass at the cost of wiping everything else C-3PO remembers. He agrees, says goodbye to each companion knowing he won't remember them afterward, and submits. The translation gives them the wayfinder's location. Rey senses Chewbacca alive on the Steadfast above, boards it, and fights her way to him. C-3PO departs Kijimi politely unfamiliar with everyone around him. R2-D2's earlier backup will eventually restore him.`,

  'IX:Kef Bir':
    `The Death Star II's ruins sit half-submerged in the grey ocean of Kef Bir — kilometers of wreckage from an ambition that failed and still haunts. Rey finds the wayfinder in the Emperor's shattered throne room. Kylo Ren destroys it immediately. The fight on the crumbling superstructure is between two people simultaneously trying to kill and save each other, and neither impulse wins. Rey stabs Kylo through the chest. Leia's death reaches her through the Force at the same moment. She heals him and takes his ship for Ahch-To. Ben Solo stands on wet metal above the grey sea — alive by someone else's generosity — and hears his father's voice.`,

  'IX:Tatooine':
    `Rey returns to the desert where it began. She buries Luke and Leia's lightsabers at the Lars homestead, beside the igloo where Anakin Skywalker grew up in slavery. An elderly local asks her name. She looks at the twin suns going down over the dunes, at the Force ghosts of Luke and Leia standing in the golden light behind her, and gives the answer nine films have been building toward: Rey Skywalker. The horizon is the same one Anakin, Obi-Wan, Luke, and now Rey have all stood before in turn — same twin suns, same sand, same question of what comes next. For the first time, the answer belongs entirely to her.`,
};

// ── Precompute episode beat lists ─────────────────────────────────────────────
// Each episode: ordered unique planets (first-encounter across CHAR_LIST order),
// annotated with every character who visited and their individual beat text.
function buildEpisodeBeats(ep) {
  const seen = new Map(); // planet → { chars[], beats[{char,beat}] }
  CHAR_LIST.forEach(charName => {
    (JOURNEYS[charName] || []).forEach(b => {
      if (b.ep !== ep) return;
      if (!seen.has(b.planet)) seen.set(b.planet, { chars: [], beats: [] });
      const e = seen.get(b.planet);
      if (!e.chars.includes(charName)) e.chars.push(charName);
      e.beats.push({ char: charName, beat: b.beat });
    });
  });
  return Array.from(seen.entries()).map(([planet, d]) => ({
    planet, chars: d.chars, beats: d.beats,
  }));
}
const EPISODE_BEATS = {};
EP_LIST.forEach(ep => { EPISODE_BEATS[ep] = buildEpisodeBeats(ep); });

// ── State ─────────────────────────────────────────────────────────────────────
let activeEp        = 'I';
let activeEpBeat    = 0;
let jScrollLock     = false;
let jResizeObserver = null;

// ── SVG setup ─────────────────────────────────────────────────────────────────
const journeysSvg = d3.select('#journeys-svg');
journeysSvg.attr('viewBox', `0 0 ${W} ${H}`);
drawGalaxyBase(journeysSvg);
const jDefs = journeysSvg.select('defs');

// Fog radial gradients (j-prefixed IDs avoid collision with follow section)
['jfog-a','jfog-b','jfog-c'].forEach((id, i) => {
  const rg = jDefs.append('radialGradient').attr('id', id)
    .attr('cx','50%').attr('cy','50%').attr('r','50%');
  const stops = [
    ['rgba(0,80,180,0.07)',  'rgba(0,80,180,0)'],
    ['rgba(80,0,160,0.06)',  'rgba(80,0,160,0)'],
    ['rgba(0,160,200,0.05)', 'rgba(0,160,200,0)'],
  ][i];
  rg.append('stop').attr('offset','0%').attr('stop-color', stops[0]);
  rg.append('stop').attr('offset','100%').attr('stop-color', stops[1]);
});

// Glow filter
const jGlowF = jDefs.append('filter').attr('id','jglow')
  .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
jGlowF.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','4').attr('result','blur');
const jGlowMerge = jGlowF.append('feMerge');
jGlowMerge.append('feMergeNode').attr('in','blur');
jGlowMerge.append('feMergeNode').attr('in','SourceGraphic');

// Planet soft-glow filter
const jPGlowF = jDefs.append('filter').attr('id','jplanet-glow')
  .attr('x','-100%').attr('y','-100%').attr('width','300%').attr('height','300%');
jPGlowF.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','3');

// Static fog ellipses
const jFogG = journeysSvg.append('g').attr('class','jfog-g').attr('pointer-events','none');
[{x:.35,y:.55,rx:.28,ry:.20,fill:'url(#jfog-a)'},
 {x:.65,y:.30,rx:.22,ry:.16,fill:'url(#jfog-b)'},
 {x:.50,y:.70,rx:.30,ry:.18,fill:'url(#jfog-c)'}].forEach(f => {
  jFogG.append('ellipse')
    .attr('cx',f.x*W).attr('cy',f.y*H).attr('rx',f.rx*W).attr('ry',f.ry*H)
    .attr('fill',f.fill);
});

// CSS: fog drift (reuses fog-drift-a/b/c keyframes from follow.js) + pulse ring
(function () {
  const s = document.createElement('style');
  s.textContent = `
    .jfog-g ellipse:nth-child(1){animation:fog-drift-a 18s ease-in-out infinite}
    .jfog-g ellipse:nth-child(2){animation:fog-drift-b 22s ease-in-out infinite}
    .jfog-g ellipse:nth-child(3){animation:fog-drift-c 26s ease-in-out infinite}
    @keyframes jpulse{0%{opacity:.7}100%{r:22;opacity:0}}
    .jpulse-ring{animation:jpulse 1.8s ease-out infinite}
  `;
  document.head.appendChild(s);
})();

// SVG render layers (path → dots → labels → active overlay)
const jPathG   = journeysSvg.append('g').attr('class','jpath-g');
const jDotsG   = journeysSvg.append('g').attr('class','jdots-g');
const jLabelsG = journeysSvg.append('g').attr('class','jlabels-g');
const jActiveG = journeysSvg.append('g').attr('class','jactive-g');

// ── Ambient particle canvas ───────────────────────────────────────────────────
// Lives at section level — particles bleed across the full viewport height,
// matching the same seamless blend used in the Follow section.
const journeysSection = document.getElementById('journeys');
const jCanvas         = document.createElement('canvas');
jCanvas.id = 'journeys-particles';
journeysSection.appendChild(jCanvas);

function resizeJCanvas() {
  jCanvas.width  = journeysSection.clientWidth;
  jCanvas.height = journeysSection.clientHeight;
}
resizeJCanvas();
new ResizeObserver(resizeJCanvas).observe(journeysSection);

const J_PARTICLES = Array.from({length:80}, (_,i) => ({
  x:Math.random(), y:Math.random(),
  r: i<50 ? Math.random()*1.0+0.2 : Math.random()*0.5+0.15,
  vx: (Math.random()-.5)*(i<50?.00015:.0004),
  vy: (Math.random()-.5)*(i<50?.00015:.0004),
  base: Math.random()*.18+.03,
  tw:  Math.random()*Math.PI*2,
  tws: Math.random()*.015+.004,
  hue: i<50 ? 210 : (Math.random()>.5 ? 180 : 280),
}));

let jRaf = null;
function animateJParticles() {
  const ctx = jCanvas.getContext('2d');
  const cw = jCanvas.width, ch = jCanvas.height;
  ctx.clearRect(0, 0, cw, ch);
  J_PARTICLES.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.tw += p.tws;
    if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
    if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    const op = p.base * (0.5 + 0.5 * Math.sin(p.tw));
    ctx.beginPath();
    ctx.arc(p.x*cw, p.y*ch, p.r, 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},80%,75%,${op})`;
    ctx.fill();
  });
  jRaf = requestAnimationFrame(animateJParticles);
}
animateJParticles();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(jRaf); jRaf = null; }
  else if (!jRaf) animateJParticles();
});

// ── Cinematic camera ──────────────────────────────────────────────────────────
const VB_FULL_J = `0 0 ${W} ${H}`;
const J_ZOOM    = 2.2;

function cinematicZoomJ(planet, animate = true) {
  const [px, py] = pxPy(planet, W, H, PAD);
  const vw = W / J_ZOOM, vh = H / J_ZOOM;
  const vx = Math.max(0, Math.min(W - vw, px - vw/2));
  const vy = Math.max(0, Math.min(H - vh, py - vh/2));
  const target = `${vx} ${vy} ${vw} ${vh}`;
  if (!animate) { journeysSvg.attr('viewBox', target); return; }
  const cur = (journeysSvg.attr('viewBox') || VB_FULL_J).split(' ').map(Number);
  journeysSvg.transition('jcam').duration(900).ease(d3.easeCubicInOut)
    .attrTween('viewBox', () => t => {
      const [cx, cy, cw, ch] = cur;
      return `${cx+(vx-cx)*t} ${cy+(vy-cy)*t} ${cw+(vw-cw)*t} ${ch+(vh-ch)*t}`;
    });
}

// ── Map tooltip ───────────────────────────────────────────────────────────────
const jTt = document.getElementById('tooltip');

function attachJTooltip(beat) {
  const pl = planetIndex[beat.planet];
  if (!pl) return;
  const [px, py] = pxPy(pl, W, H, PAD);
  jActiveG.append('circle')
    .attr('cx', px).attr('cy', py).attr('r', 22)
    .attr('fill', 'transparent')
    .style('cursor', 'crosshair')
    .on('mouseenter', function () {
      jTt.innerHTML = `
        <div class="tt-planet">${pl.name}</div>
        <div class="tt-region">${pl.region.toUpperCase()}</div>
        ${pl.geography ? `<div class="tt-row"><span class="tt-label">Geography</span><span class="tt-value">${pl.geography}</span></div>` : ''}
        <div class="tt-divider"></div>
        ${beat.beats.map(b =>
          `<div class="tt-beat-char" style="color:${CHAR_COLORS[b.char]||'var(--jedi)'}">${b.char}</div>
           <div class="tt-beat-desc">${b.beat}</div>`
        ).join('<div style="height:5px"></div>')}
      `;
      jTt.style.opacity = 1;
    })
    .on('mousemove', function (event) {
      const x = event.clientX, y = event.clientY;
      const ww = window.innerWidth, wh = window.innerHeight;
      jTt.style.left = (x + 20 + 320 > ww ? x - 336 : x + 20) + 'px';
      jTt.style.top  = (y + 10 + jTt.offsetHeight > wh ? y - jTt.offsetHeight - 10 : y + 10) + 'px';
    })
    .on('mouseleave', () => { jTt.style.opacity = 0; });
}

// ── Arc path builder (per-char offset keeps overlapping paths visually distinct)
// Returns { d, mpx, mpy, angle } — d is the SVG path, mpx/mpy is bezier midpoint, angle is tangent.
function makeJArcGeom(a, b, charOffset) {
  const [x1,y1] = pxPy(a,W,H,PAD), [x2,y2] = pxPy(b,W,H,PAD);
  const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1;
  const bend = 0.18 + (charOffset || 0) * 0.035;
  const cx = mx-dy*bend, cy = my+dx*bend;
  const mpx = 0.25*x1 + 0.5*cx + 0.25*x2;
  const mpy = 0.25*y1 + 0.5*cy + 0.25*y2;
  const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
  return { d: `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`, mpx, mpy, angle };
}
function makeJArcPath(a, b, charOffset) { return makeJArcGeom(a, b, charOffset).d; }

// ── Map render ────────────────────────────────────────────────────────────────
function renderJourneysMap(beatIdx, animate) {
  if (beatIdx === undefined) beatIdx = activeEpBeat;
  const beats    = EPISODE_BEATS[activeEp];
  if (!beats || !beats.length) return;
  const beat     = beats[beatIdx];
  const activePl = planetIndex[beat.planet];

  jPathG.selectAll('*').remove();
  jDotsG.selectAll('*').remove();
  jLabelsG.selectAll('*').remove();
  jActiveG.selectAll('*').remove();
  jTt.style.opacity = 0;

  const epPlanets = new Set(beats.map(b => b.planet));

  // ── All-planet background dots ──
  PLANETS.forEach(p => {
    const [px, py] = pxPy(p, W, H, PAD);
    const inEp  = epPlanets.has(p.name);
    const isAct = p.name === beat.planet;
    const pc    = PLANET_COLORS[p.name];
    const pg    = jDotsG.append('g').attr('transform', `translate(${px},${py})`);
    if (pc) {
      if (inEp) {
        pg.append('circle').attr('r', isAct ? 8 : 5).attr('fill', pc.glow)
          .attr('opacity', isAct ? 0.2 : 0.07).attr('filter','url(#jplanet-glow)');
        pg.append('circle').attr('r', isAct ? 5 : 3.5)
          .attr('fill', pc.core).attr('stroke', pc.glow).attr('stroke-width', 1)
          .attr('opacity', isAct ? 0.75 : 0.32);
      } else {
        pg.append('circle').attr('r', 2.5).attr('fill','#0a1428')
          .attr('stroke','#1a2a4a').attr('stroke-width',0.5).attr('opacity',0.18);
      }
    } else {
      pg.append('circle')
        .attr('r', inEp ? 3.5 : 2).attr('fill','#0a1428')
        .attr('stroke', inEp ? '#1a3060' : '#0a1428')
        .attr('stroke-width', 0.5).attr('opacity', inEp ? 0.3 : 0.12);
    }
  });

  // ── Per-character paths for this episode ──
  const beatCharSet = new Set(beat.chars);
  let charOffset = 0;
  let activeCharIdx = 0;

  function addMidArrow(mpx, mpy, angle, color, opacity, small) {
    const d = small ? 'M-3,-2 L4,0 L-3,2 Z' : 'M-5,-3 L6,0 L-5,3 Z';
    jPathG.append('path')
      .attr('d', d).attr('fill', color).attr('opacity', opacity)
      .attr('pointer-events', 'none')
      .attr('transform', `translate(${mpx},${mpy}) rotate(${angle})`);
  }

  function attachPathTooltip(el, charName, color, fromPlanet, toPlanet, beatText) {
    el.style('cursor', 'pointer')
      .on('mouseenter', function () {
        jTt.innerHTML = `
          <div class="tt-beat-char" style="color:${color}">${charName}</div>
          <div class="tt-row">
            <span class="tt-label">FROM</span>
            <span class="tt-value">${fromPlanet} → ${toPlanet}</span>
          </div>
          ${beatText ? `<div class="tt-divider"></div><div class="tt-beat-desc">${beatText}</div>` : ''}
        `;
        jTt.style.opacity = 1;
      })
      .on('mousemove', function (event) {
        const x = event.clientX, y = event.clientY;
        const ww = window.innerWidth, wh = window.innerHeight;
        jTt.style.left = (x + 20 + 320 > ww ? x - 336 : x + 20) + 'px';
        jTt.style.top  = (y + 10 + jTt.offsetHeight > wh ? y - jTt.offsetHeight - 10 : y + 10) + 'px';
      })
      .on('mouseleave', () => { jTt.style.opacity = 0; });
  }

  CHAR_LIST.forEach(charName => {
    const epBeats = (JOURNEYS[charName] || []).filter(b => b.ep === activeEp);
    if (epBeats.length < 2) { charOffset++; return; }
    const color = CHAR_COLORS[charName];
    const isActive = beatCharSet.has(charName);
    const delay = (animate && isActive) ? activeCharIdx * 55 : 0;
    if (isActive) activeCharIdx++;

    for (let i = 0; i < epBeats.length - 1; i++) {
      const a = planetIndex[epBeats[i].planet];
      const b = planetIndex[epBeats[i+1].planet];
      if (!a || !b || a.name === b.name) continue;

      const fromPlanet = epBeats[i].planet;
      const toPlanet   = epBeats[i+1].planet;
      if (fromPlanet !== beat.planet && toPlanet !== beat.planet) continue;
      const geom = makeJArcGeom(a, b, charOffset);
      const beatText   = epBeats[i+1].beat || '';

      // Visible path
      const pathEl = jPathG.append('path')
        .attr('d', geom.d).attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', isActive ? 2 : 0.8)
        .attr('opacity', isActive ? (animate ? 0.8 : 0.6) : 0.18)
        .attr('pointer-events', 'none');

      // Wide transparent hit area for tooltip
      const hitEl = jPathG.append('path')
        .attr('d', geom.d).attr('fill', 'none')
        .attr('stroke', 'transparent').attr('stroke-width', 12);
      attachPathTooltip(hitEl, charName, color, fromPlanet, toPlanet, beatText);

      if (isActive && animate) {
        const len = pathEl.node().getTotalLength();
        pathEl.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
          .transition().delay(delay).duration(700).ease(d3.easeQuadOut)
          .attr('stroke-dashoffset', 0)
          .on('end', () => addMidArrow(geom.mpx, geom.mpy, geom.angle, color, 0.85, false));
      } else if (isActive) {
        addMidArrow(geom.mpx, geom.mpy, geom.angle, color, 0.7, false);
      } else {
        pathEl.attr('stroke-dasharray', '2,6');
        addMidArrow(geom.mpx, geom.mpy, geom.angle, color, 0.18, true);
      }
    }
    charOffset++;
  });

  // ── Beat-number markers + labels for episode planets ──
  beats.forEach((b, i) => {
    const pl = planetIndex[b.planet]; if (!pl) return;
    const [px, py] = pxPy(pl, W, H, PAD);
    const isAct = b.planet === beat.planet;
    const r     = isAct ? 10 : Math.min(5 + b.chars.length * 0.6, 9);
    const color = isAct ? '#f5c842' : '#4a9eff';

    jDotsG.append('circle').attr('cx',px).attr('cy',py).attr('r',r)
      .attr('fill', isAct ? color : 'none')
      .attr('stroke', color).attr('stroke-width', isAct ? 2 : 1.5)
      .attr('opacity', isAct ? 0.95 : 0.6)
      .attr('filter', isAct ? 'url(#jglow)' : null);
    jDotsG.append('text').attr('x',px).attr('y',py)
      .attr('text-anchor','middle').attr('dominant-baseline','middle')
      .attr('font-family','Share Tech Mono, monospace').attr('font-size','9px')
      .attr('fill', isAct ? '#000' : color).attr('opacity', isAct ? 1 : 0.85)
      .text(i + 1);

    if (isAct) {
      jActiveG.append('circle').attr('class','jpulse-ring')
        .attr('cx',px).attr('cy',py).attr('r',r)
        .attr('fill','none').attr('stroke',color)
        .attr('stroke-width',2).attr('opacity',0);
    }

    // Label — shift left for right-edge planets, right otherwise
    const lx     = pl.x > 70 ? px - 13 : px + 14;
    const anchor = pl.x > 70 ? 'end' : 'start';
    const fs     = isAct ? '12px' : '10px';
    const fc     = isAct ? '#f5c842' : (PLANET_COLORS[pl.name]?.glow || '#7ab8ff');

    // Shadow stroke for legibility over overlapping arcs
    jLabelsG.append('text').attr('x',lx).attr('y',py+4)
      .attr('text-anchor',anchor)
      .attr('font-family','Share Tech Mono, monospace').attr('font-size',fs)
      .attr('fill','#000').attr('opacity',.85)
      .attr('stroke','#000').attr('stroke-width',3).attr('paint-order','stroke')
      .text(pl.name);
    jLabelsG.append('text').attr('x',lx).attr('y',py+4)
      .attr('text-anchor',anchor)
      .attr('font-family','Share Tech Mono, monospace').attr('font-size',fs)
      .attr('fill',fc).attr('opacity', isAct ? 1 : 0.7)
      .text(pl.name);
  });

  // Tooltip hit-area + cinematic zoom on active planet
  if (activePl) {
    attachJTooltip(beat);
    cinematicZoomJ(activePl, animate);
  }
}

// ── Scroll hint ───────────────────────────────────────────────────────────────
function updateJourneysBeatHint() {
  const hint = document.getElementById('journeys-beat-hint');
  if (!hint) return;
  const beats  = EPISODE_BEATS[activeEp];
  const isLast = activeEpBeat === beats.length - 1;
  if (activeEp === 'IX' && isLast) {
    hint.textContent = 'The saga is complete — click ↓ to explore insights...';
  } else if (isLast) {
    const nextEp = EP_LIST[EP_LIST.indexOf(activeEp) + 1];
    hint.textContent = `Scroll down to continue with Episode ${nextEp}...`;
  } else {
    hint.textContent = 'Scroll up/down to navigate through the episode...';
  }
}

// ── Episode selector ──────────────────────────────────────────────────────────
function buildEpSelector() {
  const container = document.getElementById('ep-selector');
  container.innerHTML = '';
  EP_ROWS.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'char-row';
    row.forEach(ep => {
      const btn = document.createElement('button');
      btn.className   = 'char-btn' + (ep === activeEp ? ' active' : '');
      btn.textContent = ep;
      btn.setAttribute('aria-label',   `Episode ${ep} — ${EPISODE_DATA[ep].title}`);
      btn.setAttribute('aria-pressed', ep === activeEp ? 'true' : 'false');
      btn.onclick = () => jumpToEpisode(ep);
      rowDiv.appendChild(btn);
    });
    container.appendChild(rowDiv);
  });
}

// ── Track position / heights ──────────────────────────────────────────────────
function updateJourneysTrackPosition(animate = true) {
  const beatArea = document.getElementById('journeys-beat-area');
  const track    = document.getElementById('journeys-track');
  if (!beatArea || !track) return;
  const h = beatArea.clientHeight;
  Array.from(track.children).forEach(el => { el.style.height = h + 'px'; });
  track.style.transition = animate ? 'transform .45s cubic-bezier(.4,0,.2,1)' : 'none';
  track.style.transform  = `translateY(${-activeEpBeat * h}px)`;
}

// ── Active-beat highlight update (no DOM rebuild) ─────────────────────────────
function updateJourneysPanelActive() {
  const track = document.getElementById('journeys-track');
  if (!track) return;
  Array.from(track.children).forEach((el, j) => {
    el.classList.toggle('active', j === activeEpBeat);
    el.setAttribute('aria-current', j === activeEpBeat ? 'true' : 'false');
  });
  updateJourneysTrackPosition(true);
  updateJourneysBeatHint();
}

// ── Story panel render ────────────────────────────────────────────────────────
function renderJourneysPanel() {
  const beatArea = document.getElementById('journeys-beat-area');
  const oldTrack = beatArea.querySelector('#journeys-track');
  if (oldTrack) oldTrack.remove();

  const beats  = EPISODE_BEATS[activeEp];
  const epData = EPISODE_DATA[activeEp];

  const track = document.createElement('div');
  track.id        = 'journeys-track';
  track.className = 'story-track';

  beats.forEach((b, i) => {
    const isFirst = i === 0;
    const isLast  = i === beats.length - 1;

    const div = document.createElement('div');
    div.className = 'story-beat' + (i === activeEpBeat ? ' active' : '');
    div.setAttribute('role',        'listitem');
    div.setAttribute('aria-current', i === activeEpBeat ? 'true' : 'false');
    div.setAttribute('aria-label',   `${b.planet}: ${b.chars.join(', ')}`);

    // CSS art for background (visible while image loads or on error)
    const synth = { planet: b.planet, beat: b.beats.map(x => x.beat).join(' ') };
    const artBg = getSceneArt(synth);

    // Coloured character names
    const charsHtml = b.chars
      .map(c => `<span style="color:${CHAR_COLORS[c]||'var(--jedi)'}">${c}</span>`)
      .join(`<span style="color:var(--muted)"> · </span>`);

    // Desc: synopsis if available, otherwise per-character beat lines
    const synopsis = EPISODE_SYNOPSES[`${activeEp}:${b.planet}`];
    const descHtml = synopsis
      ? synopsis
      : b.beats
          .map(entry =>
            `<span class="jbeat-char" style="color:${CHAR_COLORS[entry.char]||'var(--jedi)'}">${entry.char}</span> — ${entry.beat}`
          )
          .join('<br>');

    div.innerHTML = `
      <div class="beat-image-bg" style="background:${artBg}">
        <img class="beat-img" src="${epData.img}" alt="Episode ${activeEp}" loading="lazy" onerror="this.style.opacity=0">
        <div class="beat-image-label">${epData.title.toUpperCase()}</div>
      </div>
      <div class="beat-body">
        <div class="beat-header">
          <div class="beat-ep">EPISODE ${activeEp} · BEAT ${i + 1} OF ${beats.length}</div>
          ${isFirst ? '<div class="beat-pill beat-pill-start">START</div>' : ''}
          ${isLast  ? '<div class="beat-pill beat-pill-end">END</div>'    : ''}
        </div>
        <div class="beat-planet">${b.planet}</div>
        <div class="beat-chars">${charsHtml}</div>
        <div class="beat-desc">${descHtml}</div>
      </div>
    `;

    // Click on a beat card to jump directly to it
    div.onclick = () => {
      if (i === activeEpBeat) return;
      const prev   = activeEpBeat;
      activeEpBeat = i;
      const shouldAnimate = beats[i].planet !== beats[prev].planet;
      updateJourneysPanelActive();
      renderJourneysMap(i, shouldAnimate);
    };
    track.appendChild(div);
  });

  beatArea.appendChild(track);

  // Single resize observer — disconnect old one first to avoid stacking
  if (jResizeObserver) jResizeObserver.disconnect();
  jResizeObserver = new ResizeObserver(() => updateJourneysTrackPosition(false));
  jResizeObserver.observe(beatArea);

  updateJourneysTrackPosition(false);
  updateJourneysBeatHint();
}

// ── Episode jump ──────────────────────────────────────────────────────────────
function jumpToEpisode(ep) {
  if (ep === activeEp) return;
  activeEp     = ep;
  activeEpBeat = 0;
  document.querySelectorAll('#ep-selector .char-btn').forEach(btn => {
    const on = btn.textContent === ep;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  // Keep mobile dropdown in sync
  const mSel = document.getElementById('ep-mobile-select');
  if (mSel) mSel.value = ep;
  renderJourneysPanel();
  renderJourneysMap(0, true);
}

// ── Navigation helper ─────────────────────────────────────────────────────────
// Called when scrolling past an episode boundary.
// dir > 0: advance (last beat → next episode beat 0, or Dashboard from IX)
// dir < 0: retreat (first beat → prev episode last beat, or Follow from I)
function jCrossBoundary(dir) {
  const epIdx = EP_LIST.indexOf(activeEp);
  if (dir > 0) {
    if (epIdx < EP_LIST.length - 1) {
      // Move to first beat of next episode
      jumpToEpisode(EP_LIST[epIdx + 1]);
    } else {
      // Episode IX last beat → Dashboard
      document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    if (epIdx > 0) {
      // Move to last beat of previous episode
      const prevEp    = EP_LIST[epIdx - 1];
      const lastBeat  = EPISODE_BEATS[prevEp].length - 1;
      activeEp        = prevEp;
      activeEpBeat    = lastBeat;
      document.querySelectorAll('#ep-selector .char-btn').forEach(btn => {
        const on = btn.textContent === prevEp;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      renderJourneysPanel();
      renderJourneysMap(lastBeat, true);
    } else {
      // Episode I first beat → Follow
      document.getElementById('follow').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// ── Wheel + touch + keyboard input ───────────────────────────────────────────
document.getElementById('journeys').addEventListener('wheel', function (e) {
  e.preventDefault();
  if (jScrollLock) return;

  const beats = EPISODE_BEATS[activeEp];
  const dir   = e.deltaY > 0 ? 1 : -1;
  const next  = activeEpBeat + dir;

  if (next >= 0 && next < beats.length) {
    const prev      = activeEpBeat;
    activeEpBeat    = next;
    const shouldAni = beats[next].planet !== beats[prev].planet;
    updateJourneysPanelActive();
    renderJourneysMap(next, shouldAni);
    jScrollLock = true;
    setTimeout(() => { jScrollLock = false; }, dir > 0 ? 650 : 380);
  } else {
    const epIdx = EP_LIST.indexOf(activeEp);
    if ((dir > 0 && epIdx < EP_LIST.length - 1) ||
        (dir < 0 && epIdx > 0)) {
      jCrossBoundary(dir);
    }
    // At section boundary: do nothing — use nav buttons
  }
}, { passive: false });

let jTouchY = 0;
journeysSection.addEventListener('touchstart',
  e => { jTouchY = e.touches[0].clientY; }, { passive: true });
journeysSection.addEventListener('touchend', e => {
  const dy = jTouchY - e.changedTouches[0].clientY;
  if (Math.abs(dy) < 40) return;
  const beats = EPISODE_BEATS[activeEp];
  const dir   = dy > 0 ? 1 : -1;
  const next  = activeEpBeat + dir;
  if (next >= 0 && next < beats.length) {
    const prev      = activeEpBeat;
    activeEpBeat    = next;
    const shouldAni = beats[next].planet !== beats[prev].planet;
    updateJourneysPanelActive();
    renderJourneysMap(next, shouldAni);
  } else {
    jCrossBoundary(dir);
  }
}, { passive: true });

document.getElementById('journeys-beat-area').addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    const beats = EPISODE_BEATS[activeEp];
    if (activeEpBeat < beats.length - 1) {
      const prev = activeEpBeat++;
      updateJourneysPanelActive();
      renderJourneysMap(activeEpBeat, beats[activeEpBeat].planet !== beats[prev].planet);
    }
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    if (activeEpBeat > 0) {
      activeEpBeat--;
      updateJourneysPanelActive();
      renderJourneysMap(activeEpBeat, false);
    }
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
buildEpSelector();

// Create scroll hint once — survives episode switches (only track is rebuilt)
const jHintEl = document.createElement('div');
jHintEl.id = 'journeys-beat-hint';
document.getElementById('journeys-beat-area').appendChild(jHintEl);

renderJourneysPanel();
renderJourneysMap(0, false);

// ── Mobile: dropdown selector + expand/collapse map ───────────────────────────
if (window.innerWidth <= 768) {
  // Episode dropdown — injected before the beat area inside the story panel
  const epWrap = document.createElement('div');
  epWrap.className = 'mobile-selector-wrap';
  const epSel = document.createElement('select');
  epSel.id = 'ep-mobile-select';
  epSel.className = 'mobile-select';
  epSel.setAttribute('aria-label', 'Select an episode');
  EP_LIST.forEach(ep => {
    const opt = document.createElement('option');
    opt.value = ep;
    opt.textContent = `Episode ${ep} — ${EPISODE_DATA[ep].title}`;
    if (ep === activeEp) opt.selected = true;
    epSel.appendChild(opt);
  });
  epSel.addEventListener('change', () => jumpToEpisode(epSel.value));
  epWrap.appendChild(epSel);
  const jBeatArea = document.getElementById('journeys-beat-area');
  jBeatArea.parentNode.insertBefore(epWrap, jBeatArea);

  // Expand/collapse map
  const journeysMapWrap = document.getElementById('journeys-map-wrap');
  const journeysExpandBtn = document.createElement('button');
  journeysExpandBtn.className = 'map-expand-btn';
  journeysExpandBtn.textContent = 'EXPAND MAP';
  journeysExpandBtn.addEventListener('click', () => {
    const expanded = journeysMapWrap.classList.toggle('map-expanded');
    journeysExpandBtn.textContent = expanded ? '✕ CLOSE' : 'EXPAND MAP';
  });
  journeysMapWrap.appendChild(journeysExpandBtn);
}
