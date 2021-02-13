import React, { useCallback, useEffect } from "react";
import NumberFormat from "react-number-format";
import { useData } from "./DataContext";
import Big from "big.js";

export const PaymentInformation: React.FC = () => {
  const {
    income,
    inputList,
    setInputList,
    total,
    setTotal,
    totalPercentage,
    setTotalPercentage,
  } = useData();

  // Removes an input group at a particular index
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];

    list.splice(index, 1);
    setInputList(list);
  };

  // Adds another input group at the end of the list if there is income available
  const handleAddClick = () => {
    if (total > 0) {
      setInputList([
        ...inputList,
        { label: "", value: undefined, percentage: undefined },
      ]);
    }
  };

  // Changes the value of the label property for an object at a specific index
  const changeLabel = (value: string, index: number) => {
    const list = [...inputList];
    list[index] = { ...list[index], label: value || "" };

    setInputList(list);
  };

  // Changes the value of the value and percentage property for an object at a
  // specific index.
  const changeValue = (val: number = 0, index: number) => {
    const list = [...inputList];
    list[index] = {
      ...list[index],
      value: val,
    };

    setInputList(list);
  };

  // Changes the value of the value and percentage property for an object at a
  // specific index.
  const changePercentage = (val: number = 0, index: number) => {
    const list = [...inputList];
    list[index] = {
      ...list[index],
      percentage: val,
    };

    setInputList(list);
  };

  // Calculates the percentage of income based on a value
  const calculatePercentage = (val: number | undefined): number => {
    try {
      let bigEnteredVal = new Big(val || 0);
      let bigIncome = new Big(income);
      let ans = bigEnteredVal.times(100).div(bigIncome).toNumber();
      console.log(ans);

      return ans;
    } catch (e) {
      console.log(e);
    }

    return 0;
  };

  // Calculates the value of income based on a percentage
  const calculateValue = (val: number | undefined): number => {
    try {
      let bigEnteredVal = new Big(val || 0);
      let bigIncome = new Big(income);
      let ans = bigEnteredVal.div(100).times(bigIncome).toNumber();
      console.log(ans);

      return ans;
    } catch (e) {
      console.log(e);
    }

    return 0;
  };

  // Calculates the total income left after allocation
  const calcTotal = useCallback(() => {
    try {
      let bigIncome = new Big(income).toNumber();
      let newTotal = inputList.reduce((acc, currentValue) => {
        let bigAcc = new Big(acc || 0);
        let bigCurrent = new Big(currentValue.value || 0);
        let ans = bigAcc.minus(bigCurrent).toNumber();

        console.log(ans);

        return ans;
      }, bigIncome);

      setTotal(new Big(newTotal).round(2, 1).toNumber());
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line
  }, [income, inputList]);

  // Calculates the total income left after allocation
  const calcTotalPercentage = useCallback(() => {
    try {
      let newTotal = inputList.reduce((acc, currentValue) => {
        let bigAcc = new Big(acc || 0);
        let bigCurrent = new Big(currentValue.percentage || 0);
        let ans = bigAcc.minus(bigCurrent).toNumber();

        console.log(ans);

        return ans;
      }, 100);

      setTotalPercentage(new Big(newTotal).round(2, 1).toNumber());
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line
  }, [income, inputList]);

  useEffect(() => {
    calcTotal();
    calcTotalPercentage();
    // eslint-disable-next-line
  }, [inputList, income]);

  return (
    <div>
      {inputList.map((x, i) => {
        return (
          <div key={i}>
            <input
              name="Payment"
              placeholder="Payment for"
              value={x.label || ""}
              onFocus={(e) => e.target.select()}
              onChange={(e) => changeLabel(e.target.value, i)}
            />
            <NumberFormat
              value={x.value}
              allowNegative={false}
              displayType={"input"}
              thousandSeparator={true}
              decimalSeparator={"."}
              placeholder="Amount"
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={"$"}
              onBlur={() => changePercentage(calculatePercentage(x.value), i)}
              onFocus={(e) => e.target.select()}
              onValueChange={({ floatValue }) => changeValue(floatValue, i)}
            />
            <NumberFormat
              value={x.percentage}
              allowNegative={false}
              displayType={"input"}
              thousandSeparator={true}
              decimalSeparator={"."}
              placeholder="Percentage"
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={"%"}
              onBlur={() => changeValue(calculateValue(x.percentage), i)}
              onFocus={(e) => e.target.select()}
              onValueChange={({ floatValue }) =>
                changePercentage(floatValue, i)
              }
            />
            <div>
              {inputList.length > 1 && (
                <button onClick={() => handleRemoveClick(i)}>Remove</button>
              )}
              {inputList.length - 1 === i && (
                <button onClick={handleAddClick}>Add</button>
              )}
            </div>
          </div>
        );
      })}
      <p>
        Income Left: ${total} ({totalPercentage}%)
      </p>
      {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
    </div>
  );
};
