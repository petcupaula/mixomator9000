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
 * Adds a set of mock Drinks to the Cloud Firestore.
 */
Mixomator9000.prototype.addMockDrinks = function() {
  var promises = [];

  var promise = this.addDrink({
    name: "Test Drink",
    type: "nonalcoholic",
    ingredients: {
      orangejuice: 100,
      vodka: 100
    }
  });

  if (!promise) {
    alert('addDrink() is not implemented yet!');
    return Promise.reject();
  } else {
    promises.push(promise);
  }

  return Promise.all(promises);
};