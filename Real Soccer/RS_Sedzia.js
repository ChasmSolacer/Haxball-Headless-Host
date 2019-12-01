/***************************************************************************************************************************************************************************

Aby uzyskać uprawnienia administratora należy (domyślnie) wpisać !opqwerty. Zalecana jest zmiana nazwy tej komendy (linijka 520)

PRZYDATNE KOMENDY DLA ADMINÓW:

!tred <nazwa>: Ustawia nazwę drużyny czerwonych. Domyślnie jest pusta. Będzie wyświetlana, gdy bot wskaże wykonawcę stałego fragmentu gry np. "Rzut rożny dla [🔴R] <nazwa>"
!tblue <nazwa>: Jak wyżej, tylko dla niebieskich.
!load rs: Mapa RS
!load pens: Mapa do rzutów karnych

Sędzia określa, co ma się stać, gdy piłka wyjdzie za boisko oraz zapisuje strzelców i im asystujących

***************************************************************************************************************************************************************************/

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
let stadiumWidth = 1150;
let stadiumHeight = 600;
let ballRadius = 9.8;
let throwInLeeway = 350;
let greenLine = 510;

/* USTAWIENIA */
let triggerDistance = ballRadius + 15 + 0.01;
let outLineY = stadiumWidth - (ballRadius / 2) + 6;
stadiumWidth += (ballRadius / 2) + 6;
stadiumHeight += (ballRadius / 2) + 6;

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

let lastScores = 0;
let lastTeamTouched = 0;
let lineBallPosition;
let exitingPos = null;
let previousBallPos;
let lastPlayerTouched = null;
let previousPlayerTouched = null;
let assistingPlayer = null;
let backMSG = false;
let lastCall;
let isBallUp = false;
let crossed = false;
let lineCrossedPlayers = [{name: 'temp', times: 0}];
let isBallKickedOutside = false;
let timeOutside = 0;
let playTimeInMinutes = 20; // Przy limicie czasu 0, mecz domyślnie trwa 20 minut
let isTimeAddedShown = false;
let actualTimeAdded;
let redPossessionTicks = 0;
let bluePossessionTicks = 0;

// Mapy
let maps = 
{
	'RS': '{"name":"Real Soccer 1.3D by RawR","width":1300,"height":670,"bg":{"type":"grass","width":1150,"height":600,"kickOffRadius":180},"vertexes":[{"x":0,"y":700,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-700,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":1150,"y":255,"cMask":[]},{"x":840,"y":255,"cMask":[]},{"x":1150,"y":-255,"cMask":[]},{"x":840,"y":-255,"cMask":[]},{"x":1150,"y":155,"cMask":[]},{"x":1030,"y":155,"cMask":[]},{"x":1150,"y":-155,"cMask":[]},{"x":1030,"y":-155,"cMask":[]},{"x":840,"y":-135,"cMask":[]},{"x":840,"y":135,"cMask":[]},{"x":-1150,"y":-255,"cMask":[]},{"x":-840,"y":-255,"cMask":[]},{"x":-1150,"y":255,"cMask":[]},{"x":-840,"y":255,"cMask":[]},{"x":-1150,"y":-155,"cMask":[]},{"x":-1030,"y":-155,"cMask":[]},{"x":-1150,"y":155,"cMask":[]},{"x":-1030,"y":155,"cMask":[]},{"x":-840,"y":135,"cMask":[]},{"x":-840,"y":-135,"cMask":[]},{"x":935,"y":4,"cMask":[]},{"x":935,"y":-4,"cMask":[]},{"x":-935,"y":4,"cMask":[]},{"x":-935,"y":-4,"cMask":[]},{"x":-1150,"y":525,"bCoef":0,"cMask":["wall"]},{"x":-1075,"y":600,"bCoef":0,"cMask":["wall"]},{"x":-1075,"y":-600,"bCoef":0,"cMask":["wall"]},{"x":-1150,"y":-525,"bCoef":0,"cMask":["wall"]},{"x":1075,"y":600,"bCoef":0,"cMask":["wall"]},{"x":1150,"y":525,"bCoef":0,"cMask":["wall"]},{"x":1150,"y":-525,"bCoef":0,"cMask":["wall"]},{"x":1075,"y":-600,"bCoef":0,"cMask":["wall"]},{"x":-1150,"y":127,"cMask":[]},{"x":-1214,"y":124,"cMask":[]},{"x":-1150,"y":-127,"cMask":[]},{"x":-1214,"y":-124,"cMask":[]},{"x":1150,"y":127,"cMask":[]},{"x":1214,"y":124,"cMask":[]},{"x":1150,"y":-127,"cMask":[]},{"x":1214,"y":-124,"cMask":[]},{"x":0,"y":-4,"cMask":[]},{"x":0,"y":4,"cMask":[]},{"x":0,"y":-4,"cMask":[]},{"x":0,"y":4,"cMask":[]},{"x":-1214,"y":124,"cMask":[]},{"x":-1250,"y":150,"cMask":[]},{"x":-1214,"y":-124,"cMask":[]},{"x":-1250,"y":-150,"cMask":[]},{"x":1214,"y":124,"cMask":[]},{"x":1250,"y":150,"cMask":[]},{"x":1214,"y":-124,"cMask":[]},{"x":1250,"y":-150,"cMask":[]},{"x":-1185,"y":155,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":255,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":155,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":255,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":-155,"bCoef":-4.5,"cMask":["ball"]},{"x":-1185,"y":-255,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":-155,"bCoef":-4.5,"cMask":["ball"]},{"x":1185,"y":-255,"bCoef":-4.5,"cMask":["ball"]},{"x":1158,"y":-607,"bCoef":-2.45,"cMask":["ball"]},{"x":1187,"y":-578,"bCoef":-2.45,"cMask":["ball"]},{"x":1158,"y":607,"bCoef":-2.45,"cMask":["ball"]},{"x":1187,"y":578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1158,"y":607,"bCoef":-2.45,"cMask":["ball"]},{"x":-1187,"y":578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1158,"y":-607,"bCoef":-2.45,"cMask":["ball"]},{"x":-1187,"y":-578,"bCoef":-2.45,"cMask":["ball"]},{"x":-1190,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1190,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":-1180,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":-255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":-155,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":255,"bCoef":-1,"cMask":["ball"]},{"x":1190,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":1180,"y":155,"bCoef":-1,"cMask":["ball"]},{"x":-1148,"y":-525,"cMask":[]},{"x":1148,"y":-525,"cMask":[]},{"x":-1148,"y":525,"cMask":[]},{"x":1148,"y":525,"cMask":[]},{"x":-1150,"y":-260,"cMask":[]},{"x":-840,"y":-600,"cMask":[]},{"x":-1150,"y":260,"cMask":[]},{"x":-840,"y":600,"cMask":[]},{"x":-840,"y":-1150,"cMask":[]},{"x":1150,"y":-260,"cMask":[]},{"x":840,"y":-600,"cMask":[]},{"x":1150,"y":260,"cMask":[]},{"x":840,"y":600,"cMask":[]}],"segments":[{"v0":37,"v1":39,"bCoef":0.1,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":43,"v1":41,"bCoef":0.1,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":4,"v1":5,"cMask":[],"color":"C7E6BD"},{"v0":5,"v1":7,"cMask":[],"color":"C7E6BD"},{"v0":6,"v1":7,"cMask":[],"color":"C7E6BD"},{"v0":8,"v1":9,"cMask":[],"color":"C7E6BD"},{"v0":9,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":10,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":13,"v1":12,"curve":130,"curveF":0.4663076581549986,"cMask":[],"color":"C7E6BD"},{"v0":14,"v1":15,"cMask":[],"color":"C7E6BD"},{"v0":15,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":18,"v1":19,"cMask":[],"color":"C7E6BD"},{"v0":19,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":20,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":23,"v1":22,"curve":130,"curveF":0.4663076581549986,"cMask":[],"color":"C7E6BD"},{"v0":25,"v1":24,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":27,"v1":26,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":25,"v1":24,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":27,"v1":26,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":27,"cMask":[],"color":"C7E6BD"},{"v0":28,"v1":29,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":30,"v1":31,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":32,"v1":33,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":34,"v1":35,"bCoef":0,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["wall"],"color":"C7E6BD"},{"v0":36,"v1":37,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":39,"v1":38,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":41,"v1":40,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":42,"v1":43,"cMask":["red","blue","ball"],"color":"FFFFFF"},{"v0":45,"v1":44,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":46,"v1":47,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":45,"v1":44,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":46,"v1":47,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":[],"color":"C7E6BD"},{"v0":48,"v1":49,"cMask":[],"color":"FFFFFF"},{"v0":50,"v1":51,"cMask":[],"color":"FFFFFF"},{"v0":52,"v1":53,"cMask":[],"color":"FFFFFF"},{"v0":54,"v1":55,"cMask":[],"color":"FFFFFF"},{"v0":56,"v1":57,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":59,"v1":58,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":61,"v1":60,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":62,"v1":63,"bCoef":-4.7,"curve":40,"curveF":2.7474774194546225,"cMask":["ball"],"color":"BEB86C"},{"v0":65,"v1":64,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":66,"v1":67,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":69,"v1":68,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":70,"v1":71,"bCoef":-2.45,"curve":59.99999999999999,"curveF":1.7320508075688774,"cMask":["ball"],"color":"BEB86C"},{"v0":0,"v1":1,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":1,"v1":2,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":2,"v1":1,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":2,"v1":3,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":72,"v1":73,"bCoef":-1,"cMask":["ball"]},{"v0":74,"v1":75,"bCoef":-1,"cMask":["ball"]},{"v0":76,"v1":77,"bCoef":-1,"cMask":["ball"]},{"v0":78,"v1":79,"bCoef":-1,"cMask":["ball"]},{"v0":80,"v1":81,"bCoef":-1,"cMask":["ball"]},{"v0":82,"v1":83,"bCoef":-1,"cMask":["ball"]},{"v0":84,"v1":85,"bCoef":-1,"cMask":["ball"]},{"v0":86,"v1":87,"bCoef":-1,"cMask":["ball"]},{"v0":88,"v1":89,"cMask":[],"color":"5E844D"},{"v0":90,"v1":91,"cMask":[],"color":"5E844D"},{"v0":93,"v1":92,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":94,"v1":95,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":97,"v1":98,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"},{"v0":100,"v1":99,"curve":100,"curveF":0.83909963117728,"cMask":[],"color":"5E844D"}],"planes":[{"normal":[0,1],"dist":-635,"bCoef":0,"cMask":["ball"]},{"normal":[0,-1],"dist":-635,"bCoef":0,"cMask":["ball"]},{"normal":[0,1],"dist":-670,"bCoef":0},{"normal":[0,-1],"dist":-670,"bCoef":0},{"normal":[1,0],"dist":-1300,"bCoef":0},{"normal":[-1,0],"dist":-1300,"bCoef":0.1},{"normal":[1,0],"dist":-1214,"bCoef":0,"cMask":["ball"]},{"normal":[-1,0],"dist":-1214,"bCoef":0,"cMask":["ball"]}],"goals":[{"p0":[-1160,-124],"p1":[-1160,124],"team":"red"},{"p0":[1160,124],"p1":[1160,-124],"team":"blue"}],"discs":[{"radius":9.8,"invMass":1.05,"cGroup":["ball","kick","score"]},{"pos":[-1150,127],"radius":5,"invMass":0,"color":"FF0000"},{"pos":[-1150,-127],"radius":5,"invMass":0,"color":"FF0000"},{"pos":[1150,127],"radius":5,"invMass":0,"color":"FF"},{"pos":[1150,-127],"radius":5,"invMass":0,"color":"FF"},{"pos":[-1250,150],"radius":3,"bCoef":3,"invMass":0,"color":"FF0000","cMask":[]},{"pos":[-1250,-150],"radius":3,"bCoef":3,"invMass":0,"color":"FF0000","cMask":[]},{"pos":[1250,150],"radius":3,"bCoef":3,"invMass":0,"color":"FF","cMask":[]},{"pos":[1250,-150],"radius":3,"bCoef":3,"invMass":0,"color":"FF","cMask":[]},{"pos":[-1150,-600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[-1150,600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[1150,-600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]},{"pos":[1150,600],"radius":2,"bCoef":-0.1,"invMass":0,"cMask":["ball"]}],"playerPhysics":{"acceleration":0.12,"kickStrength":5.65},"ballPhysics":"disc0","spawnDistance":500}',
	'PENS': '{"name":"Penalty 1.1 Mod from HaxMaps","width":420,"height":200,"bg":{"type":"grass","width":500,"height":250,"kickOffRadius":10},"vertexes":[{"x":420,"y":600,"cMask":["ball"]},{"x":420,"y":-600,"cMask":["ball"]},{"x":283,"y":500,"bCoef":0,"cMask":["blue"]},{"x":283,"y":-500,"bCoef":0,"cMask":["blue"]},{"x":335,"y":500,"bCoef":0,"cMask":["blue"]},{"x":335,"y":-500,"bCoef":0,"cMask":["blue"]},{"x":-475,"y":-200,"bCoef":0,"cMask":["red"]},{"x":-10,"y":-190,"bCoef":0,"cMask":["red"]},{"x":-10,"y":190,"bCoef":0,"cMask":["red"]},{"x":-475,"y":200,"bCoef":0,"cMask":["red"]},{"x":300,"y":-250,"cMask":[]},{"x":300,"y":250,"cMask":[]},{"x":0,"y":9,"cMask":[]},{"x":0,"y":-9,"cMask":[]},{"x":0,"y":9,"cMask":[]},{"x":0,"y":-9,"cMask":[]},{"x":175,"y":-175,"cMask":[]},{"x":300,"y":-175,"cMask":[]},{"x":175,"y":175,"cMask":[]},{"x":300,"y":175,"cMask":[]},{"x":-120,"y":-250,"cMask":[]},{"x":-120,"y":250,"cMask":[]},{"x":-120,"y":-190,"cMask":[]},{"x":-120,"y":190,"cMask":[]},{"x":300,"y":-100,"cMask":[]},{"x":350,"y":-98,"cMask":[]},{"x":350,"y":98,"cMask":[]},{"x":300,"y":100,"cMask":[]},{"x":0,"y":-15,"bCoef":-2.4,"cMask":["ball"]},{"x":0,"y":15,"bCoef":-2.4,"cMask":["ball"]},{"x":400,"y":-135,"cMask":[]},{"x":400,"y":135,"cMask":[]}],"segments":[{"v0":0,"v1":1,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bCoef":0,"vis":false,"cMask":["blue"]},{"v0":4,"v1":5,"bCoef":0,"vis":false,"cMask":["blue"]},{"v0":6,"v1":7,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":7,"v1":8,"bCoef":0,"curve":50,"curveF":2.1445069205095586,"vis":false,"cMask":["red"]},{"v0":8,"v1":9,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":9,"v1":6,"bCoef":0,"vis":false,"cMask":["red"]},{"v0":10,"v1":11,"cMask":[],"color":"C7E6BD"},{"v0":13,"v1":12,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":14,"v1":15,"curve":180,"curveF":6.123233995736766e-17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":17,"cMask":[],"color":"C7E6BD"},{"v0":16,"v1":18,"cMask":[],"color":"C7E6BD"},{"v0":18,"v1":19,"cMask":[],"color":"C7E6BD"},{"v0":20,"v1":21,"cMask":[],"color":"C7E6BD"},{"v0":23,"v1":22,"curve":140,"curveF":0.36397023426620245,"cMask":[],"color":"C7E6BD"},{"v0":24,"v1":25,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":25,"v1":26,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":26,"v1":27,"bCoef":0.1,"curve":10,"curveF":11.430052302761343,"cMask":["red","blue","ball"],"color":"C7E6BD"},{"v0":28,"v1":29,"bCoef":-2.4,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["ball"],"color":"C7E6BD"},{"v0":25,"v1":30,"cMask":[],"color":"C7E6BD"},{"v0":26,"v1":31,"cMask":[],"color":"C7E6BD"}],"planes":[{"normal":[0,1],"dist":-200,"cMask":["ball"]},{"normal":[0,-1],"dist":-200,"cMask":["ball"]},{"normal":[0,1],"dist":-250,"bCoef":0.1},{"normal":[0,-1],"dist":-250,"bCoef":0.1},{"normal":[1,0],"dist":-400,"bCoef":0.1},{"normal":[-1,0],"dist":-400,"bCoef":0.1}],"goals":[{"p0":[310,100],"p1":[310,-100],"team":"blue"},{"p0":[300,100],"p1":[-400,100],"team":"red"},{"p0":[300,-100],"p1":[-400,-100],"team":"red"},{"p0":[-10,250],"p1":[-10,-250],"team":"red"}],"discs":[{"cGroup":["ball","kick","score"]},{"pos":[300,100],"radius":5,"bCoef":1.3,"invMass":0},{"pos":[300,-100],"radius":5,"bCoef":1.3,"invMass":0},{"pos":[400,-135],"radius":3,"bCoef":1,"invMass":0},{"pos":[400,135],"radius":3,"bCoef":1,"invMass":0}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":300}'
};

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

// Ikony drużyn
function teamIcon(team)
{ // uwaga: mogą być u niektórych wyświetlane jako kwadraty lub czarno-białe, nie polegać wyłącznie na nich
	if (team === Team.RED)
		return '🔴'; // czerwony
	else if (team === Team.BLUE)
		return '🔵'; // niebieski
	else return '⬜'; // ławka
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
				room.sendAnnouncement('+00:' + leadingZero(actualTimeAdded), null, 0x88FF88, 'bold', 1);
			}
			else if (actualTimeAdded < 0)
			{
				room.sendAnnouncement('+00:00', null, 0x88FF88, 'normal', 1);
			}
			else
			{
				room.sendAnnouncement('+01:00', null, 0x88FF88, 'bold', 1);
			}
			isTimeAddedShown = true; // już pokazano
		}
	}
    else
	{ // limit playTimeInMinutes = 20 minut
		if (scores.time > playTimeInMinutes*60-20 && !isTimeAddedShown)
		{ // 20s przed upływem 20 minut i nie pokazano wcześniej
			actualTimeAdded = Math.round(timeOutside/60 / 8); // piłka przebywa poza boiskiem średnio przez 25% czasu gry, stąd dzielenie przez 8
			if (actualTimeAdded < 60 && actualTimeAdded > -1)
			{
				room.sendAnnouncement('+00:' + leadingZero(actualTimeAdded), null, 0x88FF88, 'bold', 1);
			}
			else if (actualTimeAdded < 0)
			{
				room.sendAnnouncement('+00:00', null, 0x88FF88, 'normal', 1);
			}
			else
			{ // maksymalnie doliczamy minutę
				room.sendAnnouncement('+01:00', null, 0x88FF88, 'bold', 1);
			}
			isTimeAddedShown = true; // już pokazano
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

function addedTime() // onGameTick
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
	{
        if (!isBallOutsideStadium)
		{
            isBallOutsideStadium = true;
            exitingPos = ballPosition.x;
            let totalScores = room.getScores().red + room.getScores().blue;
            if(lastScores != totalScores)
			{
                lastScores = totalScores;
                return false;
            }
            if (isOutsideRightBound(ballPosition) && lastTeamTouched == Team.RED)
			{ // czerwony wywala za linię bramkową niebieskich
                lastCall = 'GK';
                room.sendAnnouncement('Od bramki ' + blueTeamName, null, 0xFFFF00, 'normal', 1);
            }
			else if (isOutsideLeftBound(ballPosition) && lastTeamTouched == Team.BLUE)
			{ // niebieski wywala za linię bramkową czerwonych
                lastCall = 'GK';
                room.sendAnnouncement('Od bramki ' + redTeamName, null, 0xFFFF00, 'normal', 1);
            }
            else if (isOutsideRightBound(ballPosition) && lastTeamTouched == Team.BLUE)
			{ // niebieski wywala za linię bramkową niebieskich
                room.sendAnnouncement('Rzut rożny dla ' + redTeamName, null, 0xFFFF00, 'normal', 1);
                lastCall = 'CK';
            }
			else if (isOutsideLeftBound(ballPosition) && lastTeamTouched == Team.RED)
			{ // czerwony wywala za linię bramkową czerwonych
                room.sendAnnouncement('Rzut rożny dla ' + blueTeamName, null, 0xFFFF00, 'normal', 1);
                lastCall = 'CK';
            }
            else
			{ // Auty
                isBallKickedOutside = false;
				if (lastTeamTouched == Team.RED)
					room.sendAnnouncement('Aut dla ' + blueTeamName, null, 0xFFFF00, 'normal', 1);
				else
					room.sendAnnouncement('Aut dla ' + redTeamName, null, 0xFFFF00, 'normal', 1);
                lastCall = lastTeamTouched == Team.RED ? '2' : '1';
            }
        }
    }
    else
	{
        isBallOutsideStadium = false;
        backMSG = true;
    }
    return true;
}

function getDistanceBetweenPoints(p1, p2)
{
    let d1 = p1.x - p2.x;
    let d2 = p1.y - p2.y;
    return Math.sqrt(d1 * d1 + d2 * d2);
}

function isTouchingBall(player)
{ // czy gracz dotyka piłkę
	let ballPosition = room.getBallPosition();
	let distancePlayerToBall = getDistanceBetweenPoints(player.position, ballPosition);
	return distancePlayerToBall < triggerDistance;
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
	{
		if (players[i].position != null)
		{
			if (players[i].team != lastTeamTouched && players[i].team != lastCall && lastCall != 'CK' && lastCall != 'GK')
			{ // jeżeli drużyna przeciwna dotknęła ostatnia i ostatni komunikat to aut dla przeciwnika
				if ((players[i].position.y > greenLine || players[i].position.y < -greenLine) && getDistanceBetweenPoints(room.getBallPosition(), players[i].position) < 500)
					// jeżeli gracz przekracza linię i jest bliżej niż 500 od piłki
					playersNotInLine.push(players[i].name); // wpis do tablicy
			}
		}
	}
}

function checkPlayersLine()
{
    console.log('2');
    for(let i = 0; i < playersNotInLine.length; i++)
    {
		let found = false;
		for (let j = 0; j < lineCrossedPlayers.length; j++)
		{
			if (lineCrossedPlayers[j].name == playersNotInLine[i])
			{
				lineCrossedPlayers[j].times = lineCrossedPlayers[j].times + 1;
				room.sendAnnouncement('LINIA - ' + lineCrossedPlayers[j].name + ' {' + lineCrossedPlayers[j].times + '}', null, 0xFFFF00, 'normal', 1);
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
			room.sendAnnouncement('LINIA - ' + playersNotInLine[i] + ' {1}', null, 0xFFFF00, 'normal', 1);
		}
    }
}

let trigger = false;
let wrongThrowPosition = false;
function isBackRequired()
{
    let ballPosition = room.getBallPosition();
    if (!isBallKickedOutside)
    {
		if (lastCall=='1')
		{
			if ((ballPosition.x - exitingPos > throwInLeeway) && backMSG==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backMSG = false;
				room.sendAnnouncement('<—— DO TYŁU', null, 0xFFFF00, 'normal', 1);
				trigger = true;
				wrongThrowPosition = true;
			}
			if ((ballPosition.x - exitingPos < -throwInLeeway) && backMSG==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backMSG = false;
				room.sendAnnouncement('DO PRZODU ——>', null, 0xFFFF00, 'normal', 1);
				trigger = true;
				wrongThrowPosition = true;
			}
		}
		if (lastCall=='2')
		{
			if ((ballPosition.x - exitingPos > throwInLeeway) && backMSG==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backMSG = false;
				room.sendAnnouncement('<—— DO PRZODU', null, 0xFFFF00, 'normal', 1);
				trigger = true;
				wrongThrowPosition = true;
			}
			if ((ballPosition.x - exitingPos < -throwInLeeway) && backMSG==true && isOutsideStadium(ballPosition) && ((ballPosition.y - outLineY > 20) || (ballPosition.y - outLineY < -20)))
			{
				backMSG = false;
				room.sendAnnouncement('DO TYŁU ——>', null, 0xFFFF00, 'normal', 1);
				trigger = true;
				wrongThrowPosition = true;
			}
		}
    }
    if (lastCall=='2' && trigger && isOutsideStadium && Math.abs(exitingPos - ballPosition.x) < throwInLeeway-20)
    {
        room.sendAnnouncement('OK', null, 0xFFFF00, 'normal', 1);
        trigger = false;
        wrongThrowPosition = false;
        backMSG = true;
    }
    if (lastCall=='1' && trigger && isOutsideStadium && Math.abs(exitingPos - ballPosition.x) < throwInLeeway-20)
    {
        room.sendAnnouncement('OK', null, 0xFFFF00, 'normal', 1);
        trigger = false;
        wrongThrowPosition = false;
        backMSG = true;
    }
}

function isThrowInCorrect()
{
    let ballPosition = room.getBallPosition();
    let boolCrossing = isBallCrossingTheLine();
    let LTTstring = lastTeamTouched.toString();

    if (boolCrossing && !isBallKickedOutside && LTTstring==lastCall && (lastCall=='1' || lastCall=='2'))
    {

        if (lastCall=='2')
        {
            room.sendAnnouncement('Aut dla ' + redTeamName + ' (BRAK KOPNIĘCIA)', null, 0xFFFF00, 'normal', 1);
        }
        if (lastCall=='1')
        {
            room.sendAnnouncement('Aut dla ' + blueTeamName + ' (BRAK KOPNIĘCIA)', null, 0xFFFF00, 'normal', 1);
        }

        isBallKickedOutside == false;
    }
	else if (boolCrossing && LTTstring != lastCall && (lastCall=='1' || lastCall=='2'))
    {
        //room.sendAnnouncement('ZŁA DRUŻYNA', null, 0xFFFF00, 'normal', 1);
        wrongThrowPosition = false;
        trigger = false;
    }
	else if (boolCrossing && wrongThrowPosition && LTTstring==lastCall && (lastCall=='1' || lastCall=='2'))
    {
        room.sendAnnouncement('NIE W TYM MIEJSCU', null, 0xFFFF00, 'normal', 1);
        wrongThrowPosition = false;
        trigger = false;
    }
	else if (boolCrossing)
    {
        checkPlayersLine();
    }
}

function isBallCrossingTheLine()
{
    previousBallPos = lineBallPosition;
    lineBallPosition = room.getBallPosition().y;
    crossed = (lineBallPosition < stadiumHeight && previousBallPos > stadiumHeight) || (lineBallPosition > -stadiumHeight && previousBallPos < -stadiumHeight);
    return (lineBallPosition<stadiumHeight && previousBallPos>stadiumHeight) || (lineBallPosition>-stadiumHeight && previousBallPos<-stadiumHeight);
}

function hasBallLeftTheLine() // ???
{
    let ballPosition = room.getBallPosition();
    if (ballPosition.y<outLineY && isBallKickedOutside)
    {
    }
	else if (ballPosition.y > outLineY && isBallKickedOutside && lastPlayerTouched.id == previousPlayerTouched.id)
    {
        //room.sendAnnouncement('kruwa co robiła ta funkcja', null, 0xFFFF00, 'normal', 1);
		console.log('hasBallLeftTheLine (kruwa)');
    }
}

/*
	****************************** Komendy ******************************
*/
let commands =
{
    // Proste
	'!poss': possFun,
	
    // Gracz
    '!opqwerty': adminFun, // KOMENDA DO UZYSKANIA ADMINA
	'!deop': unAdminFun,
	'!resign': unAdminFun,
	'!bb': exitFun,
	'!leave': exitFun,

    // Admin
	'!cb': clearBansFun,

	// Admin i argumenty
	'!tred': teamRedNameFun,
	'!tblue': teamBlueNameFun,
	'!l': loadFun,
	'!load': loadFun
}

// Proste
function possFun()
{
	if (redPossessionTicks + bluePossessionTicks == 0) // Trzeba pamiętać o dziedzinie
		return false;
	let redPossessionPercentage = Math.round(redPossessionTicks / (redPossessionTicks+bluePossessionTicks) * 100);
	let bluePossessionPercentage = 100 - redPossessionPercentage;
	if (room.getScores() != null) // mecz trwa
		room.sendAnnouncement('Posiadanie piłki: ' + redTeamName + ' ' + redPossessionPercentage + ' % ' + bluePossessionPercentage + ' ' + blueTeamName, null, 0xCCFF00, 'normal', 1);
	else
		room.sendAnnouncement('Posiadanie piłki w ostatnim meczu: ' + redTeamName + ' ' + redPossessionPercentage + ' % ' + bluePossessionPercentage + ' ' + blueTeamName, null, 0xCCFF00, 'normal', 1);
}

// Gracz
function adminFun(player, arg)
{ // !opqwerty
    // Daje wpisującemu admina
    room.setPlayerAdmin(player.id, true);
    return false; // The message won't be displayed
}

function unAdminFun(player)
{ // !deop
    // Rezygnacja
    room.setPlayerAdmin(player.id, false);
    return false; // The message won't be displayed
}

function exitFun(player)
{ // !bb, !leave
	room.kickPlayer(player.id, '🔻 ' + player.name + ' wychodzi', false);
}

// Admin
function clearBansFun(player)
{ // !cb
    if (player.admin === true)
	{
		room.clearBans();
		room.sendAnnouncement('✔Wyczyszczono bany', null, 0x00FF00, 'normal', 1);
	}
	else
		room.sendAnnouncement('[PRYWATNA] ⛔Nie. Nie wiemy, czy można ci ufać.', player.id, 0xFF3300, 'normal', 1);
}

// Admin i argumenty
function teamRedNameFun(player, arg)
{ // !tred R
	if (player.admin === true)
	{
		redTeamName = redTeamPrefix + '' + ignore(arg);
		room.sendAnnouncement('[PRYWATNA] Czerwoni to: ' + redTeamName, player.id, 0xFFFF00, 'normal', 0);
	}
	else
		room.sendAnnouncement('[PRYWATNA] ⛔Nie. Nie wiemy, czy można ci ufać.', player.id, 0xFF3300, 'normal', 1);
	return false;
}

function teamBlueNameFun(player, arg)
{ // !tblue B
	if (player.admin === true)
	{
		blueTeamName = blueTeamPrefix + '' + ignore(arg);
		room.sendAnnouncement('[PRYWATNA] Niebiescy to: ' + blueTeamName, player.id, 0xFFFF00, 'normal', 0);
	}
	else
		room.sendAnnouncement('[PRYWATNA] ⛔Nie. Nie wiemy, czy można ci ufać.', player.id, 0xFF3300, 'normal', 1);
	return false;
}

function loadFun(player, arg)
{ // !l bounce
	if (player.admin === true)
	{
		arg = ignore(arg);
		if (maps[arg] != undefined)
			room.setCustomStadium(maps[arg]);
		else
			room.sendAnnouncement('[PRYWATNA] ⛔Nie ma mapy ' + arg + '. Możliwa literówka', player.id, 0xFFCC00, 'normal', 1);
	}
	else
		room.sendAnnouncement('[PRYWATNA] ⛔Nie. Nie wiemy, czy można ci ufać.', player.id, 0xFFCC00, 'normal', 1);
}

/*
	****************************** Zdarzenia ******************************
*/
room.onPlayerJoin = function(player)
{
    console.log(player.name + '#' + player.id + ' wchodzi');
	updatePlayerList();
	initBijacze(player);
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
	isThrowInCorrect();
    getLastTouchTheBall();
    checkBallPosition();
    isBackRequired();
    hasBallLeftTheLine();
    addedTime();
    displayAddedTime();
	
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
			//room.sendAnnouncement('Ta decyzja zmieni losy gry', null, 0xFF4400, 'small', 0);
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
	
	ballRadius = room.getDiscProperties(0).radius;
	lineCrossedPlayers = [{name: 'temp', times: 0}];
    lastScores = room.getScores().red + room.getScores().blue;
    timeOutside = 0;
    isTimeAddedShown = false;
    lineBallPosition = 0;
	redPossessionTicks = 0;
	bluePossessionTicks = 0;
}

room.onGameStop = function(byPlayer)
{
	if (byPlayer == null)
		console.log('Gra przerwana');
	else
		console.log('Gra przerwana przez: ' + byPlayer.name + '#' + byPlayer.id);
}

room.onGamePause = function(byPlayer)
{
    if (byPlayer == null)
		console.log('Gra zatrzymana');
	else
		console.log('Gra zatrzywana przez: ' + byPlayer.name + '#' + byPlayer.id);
}

room.onGameUnpause = function(byPlayer)
{
    if (byPlayer == null)
		console.log('Gra wznowiona');
	else
		console.log('Gra wznowiona przez: ' + byPlayer.name + '#' + byPlayer.id);
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
{
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
let isOwnGoal = (team, player) => team !== player.team ? ' (sam.)' : '';
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
		
		room.sendAnnouncement('⚽' + teamIcon(team) + ' ' + time + ' ' + lastPlayerTouched.name +
		assist + ownGoal, null, 0xFFFF00, 'normal', 1);
		console.log('⚽' + teamIcon(team) + ' ' + time + ' ' + lastPlayerTouched.name +
		assist + ownGoal);
	}
	else
	{
		room.sendAnnouncement('⚽' + teamIcon(team) + ' ' + time + ' ', null, 0xFFFF00, 'normal', 1);
		console.log('⚽' + teamIcon(team) + ' ' + time);
	}
}

room.onPositionsReset = function()
{
	ballRadius = room.getDiscProperties(0).radius;
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
	
	// komenda ze słownika
	if (commands.hasOwnProperty(command) === true)
		return commands[command](player, arg);
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
