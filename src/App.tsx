import Big from "big.js";
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import NumberFormat from "react-number-format";
import { DataStructure, useData } from "./DataContext";
import { PaymentInformation } from "./PaymentInformation";

export const App: React.FC = () => {
  const EQUAL_ZERO = "Income left must equal 0";
  const EMPTY_INFO = "Enter some income and break down first";
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
      text: `Income Allocation of $${income}`,
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
        dataObj.labels[i] =
          `${inputList[i].label || ""}: $${inputList[i].value}` || "";
        dataObj.datasets[0].data[i] = inputList[i].value || 0;
        dataObj.datasets[0].backgroundColor[i] =
          backgroundColor[i] || backgroundColor[0];
        dataObj.datasets[0].borderColor[i] =
          borderColor[i] || backgroundColor[0];
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
    } else if (!data) {
      setErrorText(EMPTY_INFO);
    } else {
      setErrorText(EQUAL_ZERO);
    }

    setShowError(true);
    console.log(total);
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

  return (
    <div>
      {modifyIncome && (
        <div>
          <label htmlFor="income">Income: </label>
          <NumberFormat
            value={income}
            allowNegative={false}
            displayType="input"
            thousandSeparator={true}
            decimalSeparator={"."}
            placeholder="Amount"
            decimalScale={2}
            prefix={"$"}
            onFocus={(e) => e.target.select()}
            onValueChange={({ floatValue }) => setIncome(floatValue || 0)}
          />
          <PaymentInformation />
          {showError && <p style={{ color: "red" }}>{errorText}</p>}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {data != null && !modifyIncome && (
        <Pie data={data} width={350} height={120} options={option} />
      )}
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;
