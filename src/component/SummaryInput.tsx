import React from "react";

import { useData } from "../context/DataContext";

import NumberFormat from "react-number-format";

// Define the props type
type Props = {
  valueStyle: Object;
  percentStyle: Object;
  title: String;
  value: number;
  percent: number;
};

/**
 * Renders the summary input fields. Text color and values change based
 * on user input
 */
const SummaryInput: React.FC<Props> = ({
  title,
  valueStyle,
  value,
  percentStyle,
  percent,
}) => {
  // Use context states
  const { total, totalPercentage } = useData();

  return (
    <div className="col center" style={{ marginBottom: "-1rem" }}>
      <p
        style={{
          color: total < 0 || totalPercentage < 0 ? "red" : "green",
        }}
        className="income-left"
      >
        {title}&nbsp;
      </p>
      <p>
        <NumberFormat
          style={valueStyle}
          className="income-left"
          decimalScale={2}
          decimalSeparator={"."}
          value={value}
          fixedDecimalScale={true}
          prefix="$"
          displayType="text"
          thousandSeparator={true}
        />
      </p>
      <p>&emsp;</p>
      <p>
        <NumberFormat
          className="income-left"
          style={percentStyle}
          decimalScale={2}
          decimalSeparator={"."}
          value={percent}
          fixedDecimalScale={true}
          prefix={"("}
          suffix={")%"}
          displayType="text"
          thousandSeparator={true}
        />
      </p>
    </div>
  );
};

export default SummaryInput;
