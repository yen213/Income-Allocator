import { useCallback } from "react";

import { useData } from "../context/DataContext";

import Big from "big.js";

// / Calculates the percentage of total income left after allocation
const useCalcTotalPercentage = (): number => {
  // Use context states
  const { income, inputList } = useData();

  // Memoize the calculation
  const val = useCallback((): number => {
    try {
      let newTotal = inputList.reduce((acc, currentValue) => {
        let bigAcc = new Big(acc || 0);
        let bigCurrent = new Big(currentValue.percentage || 0);
        let ans = bigAcc.minus(bigCurrent).toNumber();

        return ans;
      }, 100);

      return new Big(newTotal).round(2, 0).toNumber();
    } catch (e) {
      console.log(e);

      return 0;
    }
    // eslint-disable-next-line
  }, [income, inputList]);

  return val();
};

export default useCalcTotalPercentage;
