import { roundTo } from "./roundTo";

const price = roundTo(1.005, 2);
// 1.01

const nearestHundred = roundTo(1_250, -2);
// 1300
