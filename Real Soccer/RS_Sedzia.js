let adminPassword = 'qwerty'; // HASŁO ADMINISTRATORA

// Podstawa: http://rshl.eu/pages.php?page=autoreferee
/***************************************************************************************************************************************************************************

Aby uzyskać uprawnienia administratora należy (domyślnie) wpisać !op qwerty. Zalecana jest zmiana hasła (linijka 1)

PRZYDATNE KOMENDY DLA ADMINÓW:

!tred <nazwa>: Ustawia nazwę drużyny czerwonych. Domyślnie jest pusta. Będzie wyświetlana, gdy bot wskaże wykonawcę stałego fragmentu gry np. "Rzut rożny dla [🔴R] <nazwa>"
!tblue <nazwa>: Jak wyżej, tylko dla niebieskich.
!load rs: Mapa RS
!load pens: Mapa do rzutów karnych

Sędzia określa, co ma się stać, gdy piłka wyjdzie za boisko oraz zapisuje strzelców i im asystujących

***************************************************************************************************************************************************************************/

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||"undefined"!==typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(a){"use strict";if("undefined"===typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var k=a.document,n=k.createElementNS("http://www.w3.org/1999/xhtml","a"),w="download"in n,x=function(c){var e=k.createEvent("MouseEvents");e.initMouseEvent("click",!0,!1,a,0,0,0,0,0,!1,!1,!1,!1,0,null);c.dispatchEvent(e)},q=a.webkitRequestFileSystem,u=a.requestFileSystem||q||a.mozRequestFileSystem,
y=function(c){(a.setImmediate||a.setTimeout)(function(){throw c;},0)},r=0,s=function(c){var e=function(){"string"===typeof c?(a.URL||a.webkitURL||a).revokeObjectURL(c):c.remove()};a.chrome?e():setTimeout(e,10)},t=function(c,a,d){a=[].concat(a);for(var b=a.length;b--;){var l=c["on"+a[b]];if("function"===typeof l)try{l.call(c,d||c)}catch(f){y(f)}}},m=function(c,e){var d=this,b=c.type,l=!1,f,p,k=function(){t(d,["writestart","progress","write","writeend"])},g=function(){if(l||!f)f=(a.URL||a.webkitURL||
a).createObjectURL(c);p?p.location.href=f:void 0==a.open(f,"_blank")&&"undefined"!==typeof safari&&(a.location.href=f);d.readyState=d.DONE;k();s(f)},h=function(a){return function(){if(d.readyState!==d.DONE)return a.apply(this,arguments)}},m={create:!0,exclusive:!1},v;d.readyState=d.INIT;e||(e="download");if(w)f=(a.URL||a.webkitURL||a).createObjectURL(c),n.href=f,n.download=e,x(n),d.readyState=d.DONE,k(),s(f);else{a.chrome&&b&&"application/octet-stream"!==b&&(v=c.slice||c.webkitSlice,c=v.call(c,0,
c.size,"application/octet-stream"),l=!0);q&&"download"!==e&&(e+=".download");if("application/octet-stream"===b||q)p=a;u?(r+=c.size,u(a.TEMPORARY,r,h(function(a){a.root.getDirectory("saved",m,h(function(a){var b=function(){a.getFile(e,m,h(function(a){a.createWriter(h(function(b){b.onwriteend=function(b){p.location.href=a.toURL();d.readyState=d.DONE;t(d,"writeend",b);s(a)};b.onerror=function(){var a=b.error;a.code!==a.ABORT_ERR&&g()};["writestart","progress","write","abort"].forEach(function(a){b["on"+
a]=d["on"+a]});b.write(c);d.abort=function(){b.abort();d.readyState=d.DONE};d.readyState=d.WRITING}),g)}),g)};a.getFile(e,{create:!1},h(function(a){a.remove();b()}),h(function(a){a.code===a.NOT_FOUND_ERR?b():g()}))}),g)}),g)):g()}},b=m.prototype;b.abort=function(){this.readyState=this.DONE;t(this,"abort")};b.readyState=b.INIT=0;b.WRITING=1;b.DONE=2;b.error=b.onwritestart=b.onprogress=b.onwrite=b.onabort=b.onerror=b.onwriteend=null;return function(a,b){return new m(a,b)}}}("undefined"!==typeof self&&
self||"undefined"!==typeof window&&window||this.content);"undefined"!==typeof module&&null!==module?module.exports=saveAs:"undefined"!==typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});

let locale = 'pl';

let roomName = 'RS z Sędzią';
let maxPlayers = 20;
let roomPublic = false;
let playerName = 'SĘDZIA';
let code = 'PL'; // Polska
let lat = 52;
let lon = 19;

/* STADION */
// Wartości dotyczą boiska na którym rozgrywany jest mecz - wartości domyślne to oficjalna mapa RS
let baseStadiumWidth = 1150;
let baseStadiumHeight = 600;
let stadiumWidth = 1150;
let stadiumHeight = 600;
let ballRadius = 9.8;
let isBackFurtherNeededDistance;
let outLineY;
let throwInLeeway = 350; // dozwolone odchylenie w poziomie przy wyrzucie z autu
let greenLine = 510; // punkt, w którym gracz jest styczny z linią boczną
let cornerPenaltyRadius = 330; // najmniejsza odległość od gracza do rogu, w której gracz nie przekracza łuku
let cornerLeftUpPos = {x: -1150, y: -600};
let cornerLeftDownPos = {x: -1150, y: 600};
let cornerRightUpPos = {x: 1150, y: -600};
let cornerRightDownPos = {x: 1150, y: 600};

/* USTAWIENIA */
isBackFurtherNeededDistance = ballRadius + 15 + 0.01;
outLineY = stadiumWidth - (ballRadius / 2) + 6; // 1150 - 9.8/2 + 6 = 1152.1
stadiumWidth = baseStadiumWidth + (ballRadius / 2) + 6; // 1150 + 9.8/2 + 6 = 1160.9
stadiumHeight = baseStadiumHeight + (ballRadius / 2) + 6; // 600 + 4.9 + 6 = 610.9

let players = null;
let population = 0;
let Team =
{
    SPECTATORS: 0,
    RED: 1,
    BLUE: 2
};
let redTeamPrefix = '[' + teamIcon(Team.RED) + 'R] ';
let blueTeamPrefix = '[' + teamIcon(Team.BLUE) + 'B] ';
let redTeamName = redTeamPrefix;
let blueTeamName = blueTeamPrefix;

let bijacze = new Map(); // kto i ile razy banował innych graczy (niewykorzystywana)
let playerLang = new Map(); // ustawienia języka gracza

let lastScores = 0;
let lastTeamTouched = 0;
let ballYPosition;
let exitingXPos = null; // miejsce wybicia piłki z autu
let previousBallYPosition;
let lastPlayerTouched = null;
let previousPlayerTouched = null;
let assistingPlayer = null;
let backFurtherMsgCanBeShown = false;
let lastCall; // 1, 2, CK, GK
let isBallUp = false;
let crossed = false;
let lineCrossedPlayers = [{name: 'temp', times: 0}];
let isBallKickedOutside = false;
let timeOutside = 0;
let playTimeInMinutes = 20; // Przy limicie czasu 0, mecz domyślnie trwa 20 minut
let isAutoPossEnabled = true; // Czy wyświetlać posiadanie co jakiś czas
let autoPossIntervalInMinutes = 5; // Co ile minut wyświetlić posiadanie piłki
let isAutoPossShown = false;
let isTimeAddedShown = false;
let actualTimeAdded;
let redPossessionTicks = 0;
let bluePossessionTicks = 0;

let isPaused = false;

let ballColor = 0xFFFFFF;

// Mapy
let maps = 
{
	'RS': '{"name":"Real Soccer 1.3D by RawR","width":1300,"height":670,"bg":{"type":"grass","width":1150,"height":600,"kickOffRadius":180},"vertexes":[{"x":0,"y":700,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-700,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":1150,"y":255,"cMask":[]},{"x":840,"y":255,"cMask":[]},{"x":1150,"y":-255,"cMask":[]},{"x":840,"y":-255,"cMask":[]},{"x":1150,"y":155,"cMask":[]},{"x":1030,"y":155,"cMask":[]},{"x":1150,"y":-155,"cMask":[]},{"x":1030,"y":-155,"cMask":[]},{"x":840,"y":-135,"cMask":[]},{"x":840,"y":135,"cMask":[]},{"x":-1150,"y":-255,"cMask":[]},{"x":-840,"y":-255,"cMask":[]},{"x":-1150,"y":255,"cMask":[]},{"x":-840,"y":255,"cMask":[]},{"x":-1150,"y":-155,"cMask":[]},{"x":-1030,"y":-155,"cMask":[]},{"x":-1150,"y":155,"cMask":[]},{"x":-1030,"y":155,"cMask":[]},{"x":-840,"y":135,"cMask":[]},{"x":-840,"y":-135,"cMask":[]},{"x":935,"y":4,"cMask":[]},{"x":935,"y":-4,"cMask":[]},{"x":-935,"y":4,"cMask":[]},{"x":-935,"y":-4,"cMask":[]},{"x":-1150,"y":525,"bCoef":0,"cMask":["wall"]},{"x":-1075,"y":600,"bCoef":0,"cMask":["wall"]},{"x":-1075,"y":-600,"bCoef":0,"cMask":["wall"]},{"x":-1150,"y":-525,"bCoef":0,"cMask":["wall"]},{"x":1075,"y":600,"bCoef":0,"cMask":["wall"]},{"x":1150,"y":525,"bCoef":0,"cMask":["wall"]},{"x":1150,"y":-525,"bCoef":0,"cMask":["wall"]},{"x":1075,"y":-600,"bCoef":0,"cMask":["wall"]},{"x":-1150,"y":127,"cMask":[]},{"x":-1214,"y":124,"cMask":[]},{"x":-1150,"y":-127,"cMask":[]},{"x":-1214,"y":-124,"cMask":[]},{"x":1150,"y":127,"cMask":[]},{"x":1214,"y":124,"cMask":[]},{"x":1150,"y":-127,"cMask":[]},{"x":1214,"y":-124,"cMask":[]},{"x":0,"y":-4,"cMask":[]},{"x":0,"y":4,"cMask":[]},{"x":0,"y":-4,"cMask":[]},{"x":0,"y":4,"cMask":[]},{"x":-1214,"y":124,"cMask":[]},{"x":-1250,"y":150,"cMask":[]},{"x":-1214,"y":-124,"cMask":[]},{"x":-1250,"y":-150,"cMask":[]},{"x":1214,"y":124,"cMask":[]},{"x":1250,"y":150,"cMask":[]},{"x":1214,"y":-124,"cMask":[]},{"x":1250,"y":-150,"cMask":[]},{"x":-1185,"y":155,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":255,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":155,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":255,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":-155,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":-255,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":-155,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":-255,"bCoef":-4.5,"cMask":["ball"]},{"x":1158,"y":-607,"bCoef":-2.45,"cMask":["ball"]},{"x":1187,"y":-578,"bCoef":-2.45,"cMask":["ball"]},{"x":1158,"y":607,"bCoef":-2.45,"cMask":["ball"]},{"x":1187,"y":578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1158,"y":607,"bCoef":-2.45,"cMask":["ball"]},{"x":-1187,"y":578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1158,"y":-607,"bCoef":-2.45,"cMask":["ball"]},{"x":-1187,"y":-578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1190,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1148,"y":-525,"cMask":[]},{"x":1148,"y":-525,"cMask":[]},{"x":-1148,"y":525,"cMask":[]},{"x":1148,"y":525,"cMask":[]},{"x":-1150,"y":-260,"cMask":[]},{"x":-840,"y":-600,"cMask":[]},{"x":-1150,"y":260,"cMask":[]},{"x":-840,"y":600,"cMask":[]},{"x":-840,"y":-1150,"cMask":[]},{"x":1150,"y":-260,"cMask":[]},{"x":840,"y":-600,"cMask":[]},{"x":1150,"y":260,"cMask":[]},{"x":840,"y":600,"cMask":[]}],"segments":[{"v0":37,"v1":39,"bCoef":0.1,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":43,"v1":41,"bCoef":0.1,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":4,"v1":5,"cMask":[],"color":"C7E6BD"},{"v0":5,"v1":7,"cMask":[],"color":"C7E6BD"},{"v0":6,"v1":7,"cMask":[],"color":"C7E6BD"},{"v0":8,"v1":9,"cMask":[],"color":"C7E6BD"},{"v0":9,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":10,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":13,"v1":12,"curve":130,"curveF":0.4663076581549986,"cMask":[],"color":"C7E6BD"},{"v0":14,"v1":15,"cMask":[],"color":"C7E6BD"},{"v0":15,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":18,"v1":19,"cMask":[],"color":"C7E6BD"},{"v0":19,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":20,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":23,"v1":22,"curve":130,"curveF":0.4663076581549986,"cMask":[],"color":"C7E6BD"},{"v0":25,"v1":24,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":27,"v1":26,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":25,"v1":24,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":27,"v1":26,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"cMask":[],"color":"C7E6BD"},{"v0":28,"v1":29,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":30,"v1":31,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":32,"v1":33,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":34,"v1":35,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":36,"v1":37,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":39,"v1":38,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":41,"v1":40,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":42,"v1":43,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":45,"v1":44,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":46,"v1":47,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":45,"v1":44,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":46,"v1":47,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":48,"v1":49,"cMask":[],"color":"FFFFFF"},{"v0":50,"v1":51,"cMask":[],"color":"FFFFFF"},{"v0":52,"v1":53,"cMask":[],"color":"FFFFFF"},{"v0":54,"v1":55,"cMask":[],"color":"FFFFFF"},{"v0":56,"v1":57,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":59,"v1":58,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":61,"v1":60,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":62,"v1":63,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":65,"v1":64,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":66,"v1":67,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":69,"v1":68,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":70,"v1":71,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":0,"v1":1,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":1,"v1":2,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":2,"v1":1,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":2,"v1":3,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":72,"v1":73,"bCoef":-1,"cMask":["ball"]},{"v0":74,"v1":75,"bCoef":-1,"cMask":["ball"]},{"v0":76,"v1":77,"bCoef":-1,"cMask":["ball"]},{"v0":78,"v1":79,"bCoef":-1,"cMask":["ball"]},{"v0":80,"v1":81,"bCoef":-1,"cMask":["ball"]},{"v0":82,"v1":83,"bCoef":-1,"cMask":["ball"]},{"v0":84,"v1":85,"bCoef":-1,"cMask":["ball"]},{"v0":86,"v1":87,"bCoef":-1,"cMask":["ball"]},{"v0":88,"v1":89,"cMask":[],"color":"5E844D"},{"v0":90,"v1":91,"cMask":[],"color":"5E844D"},{"v0":93,"v1":92,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":94,"v1":95,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":97,"v1":98,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":100,"v1":99,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"}],"planes":[{"normal":[0,1],"dist":-635,"bCoef":0,"cMask":["ball"]},{"normal":[0,-1],"dist":-635,"bCoef":0,"cMask":["ball"]},{"normal":[0,1],"dist":-670,"bCoef":0},{"normal":[0,-1],"dist":-670,"bCoef":0},{"normal":[1,0],"dist":-1300,"bCoef":0},{"normal":[-1,0],"dist":-1300,"bCoef":0.1},{"normal":[1,0],"dist":-1214,"bCoef":0,"cMask":["ball"]},{"normal":[-1,0],"dist":-1214,"bCoef":0,"cMask":["ball"]}],"goals":[{"p0":[-1160,-124],"p1":[-1160,124],"team":"red"},{"p0":[1160,124],"p1":[1160,-124],"team":"blue"}],"discs":[{"radius":9.8,"invMass":1.05,"cGroup":["ball","kick","score"]},{"pos":[-1150,127],"radius":5,"invMass":0,"color":"FF0000"},{"pos":[-1150,-127],"radius":5,"invMass":0,"color":"FF0000"},{"pos":[1150,127],"radius":5,"invMass":0,"color":"FF"},{"pos":[1150,-127],"radius":5,"invMass":0,"color":"FF"},{"pos":[-1250,150],"radius":3,"bCoef":3,"invMass":0,"color":"FF0000","cMask":[]},{"pos":[-1250,-150],"radius":3,"bCoef":3,"invMass":0,"color":"FF0000","cMask":[]},{"pos":[1250,150],"radius":3,"bCoef":3,"invMass":0,"color":"FF","cMask":[]},{"pos":[1250,-150],"radius":3,"bCoef":3,"invMass":0,"color":"FF","cMask":[]},{"pos":[-1150,-600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[-1150,600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[1150,-600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[1150,600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]}],"playerPhysics":{"acceleration":0.12,"kickStrength":5.65},"ballPhysics":"disc0","spawnDistance":500}',
	'PENS': '{"name":"Penalty 1.1 Mod from HaxMaps","width":420,"height":200,"bg":{"type":"grass","width":500,"height":250,"kickOffRadius":10},"vertexes":[{"x":420,"y":600,"cMask":["ball"]},{"x":420,"y":-600,"cMask":["ball"]},{"x":283,"y":500,"bCoef":0,"cMask":["blue"]},{"x":283,"y":-500,"bCoef":0,"cMask":["blue"]},{"x":335,"y":500,"bCoef":0,"cMask":["blue"]},{"x":335,"y":-500,"bCoef":0,"cMask":["blue"]},{"x":-475,"y":-200,"bCoef":0,"cMask":["red"]},{"x":-10,"y":-190,"bCoef":0,"cMask":["red"]},{"x":-10,"y":190,"bCoef":0,"cMask":["red"]},{"x":-475,"y":200,"bCoef":0,"cMask":["red"]},{"x":300,"y":-250,"cMask":[]},{"x":300,"y":250,"cMask":[]},{"x":0,"y":9,"cMask":[]},{"x":0,"y":-9,"cMask":[]},{"x":0,"y":9,"cMask":[]},{"x":0,"y":-9,"cMask":[]},{"x":175,"y":-175,"cMask":[]},{"x":300,"y":-175,"cMask":[]},{"x":175,"y":175,"cMask":[]},{"x":300,"y":175,"cMask":[]},{"x":-120,"y":-250,"cMask":[]},{"x":-120,"y":250,"cMask":[]},{"x":-120,"y":-190,"cMask":[]},{"x":-120,"y":190,"cMask":[]},{"x":300,"y":-100,"cMask":[]},{"x":350,"y":-98,"cMask":[]},{"x":350,"y":98,"cMask":[]},{"x":300,"y":100,"cMask":[]},{"x":0,"y":-15,"bCoef":-2.4,"cMask":["ball"]},{"x":0,"y":15,"bCoef":-2.4,"cMask":["ball"]},{"x":400,"y":-135,"cMask":[]},{"x":400,"y":135,"cMask":[]}],"segments":[{"v0":0,"v1":1,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bCoef":0,"vis":false,"cMask":["blue"]},{"v0":4,"v1":5,"bCoef":0,"vis":false,"cMask":["blue"]},{"v0":6,"v1":7,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":7,"v1":8,"bCoef":0,"curve":50,"curveF":2.1445069205095586,"vis":false,"cMask":["red"]},{"v0":8,"v1":9,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":9,"v1":6,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":10,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":13,"v1":12,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":14,"v1":15,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":18,"cMask":[],"color":"C7E6BD"},{"v0":18,"v1":19,"cMask":[],"color":"C7E6BD"},{"v0":20,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":23,"v1":22,"curve":140,"curveF":0.36397023426620245,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":25,"v1":26,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":26,"v1":27,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":28,"v1":29,"bCoef":-2.4,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["ball"],"color":"C7E6BD"},{"v0":25,"v1":30,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":31,"cMask":[],"color":"C7E6BD"}],"planes":[{"normal":[0,1],"dist":-200,"cMask":["ball"]},{"normal":[0,-1],"dist":-200,"cMask":["ball"]},{"normal":[0,1],"dist":-250,"bCoef":0.1},{"normal":[0,-1],"dist":-250,"bCoef":0.1},{"normal":[1,0],"dist":-400,"bCoef":0.1},{"normal":[-1,0],"dist":-400,"bCoef":0.1}],"goals":[{"p0":[310,100],"p1":[310,-100],"team":"blue"},{"p0":[300,100],"p1":[-400,100],"team":"red"},{"p0":[300,-100],"p1":[-400,-100],"team":"red"},{"p0":[-10,250],"p1":[-10,-250],"team":"red"}],"discs":[{"cGroup":["ball","kick","score"]},{"pos":[300,100],"radius":5,"bCoef":1.3,"invMass":0},{"pos":[300,-100],"radius":5,"bCoef":1.3,"invMass":0},{"pos":[400,-135],"radius":3,"bCoef":1,"invMass":0},{"pos":[400,135],"radius":3,"bCoef":1,"invMass":0}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":300}'
};

// Przetłumaczalne teksty
let locStr =
{
    GK:
    {
        'en': 'Goal kick -',
        'pl': 'Od bramki'
    },
	CK:
    {
        'en': 'Corner kick -',
        'pl': 'Rzut rożny dla'
    },
	OUT:
	{
		'en': 'Throw-in -',
		'pl': 'Aut dla'
	},
	LINE:
	{
		'en': 'LINE -',
		'pl': 'LINIA -'
	},
	BACK:
	{
		'en': 'BACK',
		'pl': 'DO TYŁU'
	},
	FURTHER:
	{
		'en': 'FURTHER',
		'pl': 'DO PRZODU'
	},
	OK:
	{
		'en': 'OK',
		'pl': 'OK'
	},
	BAD_THROW_IN:
	{
		'en': '(BAD THROW-IN)',
		'pl': '(BRAK KOPNIĘCIA)'
	},
	WRONG_TEAM:
	{
		'en': 'WRONG TEAM',
		'pl': 'NIE TA DRUŻYNA'
	},
	WRONG_PLACE:
	{
		'en': 'WRONG PLACE',
		'pl': 'NIE W TYM MIEJSCU'
	},
	BALL_POSS:
	{
		'en': 'Ball possession',
		'pl': 'Posiadanie piłki'
	},
	LAST_BALL_POSS:
	{
		'en': 'Ball possession in last match',
		'pl': 'Posiadanie piłki w ostatnim meczu'
	},
	NOT_ALLOWED:
	{
		'en': "You don't have permission to do that.",
		'pl': 'Nie. Nie wiemy, czy można ci ufać.'
	},
	PRIV:
	{
		'en': '[PM]',
		'pl': '[PRYWATNA]'
	},
	ENABLED:
	{
		'en': 'enabled',
		'pl': 'włączone'
	},
	DISABLED:
	{
		'en': 'disabled',
		'pl': 'wyłączone'
	},
	BANS_CLEARED:
	{
		'en': 'Bans cleared',
		'pl': 'Wyczyszczono bany'
	},
	AUTO_BALL_POSS_DISPLAY:
	{
		'en': 'Auto ball possession display',
		'pl': 'Automatyczne wyświetlanie posiadania piłki'
	},
	RED_ARE:
	{
		'en': 'Red are',
		'pl': 'Czerwoni to'
	},
	BLUE_ARE:
	{
		'en': 'Blue are',
		'pl': 'Niebiescy to'
	},
	NO_MAP:
	{
		'en': 'No such map',
		'pl': 'Nie ma mapy'
	},
	TYPO_POSSIBLE:
	{
		'en': 'Did you make a typo?',
		'pl': 'Możliwa literówka'
	},
	QUIET_E:
	{
		'en': 'Quiet e',
		'pl': 'Cicho e'
	},
	BALL_COLOR_CHANGED_TO:
	{
		'en': 'Ball color changed to',
		'pl': 'Zmieniono kolor piłki na'
	},
	BAN_AFTERMATH:
	{
		'en': 'This will have far-reaching consequences',
		'pl': 'Ta decyzja zmieni losy gry'
	},
	OG:
	{
		'en': '(og.)',
		'pl': '(sam.)'
	},
	DROPPED_BALL:
	{
		'en': 'DROPPED-BALL',
		'pl': 'RZUT SĘDZIOWSKI'
	},
	FAILED:
	{
		'en': 'Failed',
		'pl': 'Nie udało się'
	}
}

// Tworzenie pokoju
let room = HBInit(
{
	roomName: roomName
	, maxPlayers: maxPlayers
	, public: roomPublic
	, playerName: playerName
	, geo: {'code': code, 'lat': lat, 'lon': lon}
	, noPlayer: true // SĘDZIA nie będzie widoczny w pokoju
});
room.setTeamsLock(false);
room.setScoreLimit(0);
room.setTimeLimit(0);
room.setCustomStadium(maps['RS']);

/*
    ****************************** Wyciąganie graczy ******************************
*/
function getPlayerByName(name)
{
	return players.find((p) => p.name === name);
}
function getPlayersByTeam(team)
{
	return players.filter((p) => p.team === team);
}
function getPlayersByAdmin(admin)
{
	return players.filter((p) => p.admin === admin);
}
function getIdByPlayerName(name)
{
	if (getPlayerByName(name) == null)
		return null;
	else
		return players.find((p) => p.name === name).id;
}

/*
    ****************************** Funkcje ******************************
*/
function saveFile(data, filename)
{ // Zapis danych do pliku
    let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
	saveAs(blob, filename);
}

let replays = new Array();
let isRecording = false;
let replayNumber = 0;
function saveReplay(replayNumber)
{ // Zapis powtórki
	saveFile(replays[replayNumber], 'Powtórka' + replayNumber + '.hbr2');
}

function reactToBallRadiusChange()
{
	ballRadius = room.getDiscProperties(0).radius;
	isBackFurtherNeededDistance = ballRadius + 15 + 0.01;
	outLineY = stadiumWidth - (ballRadius / 2) + 6;
	stadiumWidth = baseStadiumWidth + (ballRadius / 2) + 6;
	stadiumHeight = baseStadiumHeight + (ballRadius / 2) + 6;
}

function ignore(string)
{ // do nazw drużyn i map
	string = string.toLocaleUpperCase(locale); // do WIELKICH LITER
	string = string.replace(/^\s+|\s+$/g,''); // usuwanie spacji na początku i końcu
	return string;
}

function oczysc(message)
{ // do wykrywania wulgaryzmów (niewykorzystywana)
	message = message.toLocaleUpperCase(locale); // do WIELKICH LITER
    //message = message.replace(/\s/g, ''); // usuwanie spacji (ale wtedy '5 KUR WAży' to wulgaryzm)
    message = message.replace(/\.|\,|\;|\'|\/|\-|\_|\`|\|/g, ''); // usuwanie znaków int.
	return message;
}

function updatePlayerList() // onPlayerJoin/Leave
{ // wywołanie przy wchodzeniu/wychodzeniu
    players = room.getPlayerList(); // gracze
	population = players.length;
}

function initBijacze(player)
{
	if (bijacze.get(player.name))
		return;
	bijacze.set(player.name, 0);
}

function setPlayerLanguage(player, lang)
{
	playerLang.set(player.id, lang);
}

// Ikony drużyn
function teamIcon(team)
{ // uwaga: mogą być u niektórych wyświetlane jako kwadraty lub czarno-białe, nie polegać wyłącznie na nich
	if (team === Team.RED)
		return '🔴'; // czerwony
	else if (team === Team.BLUE)
		return '🔵'; // niebieski
	else return '⬜'; // ławka
}

function sendLocalizedAnnouncement(locArray, id, color, style, sound)
{ // wysłanie wiadomości prywatnych w języku użytkownika
	let stringBuilder = '';
	let debugStr = '';
	if (id == null)
	{ // do wszystkich
		players.forEach(player =>
		{
			locArray.forEach(str => 
			{
				if (str.constructor() != '[object Object]')
					stringBuilder += str; // normalny tekst
				else
					stringBuilder += str[playerLang.get(player.id)]; // przetłumaczony tekst
			});
			room.sendAnnouncement(stringBuilder, player.id, color, style, sound);
			debugStr = stringBuilder;
			stringBuilder = '';
		});
		console.log('▌ ' + debugStr);
	}
	else
	{ // prywatna
		locArray.forEach(str => 
		{
			if (str.constructor() == '')
				stringBuilder += str; // normalny tekst
			else
				stringBuilder += str[playerLang.get(id)]; // przetłumaczony tekst
		});
		room.sendAnnouncement(locStr.PRIV[playerLang.get(id)] + ' ' + stringBuilder, id, color, style, sound);
	}
}

let previousBallPosForGoingUp;
let currentBallPosForGoingUp;
function isBallGoingUp() // niewykorzystywana
{
    previousBallPosForGoingUp = currentBallPosForGoingUp;
    currentBallPosForGoingUp = room.getBallPosition().y;
    if (previousBallPosForGoingUp - currentBallPosForGoingUp > 0.01)
        isBallUp = 2;
	else if (previousBallPosForGoingUp - currentBallPosForGoingUp < -0.01)
        isBallUp = 1;
	else
        isBallUp = 0;
}

function displayAddedTime() // onGameTick
{ // doliczony czas
    let scores = room.getScores();
	let timeLimit = scores.timeLimit;
	let isDraw = scores.red == scores.blue;
	if (timeLimit > 0)
	{ // skończony czas
		if (scores.time > timeLimit-20 && isDraw && !isTimeAddedShown)
		{ // 20s przed końcem i nie pokazano wcześniej
			actualTimeAdded = Math.round(timeOutside/60 / 2); // 20/2=10s
			if (actualTimeAdded < 60 && actualTimeAdded > -1)
			{
				sendLocalizedAnnouncement(['+00:' + leadingZero(actualTimeAdded)], null, 0x88FFAA, 'bold', 1);
			}
			else if (actualTimeAdded < 0)
			{
				sendLocalizedAnnouncement(['+00:00'], null, 0x88FFAA, 'normal', 1);
			}
			else
			{
				sendLocalizedAnnouncement(['+01:00'], null, 0x88FFAA, 'bold', 1);
			}
			isTimeAddedShown = true; // już pokazano
		}
	}
    else
	{ // limit playTimeInMinutes = 20 minut
		if (scores.time > playTimeInMinutes*60-20 && !isTimeAddedShown)
		{ // 20s przed upływem 20 minut i nie pokazano wcześniej
			actualTimeAdded = Math.round(timeOutside/60 / 8); // piłka przebywa poza boiskiem średnio przez 25% czasu gry, stąd dzielenie przez 8, żeby nie doliczać za dużo
			if (actualTimeAdded < 60 && actualTimeAdded > -1)
			{
				sendLocalizedAnnouncement(['+00:' + leadingZero(actualTimeAdded)], null, 0x88FF88, 'bold', 1);
			}
			else if (actualTimeAdded < 0)
			{
				sendLocalizedAnnouncement(['+00:00'], null, 0x88FF88, 'normal', 1);
			}
			else
			{ // maksymalnie doliczamy minutę
				sendLocalizedAnnouncement(['+01:00'], null, 0x88FF88, 'bold', 1);
			}
			isTimeAddedShown = true; // już pokazano
		}
	}
}

function displayPossAutomatically() // onGameTick()
{ // wyświetlanie posiadania piłki co jakiś czas
	let scores = room.getScores();
	let timeLimit = scores.timeLimit;
	let trimmedTime = Math.floor(scores.time); // czas w sekundach zaokrąglony w dół
	if (trimmedTime > 0 && trimmedTime < playTimeInMinutes*60)
	{ // gra rozpoczęła się i jest przed 20. minutą
		if (trimmedTime % (autoPossIntervalInMinutes*60) === 0 && isAutoPossShown === false)
		{ // co 5 minut i nie wyświetlono przed chwilą
			possFun(); // wyświetlanie posiadania piłki
			isAutoPossShown = true; // już wyświetlono
		}
		if (trimmedTime % (autoPossIntervalInMinutes*60) > 0)
		{ // czas już nie jest wielokrotnością 5 minut
			isAutoPossShown = false; // można pokazać przypomnienie za 5 min
		}
	}
	else if (trimmedTime > playTimeInMinutes*60 + actualTimeAdded)
	{ // jest koniec doliczonego czasu
		if (isAutoPossShown === false)
		{
			possFun(); // wyświetlanie posiadania piłki
			isAutoPossShown = true; // już wyświetlono
		}
	}
}

function isOutsideLeftBound(position)
{ // za bramką czerwonych
	return position.x < -stadiumWidth;
}
function isOutsideRightBound(position)
{ // za bramką niebieskich
	return position.x > stadiumWidth;
}
function isOutsideUpBound(position)
{ // za linią górną
	return position.y < -stadiumHeight;
}
function isOutsideDownBound(position)
{ // za linią dolną
	return position.y > stadiumHeight;
}
function isOutsideStadium(position)
{ // poza boiskiem
    return isOutsideRightBound(position) || isOutsideLeftBound(position) || isOutsideDownBound(position) || isOutsideUpBound(position);
}

function handleAddedTime() // onGameTick
{ // doliczony czas
    let ballPosition = room.getBallPosition();
    if (isOutsideStadium(ballPosition))
    {
        timeOutside++; // w okresach (1/60s)
        return true;
    }
}

let isBallOutsideStadium = false;
function checkBallPosition() // onGameTick
{ // informuje o autach, rożnych itd.
    let ballPosition = room.getBallPosition();
    if (isOutsideStadium(ballPosition))
	{ // jeżeli piłka jest poza boiskiem
        if (!isBallOutsideStadium)
		{ // jeżeli piłka nie była poza boiskiem
            isBallOutsideStadium = true; // piłka była poza poiskiem
            exitingXPos = ballPosition.x;
            let totalScores = room.getScores().red + room.getScores().blue;
            if (lastScores != totalScores)
			{ // jeżeli padła bramka, to nie wyświetlamy CK i GK
                lastScores = totalScores;
                return false;
            }
            if (isOutsideRightBound(ballPosition) && lastTeamTouched == Team.RED)
			{ // czerwony wywala za linię bramkową niebieskich
                lastCall = 'GK';
				sendLocalizedAnnouncement([locStr.GK, ' ', blueTeamName], null, 0xFFFF00, 'normal', 1);
            }
			else if (isOutsideLeftBound(ballPosition) && lastTeamTouched == Team.BLUE)
			{ // niebieski wywala za linię bramkową czerwonych
                lastCall = 'GK';
				sendLocalizedAnnouncement([locStr.GK, ' ', redTeamName], null, 0xFFFF00, 'normal', 1);
            }
            else if (isOutsideRightBound(ballPosition) && lastTeamTouched == Team.BLUE)
			{ // niebieski wywala za linię bramkową niebieskich
				sendLocalizedAnnouncement([locStr.CK, ' ', redTeamName], null, 0xFFFF00, 'normal', 1);
                lastCall = 'CK';
            }
			else if (isOutsideLeftBound(ballPosition) && lastTeamTouched == Team.RED)
			{ // czerwony wywala za linię bramkową czerwonych
				sendLocalizedAnnouncement([locStr.CK, ' ', blueTeamName], null, 0xFFFF00, 'normal', 1);
                lastCall = 'CK';
            }
            else
			{ // Auty
                isBallKickedOutside = false; // oczekiwanie na wykopanie
				if (lastTeamTouched == Team.RED)
					sendLocalizedAnnouncement([locStr.OUT, ' ', blueTeamName], null, 0xFFFF00, 'normal', 1);
				else
					sendLocalizedAnnouncement([locStr.OUT, ' ', redTeamName], null, 0xFFFF00, 'normal', 1);
                lastCall = lastTeamTouched == Team.RED ? '2' : '1';
            }
        }
    }
    else
	{
        isBallOutsideStadium = false; // piłka nie jest całkowicie poza boiskiem
        backFurtherMsgCanBeShown = true; // gotowość do pokazania do przodu/do tyłu
    }
    return true;
}

function getDistanceBetweenPoints(point1, point2)
{
    let distance1 = point1.x - point2.x;
    let distance2 = point1.y - point2.y;
    return Math.sqrt(distance1 * distance1 + distance2 * distance2);
}

function isTouchingBall(player)
{ // czy gracz dotyka piłkę
	let ballPosition = room.getBallPosition();
	let distancePlayerToBall = getDistanceBetweenPoints(player.position, ballPosition);
	return distancePlayerToBall < isBackFurtherNeededDistance;
}

function getLastTouchTheBall() // onGameTick
{ // dotknięcia piłki
    for (let i = 0; i < population; i++)
	{ // dla każdego gracza
        if (players[i].position != null)
		{ // jeżeli gracz w grze
            if (isTouchingBall(players[i]))
			{ // jeżeli gracz dotyka piłkę
                if (lastPlayerTouched != null && lastPlayerTouched.id != players[i].id)
                { // jeżeli gracz nie dotknął wcześniej piłki
                    if (lastTeamTouched == players[i].team) // jeżeli ostatnia drużyna to drużyna gracza
                        assistingPlayer = lastPlayerTouched;
					else
						assistingPlayer = null; // przeciwnik nie asystuje
                }
                lastTeamTouched = players[i].team; // dotknięcie przez drużynę
                previousPlayerTouched = lastPlayerTouched;
                lastPlayerTouched = players[i];
            }
        }
    }
    return lastPlayerTouched;
}

let playersNotInLine = new Array;
function getPlayersNotWithinLine() // onPlayerBallKick
{
    console.log('getPlayersNotWithinLine');
    playersNotInLine = new Array; // tablica graczy przekraczających linię
	for (let i = 0; i < population; i++)
	{ // dla każdego gracza
		if (players[i].position != null)
		{ // jeżeli gracz jest w grze
			if (players[i].team != lastTeamTouched)
			{ // jeżeli drużyna przeciwna dotknęła ostatnia
				if (lastCall != players[i].team && lastCall != 'CK' && lastCall != 'GK')
				{ // jeżeli ostatni komunikat to aut dla przeciwnika
					if ((players[i].position.y > greenLine || players[i].position.y < -greenLine) && getDistanceBetweenPoints(room.getBallPosition(), players[i].position) < 500)
						// jeżeli gracz przekracza linię boczną i jest bliżej niż 500 od piłki
						playersNotInLine.push(players[i].name); // wpis do tablicy
				}
			}
		}
	}
}

function printPlayersLine() // isThrowInCorrect
{ // wypisywanie przekraczających
    console.log('printPlayersLine');
    for (let i = 0; i < playersNotInLine.length; i++)
    {
		let found = false;
		for (let j = 0; j < lineCrossedPlayers.length; j++)
		{
			if (lineCrossedPlayers[j].name == playersNotInLine[i])
			{
				lineCrossedPlayers[j].times = lineCrossedPlayers[j].times + 1;
				sendLocalizedAnnouncement([locStr.LINE, ' ', lineCrossedPlayers[j].name, ' {', lineCrossedPlayers[j].times, '}'], null, 0xFFCC00, 'small', 1);
				found = true;
			}
		}
		if (!found)
		{
			lineCrossedPlayers.push(
			{
				name: playersNotInLine[i],
				times: 1,
				punished: false
			});
			sendLocalizedAnnouncement([locStr.LINE, ' ', playersNotInLine[i], ' {1}'], null, 0xFFCC00, 'small', 1);
		}
    }
}

let isBackFurtherNeeded = false;
let wrongThrowPosition = false;
function isBackRequired()
{
    let ballPosition = room.getBallPosition();
    if (!isBallKickedOutside)
    { // jeżeli piłki nie wykopano z autu
		if (lastCall=='1')
		{ // R
			if ((ballPosition.x - exitingXPos > throwInLeeway) && backFurtherMsgCanBeShown==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backFurtherMsgCanBeShown = false;
				sendLocalizedAnnouncement(['<—— ', locStr.BACK], null, 0xFFFF00, 'normal', 1);
				isBackFurtherNeeded = true;
				wrongThrowPosition = true;
			}
			if ((ballPosition.x - exitingXPos < -throwInLeeway) && backFurtherMsgCanBeShown==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backFurtherMsgCanBeShown = false;
				sendLocalizedAnnouncement([locStr.FURTHER, ' ——>'], null, 0xFFFF00, 'normal', 1);
				isBackFurtherNeeded = true;
				wrongThrowPosition = true;
			}
		}
		if (lastCall=='2')
		{ // B
			if ((ballPosition.x - exitingXPos > throwInLeeway) && backFurtherMsgCanBeShown==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backFurtherMsgCanBeShown = false;
				sendLocalizedAnnouncement(['<—— ', locStr.FURTHER], null, 0xFFFF00, 'normal', 1);
				isBackFurtherNeeded = true;
				wrongThrowPosition = true;
			}
			if ((ballPosition.x - exitingXPos < -throwInLeeway) && backFurtherMsgCanBeShown==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backFurtherMsgCanBeShown = false;
				sendLocalizedAnnouncement([locStr.BACK, ' ——>'], null, 0xFFFF00, 'normal', 1);
				isBackFurtherNeeded = true;
				wrongThrowPosition = true;
			}
		}
    }
    if (lastCall=='2' && isBackFurtherNeeded && isOutsideStadium && Math.abs(exitingXPos - ballPosition.x) < throwInLeeway-20)
    {
        sendLocalizedAnnouncement([locStr.OK], null, 0xFFFF00, 'normal', 1);
        isBackFurtherNeeded = false;
        wrongThrowPosition = false;
        backFurtherMsgCanBeShown = true;
    }
    if (lastCall=='1' && isBackFurtherNeeded && isOutsideStadium && Math.abs(exitingXPos - ballPosition.x) < throwInLeeway-20)
    {
        sendLocalizedAnnouncement([locStr.OK], null, 0xFFFF00, 'normal', 1);
        isBackFurtherNeeded = false;
        wrongThrowPosition = false;
        backFurtherMsgCanBeShown = true;
    }
}

function isThrowInCorrect() // onGameTick
{
    let ballPosition = room.getBallPosition();
    let isCrossing = isBallCrossingTheLine();
    let LTTstring = lastTeamTouched.toString();

    if (isCrossing && !isBallKickedOutside && LTTstring==lastCall && (lastCall=='1' || lastCall=='2'))
    {
        if (lastCall=='2')
        {
            sendLocalizedAnnouncement([locStr.OUT, ' ', redTeamName, ' ', locStr.BAD_THROW_IN], null, 0xFFFF00, 'small', 1);
        }
        if (lastCall=='1')
        {
            sendLocalizedAnnouncement([locStr.OUT, ' ', blueTeamName, ' ', locStr.BAD_THROW_IN], null, 0xFFFF00, 'small', 1);
        }

        isBallKickedOutside == false;
    }
	else if (isCrossing && LTTstring != lastCall && (lastCall=='1' || lastCall=='2'))
    {
        sendLocalizedAnnouncement([locStr.WRONG_TEAM], null, 0xFFFF00, 'small', 1);
        wrongThrowPosition = false;
        isBackFurtherNeeded = false;
    }
	else if (isCrossing && wrongThrowPosition && LTTstring==lastCall && (lastCall=='1' || lastCall=='2'))
    {
        sendLocalizedAnnouncement([locStr.WRONG_PLACE], null, 0xFFFF00, 'small', 1);
        wrongThrowPosition = false;
        isBackFurtherNeeded = false;
    }
	else if (isCrossing)
    {
        printPlayersLine();
    }
}

function isBallCrossingTheLine()
{ // sprawdza, czy piłka przekracza linię boczną
    previousBallYPosition = ballYPosition;
    ballYPosition = room.getBallPosition().y;
    crossed = (ballYPosition < stadiumHeight && previousBallYPosition > stadiumHeight) || (ballYPosition > -stadiumHeight && previousBallYPosition < -stadiumHeight);
    return crossed;
}

function hasBallLeftTheLine() // ???
{
    let ballPosition = room.getBallPosition();
    if (ballPosition.y < outLineY && isBallKickedOutside)
    {
    }
	else if (ballPosition.y > outLineY && isBallKickedOutside && lastPlayerTouched.id == previousPlayerTouched.id)
    {
        //sendLocalizedAnnouncement(['kruwa co robiła ta funkcja'], null, 0xFFFF00, 'normal', 1);
		console.log('hasBallLeftTheLine (kruwa)');
    }
}

/*
	****************************** Komendy ******************************
*/
let commands =
{ // komendy nie rozróżniają wielkości liter, jeśli któraś zostanie wykryta, jest zamieniana na WIELKIE LITERY
    // Proste
	'!POSS': possFun,
	
    // Gracz
	'!PL': plFun,
	'!EN': enFun,
	'!DEOP': unAdminFun,
	'!RESIGN': unAdminFun,
	'!P': pauseFun,
	'!BB': exitFun,
	'!LEAVE': exitFun,
	'!GETBALL': getBallFun,
	'!GETDISCCOUNT': getDiscCountFun,
	
	// Gracz i argumenty
    '!OP': adminFun, // KOMENDA DO UZYSKANIA ADMINA
	'!GETDISC': getDiscFun,
	'!GETPLAYER': getPlayerFun,

    // Admin
	'!CB': clearBansFun,
	'!AUTOPOSS': AutoPossSwitchFun,
	'!DROPPEDBALL': droppedBallFun,
	'!RZUTSĘDZIOWSKI': droppedBallFun,

	// Admin i argumenty
	'!TRED': teamRedNameFun,
	'!TBLUE': teamBlueNameFun,
	'!L': loadFun,
	'!LOAD': loadFun,
	'!E': eFun,
	'!SETDISC': setDiscFun,
	'!SETPLAYER': setPlayerFun,
	'!SETBALL': setBallFun,
	'!BALLCOLOR': setStableBallColorFun
}

// Proste
function possFun()
{ // !poss
	if (redPossessionTicks + bluePossessionTicks == 0) // Trzeba pamiętać o dziedzinie
		return false;
	let redPossessionPercentage = Math.round(redPossessionTicks / (redPossessionTicks+bluePossessionTicks) * 100);
	let bluePossessionPercentage = 100 - redPossessionPercentage;
	if (room.getScores() != null) // mecz trwa
		sendLocalizedAnnouncement([locStr.BALL_POSS, ': ', redTeamName, ' ', redPossessionPercentage, ' % ', bluePossessionPercentage, ' ', blueTeamName], null, 0xCCFF00, 'normal', 1);
	else
		sendLocalizedAnnouncement([locStr.LAST_BALL_POSS, ': ' + redTeamName, ' ', redPossessionPercentage, ' % ', bluePossessionPercentage, ' ', blueTeamName], null, 0xCCFF00, 'normal', 1);
}

// Gracz
function plFun(player)
{
	setPlayerLanguage(player, 'pl');
	sendLocalizedAnnouncement(['Polski'], player.id, 0xFFFF00, 'small', 1);
}

function enFun(player)
{
	setPlayerLanguage(player, 'en');
	sendLocalizedAnnouncement(['English'], player.id, 0xFFFF00, 'small', 1);
}

function unAdminFun(player)
{ // !deop
    // Rezygnacja
    room.setPlayerAdmin(player.id, false);
    return false; // Wiadomość nie będzie wyświetlona
}

function pauseFun(player)
{ // !p
	if (player.team == 0 || room.getScores() == null) // ławka nie może pauzować
		return false;
	if (isPaused)
		room.pauseGame(false); // wznowienie gry
	else
		room.pauseGame(true); // wstrzymanie gry
}

function exitFun(player)
{ // !bb, !leave
	room.kickPlayer(player.id, '🔻 ' + player.name + ' wychodzi', false);
}

function getBallFun(player)
{ // !getball
	sendLocalizedAnnouncement(['Kulka: ' + JSON.stringify(room.getDiscProperties(0)).split(',').join(', ')], player.id, 0x5588FF, 'normal', 1);
	console.log('Kulka: ' + JSON.stringify(room.getDiscProperties(0)).split(',').join(', '));
	return false;
}

function getDiscCountFun(player)
{ // !getdisccount
	sendLocalizedAnnouncement(['Liczba dysków: ' + room.getDiscCount()], player.id, 0x5588FF, 'normal', 1);
	console.log('Liczba dysków: ' + room.getDiscCount());
	return false;
}

// Gracz i argumenty
function adminFun(player, arg)
{ // !op <hasło>
    // Daje wpisującemu admina
	if (arg === adminPassword)
		room.setPlayerAdmin(player.id, true);
    return false;
}

function getDiscFun(player, arg)
{ // !getdisc 0
	sendLocalizedAnnouncement(['Dysk ' + arg + ': ' + JSON.stringify(room.getDiscProperties(arg)).split(',').join(', ')], player.id, 0x5588FF, 'normal', 1);
	console.log('Dysk ' + arg + ': ' + JSON.stringify(room.getDiscProperties(arg)).split(',').join(', '));
	return false;
}

function getPlayerFun(player, arg)
{ // !getplayer 0
	sendLocalizedAnnouncement(['Gracz ' + arg + ': ' + JSON.stringify(room.getPlayerDiscProperties(arg)).split(',').join(', ')], player.id, 0x5588FF, 'normal', 1);
	console.log('Gracz ' + arg + ': ' + JSON.stringify(room.getPlayerDiscProperties(arg)).split(',').join(', '));
	return false;
}

// Admin
function clearBansFun(player)
{ // !cb
    if (player.admin === true)
	{
		room.clearBans();
		sendLocalizedAnnouncement(['✔', locStr.BANS_CLEARED], null, 0x00FF00, 'normal', 1);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
}

function AutoPossSwitchFun(player)
{ // !autoposs
	if (player.admin === true)
	{
		isAutoPossEnabled = !isAutoPossEnabled;
		sendLocalizedAnnouncement(['Automatyczne wyświetlanie posiadania piłki ', (isAutoPossEnabled ? 'włączone' : 'wyłączone')], player.id, 0xFFFF00, 'normal', 1);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
	return false;
}

function droppedBallFun(player)
{ // !rzutsędziowski
	// Przydatne, na wypadek bezpowrotnego wybicia piłki poza mapę na mapach power
	if (player.admin === true)
	{
		if (room.getScores() != null)
		{ // jeżeli gra trwa
			room.setDiscProperties(0, {x: 0, y: 0}); // umieszczenie piłki na środku boiska
			sendLocalizedAnnouncement([locStr.DROPPED_BALL, '!'], null, 0xFFFF00, 'bold', 1);
		}
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
	return true;
}

// Admin i argumenty
function teamRedNameFun(player, arg)
{ // !tred R
	if (player.admin === true)
	{
		redTeamName = redTeamPrefix + '' + ignore(arg);
		sendLocalizedAnnouncement([locStr.RED_ARE, ': ', redTeamName], player.id, 0xFFFF00, 'normal', 0);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
	return false;
}

function teamBlueNameFun(player, arg)
{ // !tblue B
	if (player.admin === true)
	{
		blueTeamName = blueTeamPrefix + '' + ignore(arg);
		sendLocalizedAnnouncement([locStr.BLUE_ARE, ': ', blueTeamName], player.id, 0xFFFF00, 'normal', 0);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
	return false;
}

function loadFun(player, arg)
{ // !l rs
	if (player.admin === true)
	{
		arg = ignore(arg);
		if (maps[arg] != undefined)
			room.setCustomStadium(maps[arg]);
		else
			sendLocalizedAnnouncement(['⛔', locStr.NO_MAP ,': ', arg, '. ', locStr.TYPO_POSSIBLE], player.id, 0xFFCC00, 'normal', 1);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
}

function eFun(player, arg)
{ // !e
	if (player.admin === true)
	{
		sendLocalizedAnnouncement([player.name + ': ' + arg], null, 0xCC55FF, 'bold', 2);
	}
	else
		sendLocalizedAnnouncement([locStr.QUIET_E], player.id, 0xFFCC00, 'normal', 1);
	return false;
}

function setDiscFun(player, arg)
{ // !setdisc 0 x 0
	if (player.admin === true)
	{
		let ktory;
		let co;
		let ileRaw;
		let ile;
		
		let spacePos = arg.search(' ');
		if (spacePos > -1)
		{
			ktory = parseInt(arg.substr(0, spacePos)); // |0| x 0
			
			let arg2 = arg.substr(spacePos+1, arg.length); // 0 |x 0|
			let spacePos2 = arg2.search(' ');
			if (spacePos2 > -1)
			{
				co = arg2.substr(0, spacePos2); // |x| 0
				ileRaw = arg2.substr(spacePos2 + 1, arg2.length); // x |0|
				if (ignore(ileRaw).substr(0, 2) === '0X') // czy wartość jest szesnastkowa (np. przy ustawianiu koloru)
					ile = parseInt(ileRaw);
				else
					ile = parseFloat(ileRaw);
			}
		}
		else
		{
			sendLocalizedAnnouncement([locStr.FAILED], player.id, 0xFFCC00, 'normal', 1);
			return;
		}
		let coIle = {};
		coIle[co] = ile; // {x: 0}
		room.setDiscProperties(ktory, coIle); // (0, {x: 0})
		
		sendLocalizedAnnouncement(['Dysk: ' + ktory + ' ma teraz wartość: ' + co + ' równą: ' + ile], player.id, 0x5588FF, 'normal', 1);
		console.log('Dysk: ' + ktory + ' ma teraz wartość: ' + co + ' równą: ' + ile);
	}
	return false;
}

function setPlayerFun(player, arg)
{ // !setplayer 0 x 0
	if (player.admin === true)
	{
		let id;
		let co;
		let ileRaw;
		let ile;
		
		let spacePos = arg.search(' ');
		if (spacePos > -1)
		{
			id = parseInt(arg.substr(0, spacePos));
			
			let arg2 = arg.substr(spacePos+1, arg.length);
			let spacePos2 = arg2.search(' ');
			if (spacePos2 > -1)
			{
				co = arg2.substr(0, spacePos2);
				ileRaw = arg2.substr(spacePos2 + 1, arg2.length);
				if (ignore(ileRaw).substr(0, 2) === '0X')
					ile = parseInt(ileRaw);
				else
					ile = parseFloat(ileRaw);
			}
		}
		else
		{
			sendLocalizedAnnouncement([locStr.FAILED], player.id, 0xFFCC00, 'normal', 1);
			return;
		}
		let coIle = {};
		coIle[co] = ile;
		room.setPlayerDiscProperties(id, coIle);
		
		sendLocalizedAnnouncement(['Dysk gracza: ' + id + ' ma teraz wartość: ' + co + ' równą: ' + ile], player.id, 0x5588FF, 'normal', 1);
		console.log('Dysk gracza: ' + id + ' ma teraz wartość: ' + co + ' równą: ' + ile);
	}
	return false;
}

function setBallFun(player, arg)
{ // !setball x 0
	let arg2 = '0 ' + arg;
	setDiscFun(player, arg2);
	return false;
}

function setStableBallColorFun(player, arg)
{ // !ballcolor 0xffffff
	if (player.admin === true)
	{
		ballColor = parseInt(arg);
		room.setDiscProperties(0, {color: ballColor});
		sendLocalizedAnnouncement([locStr.BALL_COLOR_CHANGED_TO, ': ' + ballColor], player.id, 0xFFFF00, 'normal', 1);
	}
	else
		sendLocalizedAnnouncement(['⛔', locStr.NOT_ALLOWED], player.id, 0xFF3300, 'normal', 1);
}

/*
	****************************** Zdarzenia ******************************
*/
room.onPlayerJoin = function(player)
{
    console.log(player.name + '#' + player.id + ' wchodzi');
	updatePlayerList();
	initBijacze(player);
	setPlayerLanguage(player, 'pl');
}

room.onPlayerLeave = function(player)
{
	console.log(player.name + '#' + player.id + ' wychodzi');
	updatePlayerList();
}

let tickCount = 0;
room.onGameTick = function()
{
    updatePlayerList();
	reactToBallRadiusChange();
	isThrowInCorrect();
    getLastTouchTheBall();
    checkBallPosition();
    isBackRequired();
    hasBallLeftTheLine();
    handleAddedTime();
    displayAddedTime();
	if (isAutoPossEnabled)
		displayPossAutomatically();
	
	// Posiadanie piłki - okresy
	if (lastTeamTouched == Team.RED)
		redPossessionTicks++;
	else if (lastTeamTouched == Team.BLUE)
		bluePossessionTicks++;

    tickCount++;
}

room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer)
{
	if (ban)
	{
		if (byPlayer == null)
			console.log(kickedPlayer.name + '#' + kickedPlayer.id + ' ZBANOWANY (' + reason + ')');
		else
			console.log(kickedPlayer.name + '#' + kickedPlayer.id + ' ZBANOWANY przez: '
			+ byPlayer.name + '#' + byPlayer.id + ' (' + reason + ')');
		// Banowanie nie samego siebie i nie przez sędziego
		if (byPlayer.id !== kickedPlayer.id && byPlayer.id !== 0 && byPlayer != null)
		{
			//sendLocalizedAnnouncement([locStr.BAN_AFTERMATH], null, 0xFF4900, 'small', 0);
			// ilość banów przez byPlayer zwiększona o 1
			bijacze.set(byPlayer.name, bijacze.get(byPlayer.name) + 1);
		}
	}
	else
	{
		if (byPlayer == null)
			console.log(kickedPlayer.name + '#' + kickedPlayer.id + ' wykopany (' + reason + ')');
		else
			console.log(kickedPlayer.name + '#' + kickedPlayer.id + ' wykopany przez: '
			+ byPlayer.name + '#' + byPlayer.id + ' (' + reason + ')');
	}
}

room.onPlayerAdminChange = function(changedPlayer, byPlayer)
{
	// gracz changedPlayer jest brany po zmianie
	updatePlayerList();
	if (changedPlayer.admin)
	{
		if (byPlayer == null)
			console.log(changedPlayer.name + '#' + changedPlayer.id + ' uzyskuje admina');
		else
			console.log(changedPlayer.name + '#' + changedPlayer.id + ' uzyskuje admina od: '
			+ byPlayer.name + '#' + byPlayer.id);
	}
	else
	{
		if (byPlayer == null)
			console.log(changedPlayer.name + '#' + changedPlayer.id + ' TRACI admina');
		else
			console.log(changedPlayer.name + '#' + changedPlayer.id + ' TRACI admina przez: '
			+ byPlayer.name + '#' + byPlayer.id);
	}
}

room.onGameStart = function(byPlayer)
{
    if (byPlayer == null)
		console.log('Gra rozpoczęta');
	else
		console.log('Gra rozpoczęta przez: ' + byPlayer.name + '#' + byPlayer.id);
	
	reactToBallRadiusChange();
	lastTeamTouched = 0;
	lineCrossedPlayers = [{name: 'temp', times: 0}];
    lastScores = room.getScores().red + room.getScores().blue;
    timeOutside = 0;
    isTimeAddedShown = false;
	isAutoPossShown = false;
    ballYPosition = 0;
	redPossessionTicks = 0;
	bluePossessionTicks = 0;
	
	room.setDiscProperties(0, {color: ballColor}); // piłka zmienia kolor na ustalony
	
	room.startRecording();
	isRecording = true;
}

room.onGameStop = function(byPlayer)
{
	if (byPlayer == null)
		console.log('Gra przerwana');
	else
		console.log('Gra przerwana przez: ' + byPlayer.name + '#' + byPlayer.id);
	isPaused = false;
	replays[replayNumber] = room.stopRecording();
	isRecording = false;
	replayNumber++;
}

room.onGamePause = function(byPlayer)
{
    if (byPlayer == null)
		console.log('Gra zatrzymana');
	else
		console.log('Gra zatrzywana przez: ' + byPlayer.name + '#' + byPlayer.id);
	isPaused = true;
}

room.onGameUnpause = function(byPlayer)
{
    if (byPlayer == null)
		console.log('Gra wznowiona');
	else
		console.log('Gra wznowiona przez: ' + byPlayer.name + '#' + byPlayer.id);
	isPaused = false;
}

// Zmiana drużyny
room.onPlayerTeamChange = function(changedPlayer, byPlayer)
{
    if (byPlayer == null)
		console.log(changedPlayer.name + '#' + changedPlayer.id + ' zmienia stronę');
	else
		console.log(changedPlayer.name + '#' + changedPlayer.id + ' zmienia stronę przez: '
		+ byPlayer.name + '#' + byPlayer.id);
}

room.onPlayerBallKick = function(byPlayer)
{ // KOPNIĘCIE PIŁKI
    let ballPosition = room.getBallPosition();
    if (lastPlayerTouched != null && byPlayer.id != lastPlayerTouched.id)
    { // jeżeli ostatni gracz istnieje i gracz nie jest ostatnim graczem (nie asystuje samemu sobie)
        if (lastTeamTouched == byPlayer.team) // jeżeli ostatnia drużyna to drużyna gracza
            assistingPlayer = lastPlayerTouched;
		else assistingPlayer = null; // przeciwnik nie asystuje
    }
    previousPlayerTouched = lastPlayerTouched;
    lastPlayerTouched = byPlayer;
    lastTeamTouched = byPlayer.team;

    if (isBallOutsideStadium)
        getPlayersNotWithinLine();
    if (isBallOutsideStadium && ballPosition.y < 0)
        isBallKickedOutside = true;
	else if (isBallOutsideStadium && ballPosition.y > 0)
        isBallKickedOutside = true;
	else isBallKickedOutside = false;
}

// jeżeli samobój
let isOwnGoal = (team, player) => team !== player.team ? locStr.OG : '';
// lepsze wyświetlanie sekundy
let leadingZero = s => s < 10 ? '0' + s : s;
room.onTeamGoal = function(team)
{ // Kto i kiedy strzelił
    let time = room.getScores().time;
    let m = Math.trunc(time / 60);
	let s = Math.trunc(time % 60);
    time = m + ':' + leadingZero(s); // mm:ss
	
	if (lastPlayerTouched != null)
	{
		let ownGoal = isOwnGoal(team, lastPlayerTouched);
		let assist = '';
		// asysta
		if (ownGoal === '' && assistingPlayer != null && assistingPlayer.id != lastPlayerTouched.id)
		{
			assist = ' (' + assistingPlayer.name + ') ';
		}
		
		sendLocalizedAnnouncement(['⚽', teamIcon(team), ' ', time, ' ', lastPlayerTouched.name,
		assist, ' ', ownGoal], null, 0xFFFF00, 'normal', 1);
	}
	else
	{
		sendLocalizedAnnouncement(['⚽', teamIcon(team), ' ', time, ' '], null, 0xFFFF00, 'normal', 1);
	}
}

room.onPositionsReset = function()
{
	reactToBallRadiusChange();
	room.setDiscProperties(0, {color: ballColor}); // piłka zmienia kolor na ustalony
}

room.onTeamVictory = function(scores)
{
	console.log(scores.red + ':' + scores.blue);
}

room.onPlayerActivity = function(player)
{
	if (player != null)
	{
		
	}
}

room.onPlayerChat = function(player, message)
{	
	console.log(player.name + '#' + player.id + ': ' + message);

	let spacePos = message.search(' ');
	// Komenda do spacji - !k 0 - Argument po spacji
	//                     ^^ ^
	let command = message.substr(0, spacePos !== -1 ? spacePos : message.length);
	let arg = message.substr(command.length + 1, message.length);
	
	// komenda ze słownika zamieniona na WIELKIE LITERY
	if (commands.hasOwnProperty(command.toLocaleUpperCase(locale)) === true)
		return commands[command.toLocaleUpperCase(locale)](player, arg);
}

room.onStadiumChange = function(newStadiumName, byPlayer)
{
    if (byPlayer == null)
		console.log('Stadion zmieniony na: ' + newStadiumName);
	else
		console.log('Stadion zmieniony na: ' + newStadiumName + ' przez: ' + byPlayer.name);
}

room.onRoomLink = function(url)
{
	console.log('Url: ' + url);
}
