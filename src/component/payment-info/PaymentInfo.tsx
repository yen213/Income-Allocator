import React, { useEffect } from "react";

import useCalcTotalPercentage from "../../custom-hook/CalcTotalPercentage";
import useCalcTotalValue from "../../custom-hook/CalcTotalValue";
import ErrorText from "../ErrorText";
import PaymentInfoInput from "./PaymentInfoInput";

import { useData } from "../../context/DataContext";
import { calcValue, calcPercentage } from "../../util/HelperFunctions";
import {
  EMPTY_INCOME,
  EQUAL_ZERO,
  MAX_10,
  NO_INCOME_LEFT,
} from "../../constant/ErrorText";

/**
 * Renders the income breakdown group
 */
const PaymentInfo: React.FC = () => {
  // Custom hooks
  const totalPercentage = useCalcTotalPercentage();
  const totalValue = useCalcTotalValue();

  // Use context states
  const {
    income,
    inputList,
    setInputList,
    total,
    setTotal,
    showError,
    setShowError,
    setTotalPercentage,
    setErrorText,
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
    } else if (total < 0) {
      setErrorText(EQUAL_ZERO);
      setShowError(true);
    } else {
      setErrorText(NO_INCOME_LEFT);
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

  useEffect(() => {
    setTotalPercentage(totalPercentage);
    setTotal(totalValue);
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
            <PaymentInfoInput
              label={"Amount"}
              name={"amount"}
              val={x.value}
              prefix={"$"}
              suffix={undefined}
              onBlur={() =>
                changePercentage(calcPercentage(income, x.value), i)
              }
              onChange={(val: number | undefined) => changeValue(val, i)}
            />
            <PaymentInfoInput
              label={"Percentage"}
              name={"percentage"}
              val={x.percentage}
              prefix={undefined}
              suffix={"%"}
              onBlur={() => changeValue(calcValue(income, x.percentage), i)}
              onChange={(val: number | undefined) => changePercentage(val, i)}
            />
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
          </div>
        );
      })}
      {showError && <ErrorText />}
    </div>
  );
};

export default PaymentInfo;
