import { shuffle } from "./shuffle";

const cards = ["ace", "king", "queen", "jack"];
const shuffledCards = shuffle(cards);

console.log(shuffledCards);
console.log(cards); // The original order is unchanged.
