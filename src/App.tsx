import Big from "big.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import NumberFormat from "react-number-format";
import { DataStructure, useData } from "./DataContext";
import { PaymentInformation } from "./PaymentInformation";

export const App: React.FC = () => {
  const EQUAL_ZERO = "Income left must equal 0";
  const EMPTY_INFO = "Missing income and allocation information";
  const EMPTY_INCOME = "Enter an income first";

  const [errorText, setErrorText] = useState(EQUAL_ZERO);

  // States
  const [showError, setShowError] = useState<boolean>(false);
  const [modifyIncome, setModifyIncome] = useState(true);
  const {
    data,
    setData,
    income,
    setIncome,
    inputList,
    setInputList,
    total,
    setTotal,
    totalPercentage,
    setTotalPercentage,
  } = useData();

  // Constants for colors
  const backgroundColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(115, 255, 173, 0.2)",
    "rgba(214, 90, 56, 0.2)",
    "rgba(48, 134, 219, 0.2)",
    "rgba(24, 201, 148, 0.2)",
  ];

  const borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(115, 255, 173, 0.2)",
    "rgba(214, 90, 56, 0.2)",
    "rgba(48, 134, 219, 0.2)",
    "rgba(24, 201, 148, 0.2)",
  ];

  // Constant for the options configuration passed in to the options
  // prop on the chart pie chart component
  const option = {
    responsive: true,
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: `Income Allocation of $${income
        .toFixed(2)
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`,
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          let meta = dataset._meta[Object.keys(dataset._meta)[0]];
          let total = meta.total;
          let currentValue = dataset.data[tooltipItem.index];
          let percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(2)
          );
          return `$${currentValue}  (${percentage}%)`;
        },
        title: (tooltipItem: any, data: any) =>
          data.labels[tooltipItem[0].index].split(":")[0],
      },
    },
  };

  const buildDataObj = () => {
    if (inputList.length > 0 && income !== 0) {
      let dataObj: DataStructure = {
        labels: [""],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };

      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].value) {
          dataObj.labels[i] = `${inputList[i].label || "none"}: $${
            inputList[i].value
              ?.toFixed(2)
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") ||
            Number(0).toFixed(2)
          }`;
          dataObj.datasets[0].data[i] = inputList[i].value || 0;
          dataObj.datasets[0].backgroundColor[i] =
            backgroundColor[i] || backgroundColor[0];
          dataObj.datasets[0].borderColor[i] =
            borderColor[i] || backgroundColor[0];
        }
      }

      dataObj.datasets[0].borderWidth = 1;

      setData(dataObj);
    }
  };

  const handleSubmit = () => {
    if (new Big(total).round(2, 1).toNumber() === 0 && income !== 0) {
      console.log(total);
      setShowError(false);
      buildDataObj();
      setModifyIncome(false);

      return;
    }

    if (total !== 0 && total !== income) {
      setErrorText(EQUAL_ZERO);
    } else if (income === 0) {
      console.log(income);
      setErrorText(EMPTY_INCOME);
    } else if (!data) {
      setErrorText(EMPTY_INFO);
    }

    setShowError(true);
    console.log(total);
    console.log(income);
  };

  // Resets
  const handleReset = () => {
    setData(null);
    setIncome(0);
    setTotal(0);
    setTotalPercentage(100);
    setInputList([{ label: undefined, value: 0, percentage: 0 }]);
    setModifyIncome(true);
  };

  const ResetButton = () => {
    return (
      <button className="form-button reset-button" onClick={handleReset}>
        Reset
      </button>
    );
  };

  useEffect(() => {
    setInputList([{ label: undefined, value: 0, percentage: 0 }]);
  }, [income, setInputList]);

  return (
    <div>
      {modifyIncome && (
        <div>
          <h1 className="center title">Income Allocator</h1>
          <div className="container-sm center income">
            <div className="form-field">
              <NumberFormat
                className="input-text"
                name="income"
                required
                autoComplete="off"
                fixedDecimalScale={true}
                value={income}
                allowNegative={false}
                displayType="input"
                thousandSeparator={true}
                decimalSeparator={"."}
                decimalScale={2}
                prefix={"$"}
                onFocus={(e) => e.target.select()}
                onValueChange={({ floatValue }) => setIncome(floatValue || 0)}
              />
              <label className="input-label" htmlFor="income">
                Income
              </label>
            </div>
          </div>
          <PaymentInformation />
          <div className="center col-sm-12">
            {showError && (total !== 0 || !data) && (
              <p className="error-text">{errorText}</p>
            )}
          </div>
          <div className="row">
            <div className="col-12 center" style={{ marginBottom: "-7.3rem" }}>
              <NumberFormat
                style={{
                  color: income - total > income ? "red" : "green",
                }}
                className="income-left"
                decimalScale={2}
                decimalSeparator={"."}
                value={income - total}
                fixedDecimalScale={true}
                prefix={"Currently Allocated: $"}
                displayType={"text"}
                thousandSeparator={true}
              />
              <NumberFormat
                className="income-left"
                style={{
                  marginLeft: "1.2rem",
                  color: 100 - totalPercentage > 100 ? "red" : "green",
                }}
                decimalScale={2}
                decimalSeparator={"."}
                value={100 - totalPercentage}
                fixedDecimalScale={true}
                prefix={" ("}
                suffix={")%"}
                displayType={"text"}
                thousandSeparator={true}
              />
            </div>
            <div className="col-12 center">
              <span
                style={{
                  color: total < 0 || totalPercentage < 0 ? "red" : "green",
                  marginRight: "0.325rem",
                }}
                className="income-left"
              >
                Income Left:
              </span>
              <NumberFormat
                className="income-left"
                decimalScale={2}
                decimalSeparator={"."}
                style={{
                  color: total < 0 || totalPercentage < 0 ? "red" : "green",
                }}
                isNumericString={true}
                value={total}
                fixedDecimalScale={true}
                prefix={"$"}
                displayType={"text"}
                thousandSeparator={true}
              />
              <NumberFormat
                className="income-left"
                decimalScale={2}
                decimalSeparator={"."}
                style={{
                  color: total < 0 || totalPercentage < 0 ? "red" : "green",
                  marginLeft: "1.2rem",
                }}
                value={income === 0 ? 0 : totalPercentage}
                fixedDecimalScale={true}
                prefix={" ("}
                suffix={")%"}
                displayType={"text"}
                thousandSeparator={true}
              />
            </div>
          </div>
          <div className="reset-submit-button center row-sm-12">
            <button
              className="form-button submit-button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <ResetButton />
          </div>
          <p className="note-message">
            *Due to the rounding of decimal places for the calculations, Income
            Left may sometimes be off by (+/-) 0.01-0.09 cents/percentage. In
            this case, use the non-percentage value for Income Left and add it
            to another income breakdown.*
          </p>
        </div>
      )}
      {data != null && !modifyIncome && (
        <div>
          <div className="center row-sm-12">
            <Pie data={data} width={550} height={320} options={option} />
          </div>
          <div className="reset-submit-button center row-sm-12">
            <button
              className="form-button submit-button"
              onClick={() => setModifyIncome(true)}
            >
              Edit
            </button>
            <ResetButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
