import { IQuizQuestion } from '../models/Course';

/**
 * 50 Comprehensive Assignment Questions for Programming in Kinyarwanda
 */
export const JS_ASSIGNMENT_50: IQuizQuestion[] = [
  {
    question: "Ni irihe jambo rikoreshwa mu gutangiza variable idahinduka muri JavaScript (immutable)?",
    options: ["let", "const", "var", "immutable"],
    correctIndex: 1,
    explanation: "'const' ikoreshwa iyo agaciro ka variable katazigera gahindurwa nyuma yo gutangizwa."
  },
  {
    question: "Muri JavaScript, 'typeof null' igarura iki?",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correctIndex: 2,
    explanation: "Iki ni ikosa ry'amateka (legacy bug) muri JavaScript aho 'typeof null' igarura 'object'."
  },
  {
    question: "Ni irihe tandukaniro riri hagati ya '==' na '==='?",
    options: [
      "'==' igorora amoko y'amakuru (type coercion), naho '===' ireba niba n'ubwoko buhuye",
      "'===' ikoreshwa gusa ku mibare",
      "'==' ikora vuba kurusha '==='",
      "Nta tandukaniro na rimwe ririmo"
    ],
    correctIndex: 0,
    explanation: "'===' (strict equality) ntabwo ikora coercion, ireba value n'ubwoko (type)."
  },
  {
    question: "Iyo wanditse: console.log(0.1 + 0.2 === 0.3), hasohoka iki?",
    options: ["true", "false", "undefined", "NaN"],
    correctIndex: 1,
    explanation: "Muri IEEE 754 floating point arithmetic, 0.1 + 0.2 biba 0.30000000000000004, bityo bingana na false."
  },
  {
    question: "Ni ubuhe buryo bwiza bwo gukora loop ku bintu biri muri Array?",
    options: ["for...in", "array.forEach() cyangwa for...of", "while(true)", "goto"],
    correctIndex: 1,
    explanation: "'for...of' cyangwa 'forEach' bikoreshwa ku bintu bigize Array (iterable)."
  },
  {
    question: "Function yanditse gutya: const func = () => {}, yitwa iki?",
    options: ["Regular function", "Arrow function", "Generator function", "Constructor function"],
    correctIndex: 1,
    explanation: "Ikoreshwa ry'ikimenyetso '=>' ryitwa Arrow Function ryazanywe muri ES6."
  },
  {
    question: "Ni iyihe method ya Array ikoreshwa mu gushungura (gukuramo) ibintu bitujuje ibisabwa?",
    options: ["map()", "filter()", "reduce()", "find()"],
    correctIndex: 1,
    explanation: "'filter()' igarura Array nshya igizwe gusa n'ibintu byatanze 'true' ku kizamini cyatanzwe."
  },
  {
    question: "Method 'map()' ikora iki kuri Array?",
    options: [
      "Gusiba Array",
      "Guhindura buri kintu ikagiha isura nshya no kugarura Array nshya",
      "Gushakisha umubare gusa",
      "Gufunga porogaramu"
    ],
    correctIndex: 1,
    explanation: "'map()' ikora iteration kuri buri kintu ikagarura Array nshya y'ibisubizo."
  },
  {
    question: "Iyo uhamagaye function mbere y'uko yandikwa (function declaration), kuki ikora?",
    options: ["Kuberako mudasobwa ifite umuvuduko munini", "Kubera Hoisting muri JavaScript", "Kubera internet", "Ntabwo ishobora gukora na rimwe"],
    correctIndex: 1,
    explanation: "Hoisting izamura function declarations hejuru mu gihe cya compile phase."
  },
  {
    question: "NaN (Not-a-Number) ifite ubwoko ki muri 'typeof'?",
    options: ["'nan'", "'undefined'", "'number'", "'string'"],
    correctIndex: 2,
    explanation: "Nubwo NaN isobanura 'Not-a-Number', ubwoko bwayo mu buryo bw'ikoranabuhanga ni 'number'."
  },
  {
    question: "Method 'push()' ikora iki kuri Array?",
    options: ["Ikuraho ikintu cya nyuma", "Yongeramo ikintu mu mpera za Array", "Yongeramo ikintu mu ntangiriro", "Ihindura amagambo inyuguti nkuru"],
    correctIndex: 1,
    explanation: "'push()' yongeramo ikintu kimwe cyangwa byinshi ku musozo w'Array."
  },
  {
    question: "Method 'pop()' ikora iki kuri Array?",
    options: ["Ikuraho ikintu cya mbere", "Ikuraho ikintu cya nyuma muri Array", "Ishyiraho umutwe mushya", "Isiba Array yose"],
    correctIndex: 1,
    explanation: "'pop()' ikuraho element ya nyuma muri Array kandi ikayigarura."
  },
  {
    question: "Ni irihe jambo rikoreshwa mu gufata amakosa (error handling) muri JavaScript?",
    options: ["if / else", "try / catch / finally", "check / verify", "stop / resume"],
    correctIndex: 1,
    explanation: "'try...catch' block ikoreshwa mu gufata exceptions no kuzikemura neza."
  },
  {
    question: "JSON ihagarariye iki mu magambo arambuye?",
    options: ["JavaScript Object Notation", "Java System Online Network", "JavaScript Open Node", "Junior System Operation Note"],
    correctIndex: 0,
    explanation: "JSON isobanura JavaScript Object Notation, ikoreshwa cyane mu guhanahana amakuru."
  },
  {
    question: "Ni iyihe method ikoreshwa mu guhindura JavaScript Object mo string ya JSON?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.encode()"],
    correctIndex: 1,
    explanation: "JSON.stringify() ihindura object cyangwa value mo JSON formatted string."
  },
  {
    question: "Ni iyihe method ikoreshwa mu guhindura JSON string ikavamo JavaScript Object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.decode()"],
    correctIndex: 0,
    explanation: "JSON.parse() isoma JSON string ikayibyazamo object nyayo."
  },
  {
    question: "Iyo ukoze: [1, 2, 3] + [4, 5, 6] muri JavaScript, hasohoka iki?",
    options: ["[1, 2, 3, 4, 5, 6]", "'1,2,34,5,6'", "NaN", "Error"],
    correctIndex: 1,
    explanation: "JavaScript ihindura zombi mo strings ikaziteranya (string concatenation)."
  },
  {
    question: "Muri JavaScript, 'closure' ni iki?",
    options: [
      "Gufunga idirishya rya browser",
      "Ubushobozi bwa function bwo kwibuka scope y'aho yaremewe nubwo yahamagarirwa ahandi",
      "Kwatsa mudasobwa",
      "Gusiba cookies"
    ],
    correctIndex: 1,
    explanation: "Closure ni ubufatanye bwa function n'ikirere cy'amakuru (lexical environment) yaremewemo."
  },
  {
    question: "Promise muri JavaScript igira iyihe mitekerereze (states)?",
    options: [
      "start, run, stop",
      "pending, fulfilled, rejected",
      "loading, complete, cancel",
      "init, execute, terminate"
    ],
    correctIndex: 1,
    explanation: "Promise igira states 3 z'ingenzi: pending, fulfilled (yatsinze), na rejected (yanze)."
  },
  {
    question: "Ni ayahe magambo akoreshwa mu gutegereza Promise mu buryo busomeka neza?",
    options: ["wait / continue", "async / await", "pause / resume", "hold / release"],
    correctIndex: 1,
    explanation: "'async / await' yongera uburyo bworoshye bwo gukorana na Promises mu buryo bw'asynchronous."
  },
  {
    question: "Ikimenyetso cy'ubugororzi (Spread Operator) kigaragazwa gute?",
    options: ["...", ":::", "&&&", "###"],
    correctIndex: 0,
    explanation: "Amanota atatu (...) ni spread operator ikoreshwa mu gukwirakwiza ibintu by'array cyangwa object."
  },
  {
    question: "Iyo ukoze 'const obj2 = { ...obj1 }', hakorwa iki?",
    options: ["Deep clone", "Shallow clone", "Gusiba obj1", "Reference pointer gusa"],
    correctIndex: 1,
    explanation: "Spread operator ikora shallow clone (ibikubiye imbere by'ibindi bintu by'imbitse bikomeza kuba bya bindi)."
  },
  {
    question: "Ni ikihe cyitwa 'Falsy value' muri ibi bikurikira?",
    options: ["1", "'Rwanda'", "0", "[]"],
    correctIndex: 2,
    explanation: "0, '', null, undefined, NaN, na false ni Falsy values muri JavaScript. Empty array [] ni truthy!"
  },
  {
    question: "Ikimenyetso '??' (Nullish Coalescing) gitandukaniye he na '||'?",
    options: [
      "'??' ireba gusa null na undefined, naho '||' ireba falsy values zose harimo 0 na ''",
      "'??' ikoreshwa ku mibare gusa",
      "'||' ntabwo yemewe muri ES6",
      "Bikora kimwe nta tandukaniro"
    ],
    correctIndex: 0,
    explanation: "Nullish coalescing (??) ifata default value gusa iyo ikintu ari null cyangwa undefined (nka 0 irareka igasohoka)."
  },
  {
    question: "Ni iyihe function ikoreshwa mu gushyiraho igihe (timer) cyo gutinda gukora igikorwa?",
    options: ["wait()", "setTimeout()", "delay()", "sleep()"],
    correctIndex: 1,
    explanation: "setTimeout() itegereza milliseconds zagenwe ikabona guhamagara callback function."
  },
  {
    question: "Ni iyihe function ikoreshwa mu gusubiramo igikorwa mu bihe bihoraho?",
    options: ["repeat()", "setInterval()", "loopTimer()", "periodic()"],
    correctIndex: 1,
    explanation: "setInterval() ikora igikorwa buri gihe iyo interval irangiye kugeza ihagaritswe na clearInterval()."
  },
  {
    question: "DOM ihagarariye iki mu ikoranabuhanga rya Web?",
    options: ["Document Object Model", "Data Open Management", "Digital Online Machine", "Desktop Operation Mode"],
    correctIndex: 0,
    explanation: "DOM isobanura Document Object Model, ikaba ari imiterere y'urubuga rwa HTML muri mudasobwa."
  },
  {
    question: "Method 'document.getElementById()' ikora iki?",
    options: [
      "Ishaka element ifite ID yagenwe mu rupapuro rwa HTML",
      "Ishaka amafoto yose",
      "Ishyiraho umubare w'ibanga",
      "Ihindura URL ya browser"
    ],
    correctIndex: 0,
    explanation: "getElementById() igarura element imwe ifite id yagenwe."
  },
  {
    question: "Event 'addEventListener' imara iki?",
    options: [
      "Gutega amatwi no gufata ibikorwa by'umukoresha (clicks, keypress, submit)",
      "Kongera amajwi mu mashini",
      "Gusiba code itari nziza",
      "Kwandika igitabo"
    ],
    correctIndex: 0,
    explanation: "Ituma element yishyirirwaho listener ikora igikorwa iyo event yabaye."
  },
  {
    question: "Event y'ibanze ikoreshwa iyo umuntu akanze button ni iyihe?",
    options: ["hover", "press", "click", "tap"],
    correctIndex: 2,
    explanation: "'click' event ifatwa iyo umukoresha akanze kuri element."
  },
  {
    question: "Muri JavaScript, ikintu 'localStorage' kibika amakuru kugeza ryari?",
    options: [
      "Kugeza igihe umukoresha asibiye browser cache/data cyangwa code ikabikora",
      "Kugeza idirishya rifunzwe",
      "Iminota 10 gusa",
      "Kugeza mudasobwa izimye"
    ],
    correctIndex: 0,
    explanation: "localStorage ntabwo irangira (no expiration) bitandukanye na sessionStorage."
  },
  {
    question: "Muri JavaScript, 'sessionStorage' ibika amakuru igihe kingana iki?",
    options: [
      "Burundu",
      "Mu gihe icyo gice cy'idirishya (tab / window) kigifunguye",
      "Imyaka ibiri",
      "Amasegonda 5"
    ],
    correctIndex: 1,
    explanation: "sessionStorage ifutwa iyo tab y'urubuga ifunzwe."
  },
  {
    question: "Destructuring assignment ikora iki muri iyi code: const { izina, imyaka } = umunyeshuri;?",
    options: [
      "Ikuramo properties 'izina' na 'imyaka' ikazigira variables ziteguye",
      "Isiba properties zose",
      "Yongeramo properties nshya",
      "Ihagarika umunyeshuri"
    ],
    correctIndex: 0,
    explanation: "Destructuring igufasha gukura properties muri object ukora variables zoroheje."
  },
  {
    question: "Iyo ukoze: Array.isArray({}) hasohoka iki?",
    options: ["true", "false", "undefined", "object"],
    correctIndex: 1,
    explanation: "{} ni plain object, bityo Array.isArray({}) igarura false."
  },
  {
    question: "Ijambo 'this' muri JavaScript ryerekana iki?",
    options: [
      "Icyerekezo cy'aho function irimo gukorera (context / execution owner)",
      "Izina rya mudasobwa",
      "Ubutumwa bwa nyuma bwanditswe",
      "Urupapuro rwa HTML ruri gukurikira"
    ],
    correctIndex: 0,
    explanation: "'this' yerekeza ku context cyangwa object ifite cyangwa iri gukoresha iyo function."
  },
  {
    question: "Ni irihe tandukaniro riri hagati ya arrow function na regular function ku bijyanye na 'this'?",
    options: [
      "Arrow functions ntizigira 'this' yazo bwite, zizungura iy'aho zaremewe (lexical this)",
      "Arrow functions ntabwo zemewe gukoreshwa muri React",
      "Regular function ntabwo yakira parameters",
      "Nta tandukaniro ririmo na rito"
    ],
    correctIndex: 0,
    explanation: "Arrow functions zizungura 'this' y'aho zakorewe (lexical scoping)."
  },
  {
    question: "Method 'Array.prototype.reduce()' ikora iki?",
    options: [
      "Gusubiza array mo agaciro kamwe (single value) binyuze mu gukusanya ibirimo",
      "Kugabanya umubare w'amagambo mu buryo butari bwo",
      "Gusiba ibice bya mbere",
      "Kwandika code nshya"
    ],
    correctIndex: 0,
    explanation: "'reduce()' ikoresha accumulator function igatuma array yose ikorwamo umusaruro umwe."
  },
  {
    question: "Ni iyihe function ikoreshwa mu guhindura String y'umubare ikavamo Integer nyayo?",
    options: ["parseInt()", "toString()", "toNumber()", "makeInt()"],
    correctIndex: 0,
    explanation: "parseInt(str, radix) isoma string igakuramo integer."
  },
  {
    question: "Kuki ari byiza gushyiraho 'use strict' hejuru muri file ya JavaScript?",
    options: [
      "Kugira ngo igufashe kwirinda amakosa y'akarengayobora no kubuza variables zidakozwe",
      "Kugira ngo interineti yihute",
      "Kugira ngo amabara ahinduke umukara",
      "Kugira ngo mudasobwa itazima"
    ],
    correctIndex: 0,
    explanation: "'strict mode' ifata amakosa anyuranye nko gukoresha variable itaratangijwe."
  },
  {
    question: "Muri Git na GitHub, command ikoreshwa mu kohereza ibyakozwe ku rubuga ni iyihe?",
    options: ["git push", "git pull", "git download", "git delete"],
    correctIndex: 0,
    explanation: "'git push' yohereza commits ku remote repository nka GitHub."
  },
  {
    question: "Method 'String.prototype.includes()' igarura iki?",
    options: ["Boolean (true cyangwa false)", "Umubare w'amagambo", "Array y'inyuguti", "Ijambo ry'igikurikira"],
    correctIndex: 0,
    explanation: "includes() igarura true niba string ibonetsemo, cyangwa false bitaba ibyo."
  },
  {
    question: "Set muri JavaScript itandukaniye he na Array?",
    options: [
      "Set ntiyemera ibintu byikubye (duplicates), igira unique values gusa",
      "Set ntabwo ibika imibare",
      "Array ntiyemera strings",
      "Set ikora gusa muri CSS"
    ],
    correctIndex: 0,
    explanation: "Set ni collection ifite gusa unique values; ntiyemerera ibintu bisa kabiri."
  },
  {
    question: "Map muri JavaScript itandukaniye he na plain Object {}?",
    options: [
      "Map yemera keys z'ubwoko bwose (harimo objects na functions), kandi igumana sequence",
      "Map ntabwo ibika amakuru",
      "Object ntiyemera strings",
      "Map ikora gusa iyo ufite interineti"
    ],
    correctIndex: 0,
    explanation: "Map keys zishobora kuba ubwoko ubwo ari bwo bwose kandi yibuka order yo kwinjira."
  },
  {
    question: "Event bubbling muri DOM isobanura iki?",
    options: [
      "Event itangirira kuri target element ikazamuka mu babyeyi (parents) kugeza kuri document",
      "Gucana amashanyarazi",
      "Kuzimya amakuru",
      "Gusiba buttons zose"
    ],
    correctIndex: 0,
    explanation: "Bubbling ituma event izamuka hejuru mu mitwe y'ibiti bya DOM (ancestors)."
  },
  {
    question: "Method 'event.preventDefault()' ikora iki?",
    options: [
      "Ibuza imyitwarire isanzwe ya browser (urugero: kureka reload ya form iyo yoherejwe)",
      "Ikanika mudasobwa",
      "Isiba interineti",
      "Yohereza email ako kanya"
    ],
    correctIndex: 0,
    explanation: "preventDefault() ihagarika default behavior (nk'urugero form submission reload cyangwa link navigation)."
  },
  {
    question: "Muri JavaScript, Rest parameter igaragazwa gute mu miterere ya function?",
    options: ["function test(...args) {}", "function test(args...) {}", "function test(&args) {}", "function test($args) {}"],
    correctIndex: 0,
    explanation: "Rest syntax (...args) ikusanya arguments zose zitarondowe zikajya muri array imwe."
  },
  {
    question: "Iyo uhamagaye: Math.floor(4.9) hasohoka iki?",
    options: ["4", "5", "4.9", "0"],
    correctIndex: 0,
    explanation: "Math.floor() imanura umubare ku integer yo hasi iruta izindi (rounding down)."
  },
  {
    question: "Iyo uhamagaye: Math.ceil(4.1) hasohoka iki?",
    options: ["4", "5", "4.1", "0"],
    correctIndex: 1,
    explanation: "Math.ceil() izamura umubare ku integer yo hejuru (rounding up)."
  },
  {
    question: "Method 'Object.keys(obj)' igarura iki?",
    options: [
      "Array y'amazina ya properties (keys) ziri muri object",
      "Array y'agaciro (values) ziri muri object",
      "Umubare wa RAM yakoreshejwe",
      "Ijambobanga ry'umukoresha"
    ],
    correctIndex: 0,
    explanation: "Object.keys() igarura array y'amazina ya keys zose zigize iyo object."
  },
  {
    question: "Kubera iki gukoresha TypeScript hejuru ya JavaScript birushaho gukomeza umutekano w'akazi?",
    options: [
      "Kubera ko itanga Static Type Checking igafata amakosa mbere yo gukora (compile time)",
      "Kubera ko ituma interineti idacika",
      "Kubera ko ituma mudasobwa idashyuha",
      "Kubera ko ariyo gusa yemewe mu Rwanda"
    ],
    correctIndex: 0,
    explanation: "TypeScript yongeraho static types, auto-complete ikomeye, no gufata bugs mbere yo kurunner code."
  }
];

/**
 * 20 HARDEST / EXPERT-LEVEL Certification Exam Questions
 * High-difficulty deep questions covering memory, concurrency, event loop, security, and algorithms.
 */
export const JS_EXAM_HARDEST_20: IQuizQuestion[] = [
  {
    question: "Muri JavaScript Event Loop, ni uruhe rutonde nyarwo rw'imikorere (execution order) kuri iyi code?\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
    options: ["1, 4, 3, 2", "1, 2, 3, 4", "1, 4, 2, 3", "3, 1, 4, 2"],
    correctIndex: 0,
    explanation: "Synchronous code (1, 4) ikora mbere. Microtask queue (Promise 3) ikorwa mbere ya Macrotask queue (setTimeout 2). Bityo ni 1, 4, 3, 2."
  },
  {
    question: "Ni ayahe makosa azwi nka 'Memory Leak' ashobora kubaho muri JavaScript niyo haba hari Garbage Collector?",
    options: [
      "Detached DOM trees, uncleared setInterval() callbacks, na global variable closures zidafungwa",
      "Kwandika code irenze imirongo 100",
      "Gukoresha let aho gukoresha const",
      "Gucomeka mudasobwa ku muriro mwinshi"
    ],
    correctIndex: 0,
    explanation: "Iyo callback ifite reference ku bibintu byasibwe mu rupapuro cyangwa setInterval idahagaritswe, GC ntishobora kubisiba."
  },
  {
    question: "Muri Prototypal Inheritance, iyo ushatse property kuri object itayifite, bibaho bite?",
    options: [
      "JavaScript izamuka muri Prototype Chain kugeza igeze kuri Object.prototype kugeza kuri null",
      "Browser ihita ifunga ako kanya",
      "Igarura NaN ako kanya nta kintu irebye",
      "Ihindura izina ry'iyo object"
    ],
    correctIndex: 0,
    explanation: "Prototype lookup izamuka muri [[Prototype]] chain kugeza kuri Object.prototype; ntiyibona ikagarura null / undefined."
  },
  {
    question: "Ni iyihe mpamvu Structured Clone algorithm (structuredClone) iruta JSON.parse(JSON.stringify(obj))?",
    options: [
      "Ikemura ikibazo cya circular references kandi igakomeza Date, RegExp, Map, Set, n'ArrayBuffers",
      "Yihuta inshuro miliyoni",
      "Ikora gusa kuri Node.js",
      "Nta tandukaniro na rimwe rihari"
    ],
    correctIndex: 0,
    explanation: "JSON stringify inyura hejuru ya functions, undefined, ihindura Date mo string, kandi igwa iyo hari circular reference."
  },
  {
    question: "Iyo ukoze: (function(){ var a = b = 3; })(); console.log(typeof a, typeof b); hasohoka iki?",
    options: ["undefined, number", "number, number", "undefined, undefined", "error"],
    correctIndex: 0,
    explanation: "'var a' ibaho gusa mu local scope ya function (bityo typeof a ni undefined). Ariko 'b = 3' ikorwa nk'ikintu kigana muri window/global scope."
  },
  {
    question: "Muri V8 Engine, 'Hidden Classes' na 'Inline Caching' (IC) bimaze iki?",
    options: [
      "Gutuma ugushaka properties by'objects bihinduka byihuse nk'aho ari C++ struct offsets",
      "Guhisha code y'umukoresha ku bajura",
      "Gukora CSS animations mu buryo bw'ibanga",
      "Gufunga porogaramu idafite umutekano"
    ],
    correctIndex: 0,
    explanation: "V8 ikora Shapes/Hidden classes ku objects zifite properties zimwe mu mwanya umwe kugira ngo ikore fast memory access."
  },
  {
    question: "Ni ubuhe buryo bwiza bwo kwirinda Cross-Site Scripting (XSS) iyo ushyira data ivuye ku mukoresha muri DOM?",
    options: [
      "Kwirinda innerHTML ugakoresha textContent cyangwa DOMPurify / template sanitization",
      "Gusiba browser history",
      "Gukoresha let aho gukoresha var",
      "Gushyiraho igihe cya setTimeout kuri 0"
    ],
    correctIndex: 0,
    explanation: "Kwirinda innerHTML no gukoresha textContent yirinda ko umujura yinjiza malicious <script> tags."
  },
  {
    question: "Muri Web Security, ikirango 'SameSite=Strict' na 'HttpOnly' ku ma cookies birinda iki?",
    options: [
      "'HttpOnly' irinda XSS yo kwiba cookies muri JS, naho 'SameSite' irinda CSRF attacks",
      "Birinda gusa interineti idacika",
      "Bifasha amafoto kugaragara neza",
      "Birinda CPU gushyuha"
    ],
    correctIndex: 0,
    explanation: "HttpOnly ibuza document.cookie muri JS, naho SameSite ibuza kohereza cookies mu ma third-party cross-site requests."
  },
  {
    question: "Big-O Time Complexity ya Quicksort mu gihe kibi cyane (worst-case) n'igihe cy'impuzandengo (average-case) ni iki?",
    options: ["Worst: O(n^2), Average: O(n log n)", "Worst: O(n), Average: O(1)", "Worst: O(log n), Average: O(n)", "Worst: O(n^3), Average: O(n^2)"],
    correctIndex: 0,
    explanation: "Iyo pivot itowe nabi (nka sorted array idafite randomized pivot), Quicksort igwa kuri O(n^2), ariko average ni O(n log n)."
  },
  {
    question: "Muri Node.js, process.nextTick() itandukaniye he na setImmediate()?",
    options: [
      "process.nextTick() ikorwa ako kanya mbere y'uko event loop ikomeza ku kindi cyiciro, mbere ya microtasks zose",
      "setImmediate() ikora mbere ya synchronous code",
      "Zombi zikora ku gihe kimwe nta tandukaniro",
      "process.nextTick() ikora gusa mu gihe browser iri gufungwa"
    ],
    correctIndex: 0,
    explanation: "nextTick queue ifite agaciro gakomeye (runs immediately after the current operation finishes), mbere ya timers na I/O."
  },
  {
    question: "Muri React, kuki gukoresha Array Index nka 'key' muri dynamic lists (nka items.map((it, idx) => <Item key={idx} />)) ari bibi?",
    options: [
      "Bitera ibibazo bya state retention n'amafuti mu gihe ibintu bihinduriwe umwanya, byongerewe, cyangwa byasibwe",
      "Bituma React idashobora kwakira CSS",
      "Bituma mudasobwa yaka umuriro",
      "React ntabwo ibyemera irahagarara"
    ],
    correctIndex: 0,
    explanation: "Iyo urutonde ruhindutse, indices zirahinduka bigatuma Virtual DOM reconciliation igwa mu rikosa ryo guhuza state nabi."
  },
  {
    question: "Ni irihe tandukaniro riri hagati ya Deep Equality na Shallow Equality mu kugenzura Objects?",
    options: [
      "Shallow ireba niba reference cyangwa top-level properties zihuye, naho Deep ireba recursion ku masoko yose y'imbere",
      "Deep ireba gusa imibare",
      "Shallow ikora gusa kuri arrays z'ubusa",
      "Nta tandukaniro rihari"
    ],
    correctIndex: 0,
    explanation: "Deep equality igomba kunyura muri nested objects zose no kumenya niba n'utuntu twose tw'imbere duhuje agaciro."
  },
  {
    question: "Muri Database Transactions, ACID principles zihagarariye iki?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Automatic, Cloud, Internet, Database",
      "Access, Control, Interface, Delivery",
      "Algorithm, Code, Input, Data"
    ],
    correctIndex: 0,
    explanation: "ACID: Atomicity (yose cyangwa ntacyo), Consistency (amategeko aruhuye), Isolation (ntabangamirwe), Durability (bikomeza kubaho)."
  },
  {
    question: "Iyo ufite function igenzura 'debounce' na function ya 'throttle', ni ikihe kinyuranyo cy'ingenzi?",
    options: [
      "Debounce itegereza igihe ntarengwa nyuma y'igikorwa cya nyuma; Throttle igabanya inshuro igikorwa cyakorwa mu gihe runaka",
      "Debounce ikoreshwa ku modoka gusa",
      "Throttle ntabwo yemewe muri JavaScript",
      "Zikora kimwe neza 100%"
    ],
    correctIndex: 0,
    explanation: "Debounce ikora nyuma y'amasegonda yo gutuza (nko gushakisha mu typing). Throttle ikora inshuro 1 buri X milliseconds (nko muri scroll)."
  },
  {
    question: "Ikintu kitwa 'WeakMap' muri JavaScript gitandukaniye he na 'Map'?",
    options: [
      "WeakMap keys zigomba kuba objects gusa, kandi ntabwo zibuza Garbage Collector gusiba iyo object (weak references)",
      "WeakMap ntabwo yemerewe kubika imibare",
      "WeakMap yihuta kurenza CPU",
      "Map ntiyemera strings"
    ],
    correctIndex: 0,
    explanation: "WeakMap ntiyirinda GC; iyo nta handi iyo object ifashwe, irasibwa nta memory leak ibayeho."
  },
  {
    question: "Iyo ukoze 'Object.freeze(obj)', ni iki gishobora guhinduka kuri iyo object?",
    options: [
      "Properties ziri kuri shallow level ntizongerwa, ntizisibwa, ntizihindurwa, ariko nested objects ziracyahinduka kerse ubikoze recursively",
      "Object yose ihinduka ifu ntishobora no gusomwa",
      "Ihinduka string ako kanya",
      "Mudasobwa ihita yizimya"
    ],
    correctIndex: 0,
    explanation: "Object.freeze() ni shallow freeze; properties z'imbere (nested objects) ziba zigikeneye gukorwaho deepFreeze."
  },
  {
    question: "Muri Modern Web, ni irihe tandukaniro riri hagati ya Web Workers na Service Workers?",
    options: [
      "Web Workers bakora background compute kuri thread itabangamira UI; Service Workers bakora nka proxy yo kubika cache no gukora offline",
      "Service Workers bakoreshwa gusa mu kwakira amafoto",
      "Web Workers ntibashobora gukora imibare",
      "Nta tandukaniro ririmo"
    ],
    correctIndex: 0,
    explanation: "Web Workers bakemura intensive computational tasks. Service Workers bafata network requests no gutanga PWA capabilities."
  },
  {
    question: "Muri JavaScript Generators, ikimenyetso 'yield*' gikora iki?",
    options: [
      "Gushyira intambwe ku wundi generator cyangwa ikintu kigize urutonde (delegates iteration to another iterable)",
      "Kuzimya generator ako kanya",
      "Gukora variable nshya ya global",
      "Gusiba memory yose ya function"
    ],
    correctIndex: 0,
    explanation: "'yield*' ituma generator itanga iteration kubindi bintu by'iterable (nka delegate generator)."
  },
  {
    question: "Muri JWT (JSON Web Token), kuki ari ikosa gushyira amakuru y'ibanga (nka password cyangwa sensitive data) muri Payload?",
    options: [
      "Payload ifite Base64Url encoding gusa, ntabwo iri encrypted bityo umuntu wese ashobora kuyisoma ako kanya",
      "Kubera ko JWT ifite amabara atari meza",
      "Kubera ko password ntabwo yakirwa muri strings",
      "Ntabwo ari ikosa na gato"
    ],
    correctIndex: 0,
    explanation: "JWT payload ntabwo ihishe (not encrypted); igizwe gusa na signature yo kumenya ko itahinduwe, ariko amakuru aragaragara."
  },
  {
    question: "Kuki algorithm ya 'bcrypt' cyangwa 'argon2' iruta 'MD5' cyangwa 'SHA-256' mu kubika Passwords mu cyegeranyo cya database?",
    options: [
      "Kubera ko zifite adjustable work factor (slow hashing) na automatic salt, zikarinda brute-force na GPU attacks",
      "Kubera ko MD5 yihuta kurusha izindi",
      "Kubera ko SHA-256 itemewe n'amategeko",
      "Kubera ko bcrypt ifite inyuguti nke"
    ],
    correctIndex: 0,
    explanation: "Fast hash functions nka MD5/SHA256 zishobora kumenwa na GPUs mu masegonda. bcrypt na argon2 zitinda ku bushake kandi zigakoresha salt."
  }
];

export const getQuestionsForCourse = (slug: string): { assignment: IQuizQuestion[]; exam: IQuizQuestion[] } => {
  return {
    assignment: JS_ASSIGNMENT_50,
    exam: JS_EXAM_HARDEST_20,
  };
};
