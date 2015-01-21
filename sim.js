window.onload = function(){ // Wait for DOM to load
	var console = {};
	console.log = function(){ //Override native console.log and print to div in DOM
		if (!console) {
	        console = {};
	    }
	    var old = console.log;
	    
	    console.log = function (message) {
	    	var logger = document.getElementById('log');
	        if (typeof message == 'object') {
	            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
	        } else {
	            logger.innerHTML += message + '<br />';
	        }
	    }
	};

	// --------------------------------- Start Flow Conditions--------------------------------------

	(function main(){
	    var x = document.getElementById("globalvars");
	    var text = "";
	    var i;
	    for (i = 0; i < x.length ;i++) {
	        text += x.elements[i].value + "<br>";
	    }

		this.numOfRounds = 8;
		this.roundCount = 1;
		this.fatalityPercent = 13;
		this.accuracy = 1;
		this.numOfTier = 3;

		this.troopsTypes = ['infantry', 'archers', 'cavalry'];
		this.tiers = ['t1', 't2', 't3'];

		this.troopsRps = 	{'infantry': {"infantryAtt": 1.0, "infantryDef": 1.0, "archersAtt": 2.0, "archersDef": 2.0, "cavalryAtt": 0.5, "cavalryDef": 0.5},
	    					 'archers':  {"infantryAtt": 0.5, "infantryDef": 0.5, "archersAtt": 1.0, "archersDef": 1.0, "cavalryAtt": 2.0, "cavalryDef": 2.0},
	    					 'cavalry':  {"infantryAtt": 2.0, "infantryDef": 2.0, "archersAtt": 0.5, "archersDef": 0.5, "cavalryAtt": 1.0, "cavalryDef": 1.0}};

		this.attArmy = {'infantry' : {'t1' : 0, 't2' : 0, 't3' : 9000},
					   	'archers' : {'t1' : 0, 't2' : 0, 't3' : 6000},
					   	'cavalry' : {'t1' : 0, 't2' : 0, 't3' : 0}};

		this.defArmy = {'infantry' : {'t1' : 60, 't2' : 300, 't3' : 3000},
					   	'archers' : {'t1' : 0, 't2' : 0, 't3' : 0},
					   	'cavalry' : {'t1' : 0, 't2' : 0, 't3' : 0}};
			
		this.armyStatePerRound = [[attArmy, defArmy]];
		this.battleLog = {};
		this.endOfBattleAttArmyState = JSON.parse(JSON.stringify(attArmy));
		this.endOfBattleDefArmyState = JSON.parse(JSON.stringify(defArmy));
		
		makeJSON();

		setUpRound();

	})();

	// ----------------------------------------- Main Flow ---------------------------------------------


	function setUpRound(){

		var k = 0;
		var defTroopRatio = 0;
		var defTroopForThisRound = null;
		var defTroopRatio = 1;
		var attTroopForThisRound = null;
		var splittedAttArmy = null;
		var attArmyCopy = {};
		var defArmyCopy = {};
		var attArmyCalc = {};
		var defArmyCalc = {};
		var lastSplittedAttArmy = {};
		var split = true;
		
		for(k = 0; k < numOfRounds; k++){

			attArmyCopy=JSON.parse(JSON.stringify(armyStatePerRound[k][0]));
			defArmyCopy=JSON.parse(JSON.stringify(armyStatePerRound[k][1]));

			attArmyCalc=JSON.parse(JSON.stringify(armyStatePerRound[k][0]));
			defArmyCalc=JSON.parse(JSON.stringify(armyStatePerRound[k][1]));

			if(calcArmySum(defArmyCalc) === 0){
				console.log(' >>>>>>>>>>>>>>>>>>>>> BATTLE IS OVER <<<<<<<<<<<<<<<<<<<<<');
				//console.log('Battle is over - Defender lost the battle');
				produceBattleReport();
				return;
			}
			if(calcArmySum(attArmyCalc) === 0){
				console.log(' >>>>>>>>>>>>>>>>>>>>> BATTLE IS OVER <<<<<<<<<<<<<<<<<<<<<');
				//console.log('Battle is over - Attacker lost the battle');
				produceBattleReport();
				return;
			}

			console.log(' >>>>>>>>>>>>>>>>>>>>> ROUND ' + (k + 1) + ' <<<<<<<<<<<<<<<<<<<<<');

			defTroopForThisRound = findWeakestTroop(defArmyCalc); 
			if(split){
				defTroopRatio = calcWeakestDefTroopRatio(defTroopForThisRound, defArmyCalc);
				splittedAttArmy = splitAttArmy(attArmyCalc, defTroopRatio);
				//lastSplittedAttArmy=JSON.parse(JSON.stringify(splittedAttArmy));
				
			}
			else{
				//attTroopForThisRound = findWeakestTroop(lastSplittedAttArmy);
			}
			attTroopForThisRound = findWeakestTroop(splittedAttArmy);
			

			console.log('Defending troop for this round is: ' + defTroopForThisRound.quantity + ' ' + defTroopForThisRound.tier + ' ' + defTroopForThisRound.troop);
			//console.log('Defending troop ratio is: ' + defTroopRatio);
			//console.log('Attaking troop for this round is: ' + attTroopForThisRound.quantity + ' ' + attTroopForThisRound.tier + ' ' + attTroopForThisRound.troop);

			split = executeRound(attTroopForThisRound, defTroopForThisRound, attArmyCalc, defArmyCalc, attArmyCopy, defArmyCopy, splittedAttArmy);	
		}
		console.log(' >>>>>>>>>>>>>>>>>>>>> BATTLE IS OVER <<<<<<<<<<<<<<<<<<<<<');
		console.log('Battle is over - Reached the Max number of rounds');
		produceBattleReport();
	};

	function executeRound(attTroopForThisRound, defTroopForThisRound, attArmyCalc, defArmyCalc, attArmyCopy, defArmyCopy, splittedAttArmy){
		var defLoses = null;
		var attLoses = null;
		var minAtt = calcMinAtt(attTroopForThisRound,defTroopForThisRound); //

		if(minAtt === attTroopForThisRound.quantity){ //Means attacker army need to use all the troop devision
			defLoses = calcDefenderLosses(attTroopForThisRound, defTroopForThisRound);  
			
			attLoses = calcAttackerLosses(attTroopForThisRound,defTroopForThisRound, minAtt);

			//Update the state of attacker army for next round
			attArmyCopy[attTroopForThisRound.troop][attTroopForThisRound.tier] -= attTroopForThisRound.quantity;

			//Update the state of defender army for next round
			defArmyCopy[defTroopForThisRound.troop][defTroopForThisRound.tier] -= defLoses;
		}
		else{ //Meaning attacker troop can use less troops
			//console.log('The min att needed to kill all is : ' + minAtt);
			//The attacker killed all the defender's troops for this round. Need to caculate attacker loses
			attLoses = calcAttackerLosses(attTroopForThisRound,defTroopForThisRound, minAtt);
			defLoses = defTroopForThisRound.quantity;
			
			//Update the state of attacker army for next round
			attArmyCopy[attTroopForThisRound.troop][attTroopForThisRound.tier] -= minAtt;

			//Update the state of defender army for next round
			defArmyCopy[defTroopForThisRound.troop][defTroopForThisRound.tier] -= defTroopForThisRound.quantity;
		}
		
		console.log('Attaking troop for this round is: ' + minAtt + ' ' + attTroopForThisRound.tier + ' ' + attTroopForThisRound.troop);

		armyStatePerRound[roundCount] = [attArmyCopy, defArmyCopy];
		battleLog[roundCount-1] = {'attTroop': attTroopForThisRound, 'attTroopLosses' : attLoses, 'defTroop': defTroopForThisRound, 'defTroopLosses': defLoses};
		endOfBattleAttArmyState[attTroopForThisRound.troop][attTroopForThisRound.tier] -= attLoses;
		endOfBattleDefArmyState[defTroopForThisRound.troop][defTroopForThisRound.tier] -= defLoses;

		console.log('Round result:');
		console.log('Defender troop lost: ' + defLoses);	
		console.log('Attacker troop lost: ' + attLoses);	 
		roundCount++;
		if(defLoses < defTroopForThisRound.quantity){
				splittedAttArmy[attTroopForThisRound.troop][attTroopForThisRound.tier] -= attTroopForThisRound.quantity;
				return false;
		}
		else{
			return true;
		}
	};

	// ----------------------------------------- Flow Supporting Utils ---------------------------------------------

	function splitAttArmy(army, defTroopRatio){
		for (i = 0; i < troopsTypes.length; i++){
			army[troopsTypes[i]].t1 *= defTroopRatio;
		}
		for (i = 0; i < troopsTypes.length; i++){
			army[troopsTypes[i]].t2 *= defTroopRatio;
		}
		for (i = 0; i < troopsTypes.length; i++){
			army[troopsTypes[i]].t3 *= defTroopRatio;
		}
		return army;
	};

	function findWeakestTroop(army){
		// Looking for the lowest "tier" in the defending army, 
		// if there are two troops type with the same "tier", the smaller amount in size is chosen.
		// If both "tier" and quantity are equal, the order will be : infantry --> archers --> cavalry.
		var defTroopForThisRound = {'troop' : '', 'tier' : '', 'quantity' : ''};
		var i,j = 0;
		var tierType = null;
		for(j=0; j<tiers.length; j++){
			for (i = 0	; i < troopsTypes.length; i++){
				if(army[troopsTypes[i]][tiers[j]] > 0){	//check that the kind of troop exists in the def army.
					defTroopForThisRound = {'troop' : troopsTypes[i], 'tier' : tiers[j], 'quantity' : army[troopsTypes[i]][tiers[j]]};
					return defTroopForThisRound;
				}
			}
		}
	};

	function calcWeakestDefTroopRatio(defTroopForThisRound, defArmy){
		return defTroopForThisRound.quantity / calcArmySum(defArmy);
	};

	function calcArmySum(army){
		
		var i = 0;
		var armySum = 0;

		for(i = 0; i < troopsTypes.length; i++){

			//TODO: make the tier automatic
			armySum += (army[troopsTypes[i]].t1 + army[troopsTypes[i]].t2 + army[troopsTypes[i]].t3);
		}

		return armySum;
	};
	function calcMinAtt(attTroopForThisRound, defTroopForThisRound){
		var defResilience = 1;
		var acr = 1;
		var rps = 1;
		var numOfAttTroopToKillAllDefTroop = null;

		if(defTroopForThisRound.tier === 't2'){
			defResilience = 2;
		}
		if(defTroopForThisRound.tier === 't3'){
			defResilience = 3;
		}

		numOfAttTroopToKillAllDefTroop = (defTroopForThisRound.quantity * defTroopForThisRound.quantity * defResilience) / 
		      (attTroopForThisRound.quantity * acr * troopsRps[defTroopForThisRound.troop][attTroopForThisRound.troop + 'Att'] * fatalityPercent * ((fatalityPercent/numOfRounds)/100));

		if((attTroopForThisRound.quantity - numOfAttTroopToKillAllDefTroop) > 0){ //Meaning the attacker troop has enought troops to kill all defender troop
			return numOfAttTroopToKillAllDefTroop;
		}
		else{ //If the divided attacker troop is not enough, calc how much it can kill
			numOfAttTroopToKillAllDefTroop = attTroopForThisRound.quantity;
			return numOfAttTroopToKillAllDefTroop;
		}
	};

	function calcDefenderLosses(attTroopForThisRound, defTroopForThisRound){

		//         Na           Att * RPSa(dc) 
	    //Kills = ---- * Acr * ---------------- * F * Fr
	    //         Nd                Rd
	    //  |------1-----|-------2----------|---3----|

	    //Tier		Attack Rating	Defense Rating	Resilience Rating
		//  1		         1			      1			       1
	    //  2		         2			      2			       2
	    //  3		         3			      3			       3
	    //  4		         4			      4			       4


		var defenderLosses = null;
		var defResilience = 1;

		if(defTroopForThisRound.tier === 't2'){
			defResilience = 2;
		}
		if(defTroopForThisRound.tier === 't3'){
			defResilience = 3;
		}

		var Na = attTroopForThisRound.quantity;  //Number of Troops in the Attacker’s side
		var Nd = defTroopForThisRound.quantity;   //Number of Troops in the Defender’s side
		var Att = attTroopForThisRound.quantity;//Attack net Ratio of Attacker Unit  (after attack boost impacts)
		var Acr = accuracy;  //Accuracy of Attacker troop (includes the random factor)
		var RPSa = troopsRps[defTroopForThisRound.troop][attTroopForThisRound.troop + 'Att']; //Attacker-Type’s RPS Ratio against the Defender Type
		var F = fatalityPercent;    //fatality ratio
		var Fr = ((fatalityPercent/numOfRounds)/100);    //fatality ratio per round  <<<< Does fatality ratio changes form round to round? <<<<<<<<
		var Rd = defResilience;   //Defender’s Resilience net ratio (after defense and health boosts impacts).

		var temp1 = (Na/Nd)*Acr;
		var temp2 = (Att*RPSa)/Rd;

		defenderLosses = temp1 * temp2 * F * Fr; 

		return defenderLosses;
	};

	function calcAttackerLosses(attTroopForThisRound,defTroopForThisRound, minAtt){

		//          Nd           Def * RPSd(ac) 
	    //Losses = ---- * Acr * ---------------- * F * Fr
	    //          Na                Ra
	    //   |------1-----|-------2----------|---3---|


		var attackerLosses = null;
		var attResilience = 1;

		if(attTroopForThisRound.tier === 't2'){
			attResilience = 2;
		}
		if(attTroopForThisRound.tier === 't3'){
			attResilience = 3;
		}

		var Na = minAtt;  //Number of Troops in the Attacker’s side
		var Nd = defTroopForThisRound.quantity;  //Number of Troops in the Defender’s side
		var Def = defTroopForThisRound.quantity; //Defence net Ratio of Defender’s Unit  (after defence boost impacts)
		var Acr = accuracy;  //Accuracy of Defender troop (includes the random factor)
		var RPSd = troopsRps[attTroopForThisRound.troop][defTroopForThisRound.troop + 'Def']; //Attacker-Type’s RPS Ratio against the Defender Type
		var F = fatalityPercent;    //fatality ratio
		var Fr = ((fatalityPercent/numOfRounds)/100);   //fatality ratio per round 
		var Ra = attResilience;   //Attacker’s Resilience net ratio (after defense and health boosts impacts).

		var temp1 = (Nd/Na)*Acr;
		var temp2 = (Def*RPSd)/Ra;

		attackerLosses = temp1 * temp2 * F * Fr; 

		return attackerLosses;
	};

	function produceBattleReport(){
		console.log('Attacker army end of battle state : ');
		console.log(JSON.stringify(endOfBattleAttArmyState));
		console.log('Attacker army end of battle state : ');
		console.log(JSON.stringify(endOfBattleDefArmyState));
	};

	function declareWinner(){

		//Victory is determined as follows:
		// 1. If an army lost all his troops 
		// 2. If both armies loast some troops the one that lost more (in quantity not by type or tier) loses the battle.

		if(calcArmySum(endOfBattleAttArmyState) === 0){
			console.log('Attacker Lost');
		}
		if(calcArmySum(endOfBattleDefArmyState) === 0){
			console.log('Defender Lost');
		}
		if((calcArmySum(endOfBattleDefArmyState) === 0) && (calcArmySum(endOfBattleAttArmyState) === 0)){
			console.log('Both Armys are gone!');
		}
	};

	function makeJSON(){
	    var arr = [{}];
	    var inputs;
	    var jsonString;

	    var forms = document.forms;
	    for(var i=0; i<forms.length; i++){

	        if(typeof(arr[0][forms[i].id]) == 'undefined'){
	          arr[0][forms[i].id] = [];
	        }

	        for(var ii=0; ii<forms[i].elements.length; ii++){
	          arr[0][forms[i].id].push(forms[i].elements[ii].value)
	        }

	    }

	    jsonString = JSON.stringify(arr);
	    console.log(jsonString);
	};
};
