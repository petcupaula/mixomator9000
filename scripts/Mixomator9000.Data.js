/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

Mixomator9000.prototype.addDrink = function(data) {
  var collection = firebase.firestore().collection('drinks');
  var that = this;
  return collection.add(data)
  .then(function() {
    //console.log("Document successfully updated!");
    that.updateMenu();
  });
};

Mixomator9000.prototype.getAllDrinks = function(render) {
  var query = firebase.firestore()
    .collection('drinks')
    .orderBy('name', 'asc')
    .limit(50);
  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.getAvailableDrinks = function(render) {
  var query = firebase.firestore()
    .collection('drinks')
    .where('available', '==', true)
    .orderBy('name', 'asc')
    .limit(50);
  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.getAllPumps = function(render) {
  var query = firebase.firestore()
    .collection('pumps')
    .orderBy('name', 'asc')
    .limit(50);
  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.getDocumentsInQuery = function(query, render) {
  query.onSnapshot(function (snapshot) {
    if (!snapshot.size) {
      return render();
    }

    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        render(change.doc);
      }
    });
  });
};

Mixomator9000.prototype.getDrink = function(id) {
  return firebase.firestore().collection('drinks').doc(id).get();
};

Mixomator9000.prototype.getFilteredDrinks = function(filters, render) {
  var query = firebase.firestore().collection('drinks');

  if (filters.type !== 'Any') {
    query = query.where('type', '==', filters.type);
  }

  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.getAvailableFilteredDrinks = function(filters, render) {
  var query = firebase.firestore().collection('drinks');
  query = query.where('available', '==', true);

  if (filters.type !== 'Any') {
    query = query.where('type', '==', filters.type);
  }

  this.getDocumentsInQuery(query, render);
};

Mixomator9000.prototype.updatePump = function(pumpID, val) {
  var collection = firebase.firestore().collection('pumps');
  var document = collection.doc(pumpID);

  var that = this;
  return document.update({value: val})
  .then(function() {
      //console.log("Document successfully updated!");
      that.updateMenu();
  })
  /*.catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  })*/;
};

Mixomator9000.prototype.updateDrink = function(drinkId, data) {
  var collection = firebase.firestore().collection('drinks');
  var document = collection.doc(drinkId);

  var that = this;
  return document.update(data)
  .then(function() {
      //console.log("Document successfully updated!");
      that.updateMenu();
  })
  /*.catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  })*/;
};

Mixomator9000.prototype.updateMenu = function() { 
	let drinks = firebase.firestore().collection('drinks').get();
	let pumps = firebase.firestore().collection('pumps').get();
	return Promise.all([drinks, pumps]).then((res) => {
	   let allDrinks = res[0];
	   let allPumps = res[1];
	   let ingredients = allPumps.docs.map(
	       pump => pump.get('value')
	   ).filter(
	       ingredient => {return ingredient; }
	   ).reduce((map, obj) => { map[obj] = true; return map; }, {});
	   let batch = firebase.firestore().batch();
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