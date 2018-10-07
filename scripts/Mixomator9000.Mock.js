/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Adds a set of mock Restaurants to the Cloud Firestore.
 */
Mixomator9000.prototype.addMockDrinks = function() {
  var promises = [];

  var promise = this.addDrink({
    name: "Test Drink",
    type: "nonalcoholic"
  });

  if (!promise) {
    alert('addDrink() is not implemented yet!');
    return Promise.reject();
  } else {
    promises.push(promise);
  }

  return Promise.all(promises);
};

/**
 * Adds a set of mock Ratings to the given Restaurant.
 */
Mixomator9000.prototype.addMockRatings = function(restaurantID) {
  var ratingPromises = [];
  for (var r = 0; r < 5*Math.random(); r++) {
    var rating = this.data.ratings[
      parseInt(this.data.ratings.length*Math.random())
    ];
    rating.userName = 'Bot (Web)';
    rating.timestamp = new Date();
    rating.userId = firebase.auth().currentUser.uid;
    ratingPromises.push(this.addRating(restaurantID, rating));
  }
  return Promise.all(ratingPromises);
};
