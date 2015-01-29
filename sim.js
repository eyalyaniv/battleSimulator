window.onload = function(){ // Wait for DOM to load
	// var console = {};
	// console.log = function(){ //Override native console.log and print to div in DOM
	// 	if (!console) {
	//         console = {};
	//     }
	//     var old = console.log;
	    
	//     console.log = function (message) {
	//     	var logger = document.getElementById('log');
	//         if (typeof message == 'object') {
	//             logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
	//         } else {
	//             logger.innerHTML += message + '<br />';
	//         }
	//     }
	// };

	document.getElementById('goToBattle').onclick = function(e){
     	setUpBattle();
	};

	function formSerialize(form){
		if (!form || form.nodeName !== "FORM") {
			return;
		}
		var i, j,
		obj = {};
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
					case 'text':
						obj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
					break;
				}
				break;
			}
		}
		return obj;
	};
	
	// --------------------------------- Start Flow Conditions--------------------------------------

	(function main(){

	})();

	function setUpBattle(){
		 var formData = formSerialize(document.getElementById("globalvars"));
	   
		this.numOfRounds = parseInt(formData['numOfRounds']);//8;
		this.roundCount = 1;
		this.fatalityPercent = parseInt(formData['fatalityPercent']);//13;
		this.accuracy = parseInt(formData['accuracy']);//1;
		this.attBoostAtt = parseInt(formData['attBoostAtt']);
		this.attBoostDef = parseInt(formData['attBoostDef']);
		this.defBoostAtt = parseInt(formData['defBoostAtt']);
		this.defBoostDef = parseInt(formData['defBoostDef']);
		this.numOfTier = 3;
		var troop1 = formData['troop1'];
		var troop2 = formData['troop2'];
		var troop3 = formData['troop3'];
		var troop4 = formData['troop4'];
		var troop5 = formData['troop5'];

		this.troopsTypes = [troop1, troop2, troop3, troop4, troop5];
		this.tiers = ['t1', 't2', 't3', 't4', 't5'];

		//Average Might	T1	T2	T3	T4
		//Troops	   2.25	4.5	8.5	17
		//Seals	        3	 6	12	24
		this.avgMight = {"t1": 2.25, "t2": 4.5, "t3": 8.5, "t4": 17, "t5": 1};

		this.mightCoef = {'infantry' : {'t1' : parseInt(formData['mightCoInfantryT1']), 't2' : parseInt(formData['mightCoInfantryT2']), 't3' : parseInt(formData['mightCoInfantryT3']), 't4' : parseInt(formData['mightCoInfantryT4']), 't5' : parseInt(formData['mightCoInfantryT5'])},
					   	'archers' : {'t1' : parseInt(formData['mightCoArchersT1']), 't2' : parseInt(formData['mightCoArchersT2']), 't3' : parseInt(formData['mightCoArchersT3']), 't4' : parseInt(formData['mightCoArchersT4']), 't5' : parseInt(formData['mightCoArchersT5'])},
					   	'cavalry' : {'t1' : parseInt(formData['mightCoCavalryT1']), 't2' : parseInt(formData['mightCoCavalryT2']), 't3' : parseInt(formData['mightCoCavalryT3']), 't4' : parseInt(formData['mightCoCavalryT4']), 't5' : parseInt(formData['mightCoCavalryT5'])},
					    'mage' : {'t1' : parseInt(formData['mightCoMageT1']), 't2' : parseInt(formData['mightCoMageT2']), 't3' : parseInt(formData['mightCoMageT3']), 't4' : parseInt(formData['mightCoMageT4']), 't5' : parseInt(formData['mightCoMageT5'])},
					    'seals' : {'t1' : parseInt(formData['mightCoSealsT1']), 't2' : parseInt(formData['mightCoSealsT2']), 't3' : parseInt(formData['mightCoSealsT3']), 't4' : parseInt(formData['mightCoSealsT4']), 't5' : parseInt(formData['mightCoSealsT5'])}};

		
			//mage -> infantry 3/2,   2/3
			//mage -> seals 2, 0.5

			//seals -> ?
		this.troopsRps = 	
		  { 'infantry': 
		    { "infantryAtt" : parseFloat(formData['inf_infantryAtt'])
		    , "infantryDef": parseFloat(formData['inf_infantryDef'])
		    , "archersAtt" : parseFloat(formData['inf_archersAtt'])
		    , "archersDef" : parseFloat(formData['inf_archersDef'])
		    , "cavalryAtt" : parseFloat(formData['inf_cavalryAtt'])
		    , "cavalryDef" : parseFloat(formData['inf_cavalryDef'])
		    , "mageAtt" : parseFloat(formData['inf_mageAtt'])
		    , "mageDef" : parseFloat(formData['inf_mageDef'])
		    , "sealsAtt" : parseFloat(formData['inf_sealsAtt'])
		    , "sealsDef" : parseFloat(formData['inf_sealsDef'])
		    }
		  , 'archers':  
		    { "infantryAtt" : parseFloat(formData['arch_infantryAtt'])
		    , "infantryDef": parseFloat(formData['arch_infantryDef'])
		    , "archersAtt" : parseFloat(formData['arch_archersAtt'])
		    , "archersDef" : parseFloat(formData['arch_archersDef'])
		    , "cavalryAtt" : parseFloat(formData['arch_cavalryAtt'])
		    , "cavalryDef" : parseFloat(formData['arch_cavalryDef'])
		    , "mageAtt" : parseFloat(formData['arch_mageAtt'])
		    , "mageDef" : parseFloat(formData['arch_mageDef'])
		    , "sealsAtt" : parseFloat(formData['arch_sealsAtt'])
		    , "sealsDef" : parseFloat(formData['arch_sealsDef'])
		    }
		  , 'cavalry':  
		    { "infantryAtt" : parseFloat(formData['cav_infantryAtt'])
		    , "infantryDef": parseFloat(formData['cav_infantryDef'])
		    , "archersAtt" : parseFloat(formData['cav_archersAtt'])
		    , "archersDef" : parseFloat(formData['cav_archersDef'])
		    , "cavalryAtt" : parseFloat(formData['cav_cavalryAtt'])
		    , "cavalryDef" : parseFloat(formData['cav_cavalryDef'])
		    , "mageAtt" : parseFloat(formData['cav_mageAtt'])
		    , "mageDef" : parseFloat(formData['cav_mageDef'])
		    , "sealsAtt" : parseFloat(formData['cav_sealsAtt'])
		    , "sealsDef" : parseFloat(formData['cav_sealsDef'])
		    }
		   , 'mage':  
		    { "infantryAtt" : parseFloat(formData['mage_infantryAtt'])
		    , "infantryDef": parseFloat(formData['mage_infantryDef'])
		    , "archersAtt" : parseFloat(formData['mage_archersAtt'])
		    , "archersDef" : parseFloat(formData['mage_archersDef'])
		    , "cavalryAtt" : parseFloat(formData['mage_cavalryAtt'])
		    , "cavalryDef" : parseFloat(formData['mage_cavalryDef'])
		    , "mageAtt" : parseFloat(formData['mage_mageAtt'])
		    , "mageDef" : parseFloat(formData['mage_mageDef'])
		    , "sealsAtt" : parseFloat(formData['mage_sealsAtt'])
		    , "sealsDef" : parseFloat(formData['mage_sealsDef'])
		    }
		   , 'seals':  
		    { "infantryAtt" : parseFloat(formData['seals_infantryAtt'])
		    , "infantryDef": parseFloat(formData['seals_infantryDef'])
		    , "archersAtt" : parseFloat(formData['seals_archersAtt'])
		    , "archersDef" : parseFloat(formData['seals_archersDef'])
		    , "cavalryAtt" : parseFloat(formData['seals_cavalryAtt'])
		    , "cavalryDef" : parseFloat(formData['seals_cavalryDef'])
		    , "mageAtt" : parseFloat(formData['seals_mageAtt'])
		    , "mageDef" : parseFloat(formData['seals_mageDef'])
		    , "sealsAtt" : parseFloat(formData['seals_sealsAtt'])
		    , "sealsDef" : parseFloat(formData['seals_sealsDef'])
		    }
		  };

		   this.attArmy = {'infantry' : {'t1' : parseInt(formData['attInfantryT1']), 't2' : parseInt(formData['attInfantryT2']), 't3' : parseInt(formData['attInfantryT3']), 't4' : parseInt(formData['attInfantryT4']), 't5' : parseInt(formData['attInfantryT5'])},
					   	'archers' : {'t1' : parseInt(formData['attArchersT1']), 't2' : parseInt(formData['attArchersT2']), 't3' : parseInt(formData['attArchersT3']), 't4' : parseInt(formData['attArchersT4']), 't5' : parseInt(formData['attArchersT5'])},
					   	'cavalry' : {'t1' : parseInt(formData['attCavalryT1']), 't2' : parseInt(formData['attCavalryT2']), 't3' : parseInt(formData['attCavalryT3']), 't4' : parseInt(formData['attCavalryT4']), 't5' : parseInt(formData['attCavalryT5'])},
					    'mage' : {'t1' : parseInt(formData['attMageT1']), 't2' : parseInt(formData['attMageT2']), 't3' : parseInt(formData['attMageT3']), 't4' : parseInt(formData['attMageT4']), 't5' : parseInt(formData['attMageT5'])},
					    'seals' : {'t1' : parseInt(formData['attSealsT1']), 't2' : parseInt(formData['attSealsT2']), 't3' : parseInt(formData['attSealsT3']), 't4' : parseInt(formData['attSealsT4']), 't5' : parseInt(formData['attSealsT5'])}};

			
			this.defArmy = {'infantry' : {'t1' : parseInt(formData['defInfantryT1']), 't2' : parseInt(formData['defInfantryT2']), 't3' : parseInt(formData['defInfantryT3']), 't4' : parseInt(formData['defInfantryT4']), 't5' : parseInt(formData['defInfantryT5'])},
					   	'archers' : {'t1' : parseInt(formData['defArchersT1']), 't2' : parseInt(formData['defArchersT2']), 't3' : parseInt(formData['defArchersT3']), 't4' : parseInt(formData['defArchersT4']), 't5' : parseInt(formData['defArchersT5'])},
					   	'cavalry' : {'t1' : parseInt(formData['defCavalryT1']), 't2' : parseInt(formData['defCavalryT2']), 't3' : parseInt(formData['defCavalryT3']), 't4' : parseInt(formData['defCavalryT4']), 't5' : parseInt(formData['defCavalryT5'])},
					    'mage' : {'t1' : parseInt(formData['defMageT1']), 't2' : parseInt(formData['defMageT2']), 't3' : parseInt(formData['defMageT3']), 't4' : parseInt(formData['defMageT4']), 't5' : parseInt(formData['defMageT5'])},
					    'seals' : {'t1' : parseInt(formData['defSealsT1']), 't2' : parseInt(formData['defSealsT2']), 't3' : parseInt(formData['defSealsT3']), 't4' : parseInt(formData['defSealsT4']), 't5' : parseInt(formData['attSealsT5'])}};


		// this.attArmy = {'infantry' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			   	'archers' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			   	'cavalry' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			    'mage' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			    'seals' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0}};

		// this.defArmy = {'infantry' : {'t1' : 5000, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			   	'archers' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			   	'cavalry' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			   	'mage' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0},
		// 			    'seals' : {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0}};
			
		this.armyStatePerRound = [[attArmy, defArmy]];
		this.battleLog = {};
		this.endOfBattleAttArmyState = JSON.parse(JSON.stringify(attArmy));
		this.endOfBattleDefArmyState = JSON.parse(JSON.stringify(defArmy));
		this.attTroppsLost = {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0};
		this.defTroopsLost = {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0, 't5' : 0};

		setUpRound();
	};

	function initArmy(army){
		
		var i = 0;
		for(i = 0; i < troopsTypes.length; i++){

			armySum += (army[troopsTypes[i]].t1 + army[troopsTypes[i]].t2 + army[troopsTypes[i]].t3);
		}

		return armySum;
	};

	// ----------------------------------------- Main Flow ---------------------------------------------

	// 1. Find the weakest attacker troop and the weakest defender troop
	// 2. Decide if to split the attacker army
	//		- If both troops are equal no need to split and can reach the max number of rounds
	//		- If 

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
				declareWinner();
				return;
			}
			if(calcArmySum(attArmyCalc) === 0){
				console.log(' >>>>>>>>>>>>>>>>>>>>> BATTLE IS OVER <<<<<<<<<<<<<<<<<<<<<');
				//console.log('Battle is over - Attacker lost the battle');
				produceBattleReport();
				declareWinner();
				return;
			}

			console.log(' >>>>>>>>>>>>>>>>>>>>> ROUND ' + (k + 1) + ' <<<<<<<<<<<<<<<<<<<<<');

			defTroopForThisRound = findWeakestTroop(defArmyCalc); 
			attTroopForThisRound = findWeakestTroop(attArmyCalc);
			if(split /*&& (attTroopForThisRound.quantity >= defTroopForThisRound.quantity)*/){
				defTroopRatio = calcWeakestDefTroopRatio(defTroopForThisRound, defArmyCalc);
				splittedAttArmy = splitAttArmy(attArmyCalc, defTroopRatio);
				//lastSplittedAttArmy=JSON.parse(JSON.stringify(splittedAttArmy));
				
			}
			else{
				splittedAttArmy = attArmyCalc;
				//attTroopForThisRound = findWeakestTroop(lastSplittedAttArmy);
			}
			attTroopForThisRound = findWeakestTroop(splittedAttArmy);
			

			console.log('Defending troop for this round is: ' + defTroopForThisRound.quantity + ' ' + defTroopForThisRound.tier + ' ' + defTroopForThisRound.troop);
			//console.log('Defending troop ratio is: ' + defTroopRatio);
			//console.log('Attaking troop for this round is: ' + attTroopForThisRound.quantity + ' ' + attTroopForThisRound.tier + ' ' + attTroopForThisRound.troop);

			split = executeRound(attTroopForThisRound, defTroopForThisRound, attArmyCalc, defArmyCalc, attArmyCopy, defArmyCopy, splittedAttArmy);	
		}
		console.log(' >>>>>>>>>>>>>>>>>>>>> BATTLE IS OVER <<<<<<<<<<<<<<<<<<<<<');
		produceBattleReport();
		declareWinner();
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
		attTroppsLost[attTroopForThisRound.tier] += attLoses;
		endOfBattleDefArmyState[defTroopForThisRound.troop][defTroopForThisRound.tier] -= defLoses;
		defTroopsLost[defTroopForThisRound.tier] += defLoses;

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
		for (i = 0; i < troopsTypes.length; i++){
			army[troopsTypes[i]].t4 *= defTroopRatio;
		}
		for (i = 0; i < troopsTypes.length; i++){
			army[troopsTypes[i]].t5 *= defTroopRatio;
		}
		return army;
	};

	function findWeakestTroop(army){
		// Looking for the lowest "tier" in the defending army, 
		// if there are two troops type with the same "tier", the smaller amount in size is chosen.
		// If both "tier" and quantity are equal, the order will be : infantry --> archers --> cavalry.
		var weakestTroop = {'troop' : '', 'tier' : '', 'quantity' : ''};
		var i,j = 0;
		var tierType = null;
		for(j=0; j<tiers.length; j++){
			for (i = 0	; i < troopsTypes.length; i++){
				if(army[troopsTypes[i]][tiers[j]] > 0){	//check that the kind of troop exists in the def army.
					return weakestTroop = {'troop' : troopsTypes[i], 'tier' : tiers[j], 'quantity' : army[troopsTypes[i]][tiers[j]]};
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
		if(defTroopForThisRound.tier === 't4'){
			defResilience = 4;
		}
		if(defTroopForThisRound.tier === 't5'){
			defResilience = 5;
		}

		numOfAttTroopToKillAllDefTroop = (defTroopForThisRound.quantity * defTroopForThisRound.quantity * defResilience) / 
		      (attTroopForThisRound.quantity * acr * troopsRps[defTroopForThisRound.troop][attTroopForThisRound.troop + 'Att'] * ((fatalityPercent/numOfRounds)/100));

		if((attTroopForThisRound.quantity - numOfAttTroopToKillAllDefTroop) > 0){ //Meaning the attacker troop has enought troops to kill all defender troop
			return numOfAttTroopToKillAllDefTroop;
		}
		else{ //If the divided attacker troop is not enough, calc how much it can kill
			numOfAttTroopToKillAllDefTroop = attTroopForThisRound.quantity;
			return numOfAttTroopToKillAllDefTroop;
		}
	};

	function calcDefenderLosses(attTroopForThisRound, defTroopForThisRound){

		//         Na           Att * RPSa(dc)* boostatt 
	    //Kills = ---- * Acr * ------------------------  * F * Fr
	    //         Nd                Rd* boostdef
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
		if(defTroopForThisRound.tier === 't4'){
			defResilience = 4;
		}
		if(defTroopForThisRound.tier === 't5'){
			defResilience = 5;
		}

		var Na = attTroopForThisRound.quantity;  //Number of Troops in the Attacker’s side
		var Nd = defTroopForThisRound.quantity;   //Number of Troops in the Defender’s side
		var Att = attTroopForThisRound.quantity * attBoostAtt;//Attack net Ratio of Attacker Unit  (after attack boost impacts)
		var Acr = accuracy;  //Accuracy of Attacker troop (includes the random factor)
		var RPSa = troopsRps[defTroopForThisRound.troop][attTroopForThisRound.troop + 'Att']; //Attacker-Type’s RPS Ratio against the Defender Type
		var F = fatalityPercent;    //fatality ratio
		var Fr = ((fatalityPercent/(numOfRounds*100)));    //fatality ratio per round  <<<< Does fatality ratio changes form round to round? <<<<<<<<
		var Rd = defResilience * defBoostDef;   //Defender’s Resilience net ratio (after defense and health boosts impacts).

		var temp1 = (Na/Nd)*Acr;
		var temp2 = (Att*RPSa)/Rd;

		defenderLosses = temp1 * temp2 /* *F */* Fr; 

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
		if(attTroopForThisRound.tier === 't4'){
			attResilience = 4;
		}
		if(attTroopForThisRound.tier === 't5'){
			attResilience = 5;
		}

		var Na = minAtt;  //Number of Troops in the Attacker’s side
		var Nd = defTroopForThisRound.quantity;  //Number of Troops in the Defender’s side
		var Def = defTroopForThisRound.quantity * defBoostAtt; //Defence net Ratio of Defender’s Unit  (after defence boost impacts)
		var Acr = accuracy;  //Accuracy of Defender troop (includes the random factor)
		var RPSd = troopsRps[attTroopForThisRound.troop][defTroopForThisRound.troop + 'Def']; //Attacker-Type’s RPS Ratio against the Defender Type
		var F = fatalityPercent;    //fatality ratio
		var Fr = ((fatalityPercent/numOfRounds)/100);   //fatality ratio per round 
		var Ra = attResilience * attBoostDef;   //Attacker’s Resilience net ratio (after defense and health boosts impacts).

		var temp1 = (Nd/Na)*Acr;
		var temp2 = (Def*RPSd)/Ra;

		attackerLosses = temp1 * temp2 /** F */* Fr; 

		return attackerLosses;
	};
	
	function calcMight(troopLost){
		var i = 0;
		var might = 0;

		for(i=0; i<tiers.length; i++){
			might += troopLost[tiers[i]] * avgMight[tiers[i]]; //mightCoef[troopLost.troop][tiers[i]]
		}

		return might;
	};

	function produceBattleReport(){
		// console.log('Attacker army end of battle state : ');
		// console.log(JSON.stringify(endOfBattleAttArmyState));
		// console.log('Defender army end of battle state : ');
		// console.log(JSON.stringify(endOfBattleDefArmyState));
	};

	function declareWinner(){

		var attMightLost = calcMight(attTroppsLost);
		var defMightLost = calcMight(defTroopsLost);
		var attWL = 0;
		var defWL = 0;

		if(defMightLost > attMightLost){
			console.log('Attacker won the battle! ');

		}
		if(defMightLost === attMightLost){
			console.log('Its a tie');

		}
		if(defMightLost < attMightLost){
			console.log('Defender won the battle! ');
		}
		console.log('Attacker might lost =  ' + attMightLost);
		console.log('Defender might lost =  ' + defMightLost);

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
