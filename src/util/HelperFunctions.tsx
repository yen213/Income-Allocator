import Big from "big.js";

// Calculates the value of income based on a percentage
export const calcValue = (income: number, val: number | undefined): number => {
  try {
    let bigEnteredVal = new Big(val || 0);
    let bigIncome = new Big(income || 1);
    let ans = bigEnteredVal.div(100).times(bigIncome).toNumber();

    return ans;
  } catch (e) {
    console.log(e);
  }

  return 0;
};

// Calculates the percentage of income based on a value
export const calcPercentage = (
  income: number,
  val: number | undefined
): number => {
  try {
    let bigEnteredVal = new Big(val || 0);
    let bigIncome = new Big(income || 1);
    let ans = bigEnteredVal.times(100).div(bigIncome).toNumber();
    console.log(ans);

    return ans;
  } catch (e) {
    console.log(e);
  }

  return 0;
};
