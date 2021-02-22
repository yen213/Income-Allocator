import React, { useCallback, useEffect } from "react";
import NumberFormat from "react-number-format";
import { useData } from "./DataContext";
import Big from "big.js";

export const PaymentInformation: React.FC = () => {
  const EQUAL_ZERO = "Income left must equal 0";
  const MAX_10 = "A maximum of 10 income breakdowns are allowed";
  const EMPTY_INCOME = "Enter an income first";

  const {
    income,
    inputList,
    setInputList,
    total,
    setTotal,
    setTotalPercentage,
    errorText,
    setErrorText,
    showError,
    setShowError,
  } = useData();

  // Removes an input group at a particular index
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];

    list.splice(index, 1);
    setInputList(list);
  };

  // Adds another input group at the end of the list if there is income available
  const handleAddClick = () => {
    if (total > 0 && inputList.length < 10) {
      setShowError(false);
      setInputList([
        ...inputList,
        { label: "", value: undefined, percentage: undefined },
      ]);
    } else if (inputList.length > 9) {
      setErrorText(MAX_10);
      setShowError(true);
    } else if (income === 0) {
      setErrorText(EMPTY_INCOME);
      setShowError(true);
    } else {
      setErrorText(EQUAL_ZERO);
      setShowError(true);
    }
  };

  // Changes the value of the label property for an object at a specific index
  const changeLabel = (value: string, index: number) => {
    setShowError(false);
    const list = [...inputList];
    list[index] = { ...list[index], label: value || "" };

    setInputList(list);
  };

  // Changes the value of the value and percentage property for an object at a
  // specific index.
  const changeValue = (val: number = 0, index: number) => {
    setShowError(false);
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
    setShowError(false);
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
      let bigIncome = new Big(!income ? 1 : income);
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

      console.log(new Big(newTotal).round(4, 0).toNumber());
      setTotal(new Big(newTotal).round(2, 0).toNumber());
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

      console.log(new Big(newTotal).round(2, 0).toNumber());
      setTotalPercentage(new Big(newTotal).round(2, 0).toNumber());
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line
  }, [income, inputList]);

  useEffect(() => {
    calcTotalPercentage();
    calcTotal();
    // eslint-disable-next-line
  }, [inputList, income]);

  return (
    <div className="container-sm">
      {inputList.map((x, i) => {
        return (
          <div key={i} className="row center">
            <div className="form-field col-sm-2">
              <input
                required
                className="input-text"
                name="description"
                type="text"
                autoComplete="off"
                value={x.label || ""}
                onFocus={(e) => e.target.select()}
                onChange={(e) => changeLabel(e.target.value, i)}
              />
              <label className="input-label" htmlFor="description">
                Description
              </label>
            </div>
            <div className="form-field col-sm-2">
              <NumberFormat
                required
                className="input-text"
                name="amount"
                autoComplete="off"
                value={x.value}
                allowNegative={false}
                displayType={"input"}
                thousandSeparator={true}
                decimalSeparator={"."}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"$"}
                onBlur={() => changePercentage(calculatePercentage(x.value), i)}
                onFocus={(e) => e.target.select()}
                onValueChange={({ floatValue }) => changeValue(floatValue, i)}
              />
              <label className="input-label" htmlFor="amount">
                Amount
              </label>
            </div>
            <div className="form-field col-sm-2">
              <NumberFormat
                required
                className="input-text"
                name="percentage"
                autoComplete="off"
                value={x.percentage}
                allowNegative={false}
                displayType={"input"}
                thousandSeparator={true}
                decimalSeparator={"."}
                decimalScale={2}
                fixedDecimalScale={true}
                suffix={"%"}
                onBlur={() => changeValue(calculateValue(x.percentage), i)}
                onFocus={(e) => e.target.select()}
                onValueChange={({ floatValue }) =>
                  changePercentage(floatValue, i)
                }
              />
              <label className="input-label" htmlFor="percentage">
                Percentage
              </label>
            </div>
            <div className="form-field center col-sm-2">
              {inputList.length - 1 === i && (
                <button className="form-button" onClick={handleAddClick}>
                  Add
                </button>
              )}
              {inputList.length > 1 && (
                <button
                  className="form-button"
                  onClick={() => handleRemoveClick(i)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="center col-sm-12">
              {showError && <p className="error-text">{errorText}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
