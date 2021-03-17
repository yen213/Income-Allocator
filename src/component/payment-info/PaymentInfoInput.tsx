import React from "react";

import NumberFormat from "react-number-format";

// Define the props type
type Props = {
  label: string;
  name: string;
  val: number | undefined;
  prefix: string | undefined;
  suffix: undefined | string;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onChange: any;
};

/**
 * Renders the income breakdown input group value and percentage fields
 */
const PaymentInfoInput: React.FC<Props> = ({
  label,
  name,
  val,
  prefix,
  suffix,
  onBlur,
  onChange,
}) => {
  return (
    <div className="form-field col-sm-2">
      <NumberFormat
        required
        className="input-text"
        name={name}
        autoComplete="off"
        value={val}
        allowNegative={false}
        displayType={"input"}
        thousandSeparator={true}
        decimalSeparator={"."}
        decimalScale={2}
        fixedDecimalScale={true}
        prefix={prefix}
        suffix={suffix}
        onBlur={onBlur}
        onFocus={(e) => e.target.select()}
        onValueChange={({ floatValue }) => onChange(floatValue)}
      />
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default PaymentInfoInput;
