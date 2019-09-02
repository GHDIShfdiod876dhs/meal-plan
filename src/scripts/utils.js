import conversions from './conversions';
import { db } from './firebase';
import { usdaMap } from './usdaMap';

export const oMap = (obj, mapFn) => Object.entries(obj).map(mapFn);

export const capitalize = word => word[0].toUpperCase() + word.slice(1);
export const formatNum = (num, precision = 1) => parseFloat(num.toFixed(precision));

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const sum = arr => arr.reduce((acc, val) => acc + val);

const getUnits = arr => arr.map(elem => elem.match(/[A-Za-z]+$/)[0]);

const getNumbers = arr => arr.map(elem => parseFloat(elem));

export const getTotal = arr => {
  const numbers = getNumbers(arr)
  const units = getUnits(arr)
  if (units.every(unit => unit === units[0])) {
    const number = sum(numbers)
    const unit = units[0]
    return `${number}${unit}`
  } else {
    const factors = units.map(unit => conversions[unit])
    const baseNumbers = numbers.map((number, idx) => number * factors[idx])
    const baseSum = sum(baseNumbers)
    const sums = units.map(unit => +(baseSum / conversions[unit]).toFixed(2))
    const results = sums.map((sum, idx) => sum + units[idx])
    return results.join('/')
  }
};

const scaleNutritionData = ({ ingredient, amount }) => {
  const {
    serving_qty,
    serving_weight_grams,
    full_nutrients,
    alt_measures
  } = ingredient;
  const count = parseFloat(amount);
  const unit = amount.match(/[a-zA-Z]+(?: [a-zA-Z]+)?/)[0].toLowerCase();
  const denom = serving_qty * serving_weight_grams;
  let unitIdx = alt_measures.findIndex(m => m.measure === unit);
  if (unitIdx === -1) {
    unitIdx = alt_measures.findIndex(m => m.measure.includes(unit))
  }
  let k;

  if (unitIdx !== -1) {
    k = count * alt_measures[unitIdx].serving_weight / denom;
  }
  else if (unit in conversions.mass) {
    k = count * conversions.mass[unit] / denom;
  }
  else if (unit in conversions.volume) {
    const gramsPerCup =
    alt_measures.find(m => m.measure === 'cup' && m.qty === 1).serving_weight;
    k = count * conversions.volume[unit] * gramsPerCup / denom;
  }
  else {
    console.log('something went wrong');
  }

  return full_nutrients.reduce((acc, n) => ({
    ...acc,
    [n.attr_id]: +(n.value * k).toFixed(3)
  }), {});
};

export const addNutritionData = (prevData, newIngredient) => {
  const attrIds = Object.keys(usdaMap);
  const ingredientData = scaleNutritionData(newIngredient);
  return Object.fromEntries(attrIds
    .map(k => [k, (prevData[k] || 0) + (ingredientData[k] || 0)]));
  // return attrIds
  //   .map(k => [k, (prevData[k] || 0) + (ingredientData[k] || 0)])
  //   .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

export const subtractNutritionData = (prevData, ingredient) => {
  const negIngredient = {
    ...ingredient,
    amount: `-${ingredient.amount}`
  };
  return addNutritionData(prevData, negIngredient);
}

export const getRecipeRef = params => db.collection('recipes').doc(params.id);

export const getNutritionDetailsSubset = (nutritionDetails, subset) =>
  subset.map(item => {
    const [[nutrient, sublist]] = Object.entries(item);
    return {
      ...nutritionDetails[nutrient],
      nutrient,
      sublist: sublist.map(n => ({ ...nutritionDetails[n], nutrient: n })) 
    };
  });
