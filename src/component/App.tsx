import React, { useEffect, useState } from "react";

import useBuildDataObj from "../custom-hook/DataObject";
import option from "../constant/PieChartOption";
import FooterNote from "./FooterNote";
import IncomeInput from "./IncomeInput";
import PaymentInfo from "./payment-info/PaymentInfo";
import SummaryInput from "./SummaryInput";
import TwoButtons from "./TwoButtons";

import { useData } from "../context/DataContext";
import { EMPTY_INCOME, EMPTY_INFO, EQUAL_ZERO } from "../constant/ErrorText";

import Big from "big.js";

import { Pie } from "react-chartjs-2";

/**
 * Renders main app component
 */
export const App: React.FC = () => {
  // Get the charts data object
  const chartData = useBuildDataObj();

  // Local states
  const [modifyIncome, setModifyIncome] = useState(true);

  // Get context states
  const {
    data,
    setData,
    income,
    setIncome,
    setInputList,
    total,
    setTotal,
    totalPercentage,
    setTotalPercentage,
    setShowError,
    setErrorText,
  } = useData();

  // Check all information required is correct on
  // submit click
  const handleSubmit = () => {
    if (new Big(total).round(2, 1).toNumber() === 0 && income !== 0) {
      setShowError(false);
      setData(chartData);
      setModifyIncome(false);

      return;
    }

    if (total !== 0 && total !== income) {
      setErrorText(EQUAL_ZERO);
    } else if (income === 0) {
      setErrorText(EMPTY_INCOME);
    } else if (!data) {
      setErrorText(EMPTY_INFO);
    }

    setShowError(true);
  };

  // Modify context states on reset click
  const handleReset = () => {
    setData(null);
    setIncome(0);
    setTotal(0);
    setTotalPercentage(100);
    setInputList([{ label: undefined, value: 0, percentage: 0 }]);
    setModifyIncome(true);
  };

  // When income changes, reset all allocation fields to initial
  useEffect(() => {
    setInputList([{ label: undefined, value: 0, percentage: 0 }]);
    // eslint-disable-next-line
  }, [income]);

  return (
    <div className="wrapper">
      {modifyIncome && (
        <div className="content">
          <h1 className="center title">Income Allocator</h1>
          <IncomeInput />
          <PaymentInfo />
          <div className="container-sm">
            <SummaryInput
              title="Currently Allocated:"
              value={income - total}
              percent={100 - totalPercentage}
              valueStyle={{
                color: income - total > income ? "red" : "green",
              }}
              percentStyle={{
                color: 100 - totalPercentage > 100 ? "red" : "green",
              }}
            />
            <SummaryInput
              title="Income Left:"
              value={total}
              percent={income === 0 ? 0 : totalPercentage}
              valueStyle={{
                color: total < 0 || totalPercentage < 0 ? "red" : "green",
              }}
              percentStyle={{
                color: total < 0 || totalPercentage < 0 ? "red" : "green",
              }}
            />
          </div>
          <TwoButtons
            buttonText1="Submit"
            buttonText2="Reset"
            onClick1={handleSubmit}
            onClick2={handleReset}
          />
          <FooterNote />
        </div>
      )}
      {data != null && !modifyIncome && (
        <div style={{ marginBottom: "4rem" }}>
          <div className="center row-sm-12">
            <Pie
              data={data}
              width={360}
              height={130}
              options={option(income)}
            />
          </div>
          <TwoButtons
            buttonText1="Edit"
            buttonText2="Reset"
            onClick1={() => setModifyIncome(true)}
            onClick2={handleReset}
          />
        </div>
      )}
    </div>
  );
};

export default App;
