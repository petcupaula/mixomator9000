'use strict';

// To only deploy the functions use: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.makeMenu = functions.firestore.document('/pumps/{pumpId}')
    .onUpdate((change, context) => {
        var oldIngredient = change.before.data().value;
        var newIngredient = change.after.data().value;

        if (oldIngredient !== newIngredient) {
            var pumpsRef = change.after.ref.parent;
            var availableIngredients = [];
            pumpsRef.get()
                .then(snapshot => {
                snapshot.forEach(doc => {
                    availableIngredients.push(doc.data().value);
                });
                return availableIngredients;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });

            console.log(availableIngredients);

            var drinksRef = admin.firestore().collection('drinks');
            drinksRef.get()
                .then(snapshot => {
                    const promises = []
                    snapshot.forEach(doc => {
                        var drinkIngredients = doc.data().ingredients;
                        var ing;
                        var counter = 0;
                        for (ing in drinkIngredients) {
                            if (availableIngredients.indexOf(ing.toString()) > -1) {
                                counter = counter + 1;
                            }
                        }
                        console.log(counter);
                        console.log(Object.keys(drinkIngredients).length);
                        if (counter === Object.keys(drinkIngredients).length) {
                            promises.push(doc.ref.update({available: true }));
                        }
                        else {
                            promises.push(doc.ref.update({available: false }));
                        }
                    });
                    return Promise.all(promises);
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });

        }
        // else whatever
})