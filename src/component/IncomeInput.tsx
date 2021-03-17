import React from "react";

import { useData } from "../context/DataContext";

import NumberFormat from "react-number-format";

/**
 * Renders the input and label field for entering income
 */
const IncomeInput: React.FC = () => {
  // Use context states
  const { income, setIncome } = useData();

  return (
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
  );
};

export default IncomeInput;
