'use strict';

// To only deploy the functions use: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

let firestore = admin.firestore()
function updateMenu() { 
	let drinks = firestore.collection('drinks').get();
	let pumps = firestore.collection('pumps').get();
	return Promise.all([drinks, pumps]).then((res) => {
	   let allDrinks = res[0];
	   let allPumps = res[1];
	   let ingredients = allPumps.docs.map(
	       pump => pump.get('value')
	   ).filter(
	       ingredient => {return ingredient; }
	   ).reduce((map, obj) => { map[obj] = true; return map; }, {});
	   let batch = firestore.batch();
	   allDrinks.forEach(drink => {
		   let drinkIngredients = drink.get('ingredients');
		   if (Object.keys(drinkIngredients).some((ingredient) => !ingredients[ingredient])) {
			   if (drink.get('available')) { 
				batch.update(drink.ref, {available: false});
			   }
		   } else {
			   if (!drink.get('available')) {
				batch.update(drink.ref, {available: true});
			   }
	           }
            });
	    return batch.commit();
	}).catch(err => console.log(err));
}

exports.makeMenu = functions.firestore.document('/pumps/{pumpId}')
    .onUpdate((change, context) => {
        var oldIngredient = change.before.data().value;
        var newIngredient = change.after.data().value;
	if (oldIngredient !== newIngredient) {
		return updateMenu();
        }
	return Promise.resolve("ok");
});
