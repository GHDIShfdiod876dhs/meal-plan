import { db, FieldValue } from './firebase.js';
import { user } from './user.js';


let uid;
user.subscribe(s => uid = s.uid);

export const updateShoppingList = ({ id, servings }, factor = 1) =>
  db.collection('recipes')
    .doc(id)
    .collection('ingredients')
    .get()
    .then(snapshot =>
      snapshot.forEach(doc => {
        console.log('document:', doc.data());
        const { ingredient, amount } = doc.data();
        const total = +(parseFloat(amount) * servings * factor).toFixed(2);
        
        db.collection('shopping lists')
          .doc(uid)
          .collection('items')
          // .doc(doc.id).set({
          .doc(ingredient.food_name).set({
            name: ingredient.food_name,
            need: FieldValue.increment(total),
            have: FieldValue.increment(0),
            total: FieldValue.increment(total),
            unit: amount.match(/^(?:\d*\.?\d{0,2}\s*)(\D+)$/)[1]
          },
          { merge: true });
      })
    )
    .then(
      () => {/*console.log('Shopping list updated!')*/ },
      error => console.error('Error updating shopping list:', error)
    );