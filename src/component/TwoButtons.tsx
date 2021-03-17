import React from "react";

// Define the props type
type Props = {
  buttonText1: String;
  buttonText2: String;
  onClick1: () => void;
  onClick2: () => void;
};

/**
 * Renders two buttons next to each other with custom button text and
 * click handlers
 */
const TwoButtons: React.FC<Props> = ({
  buttonText1,
  buttonText2,
  onClick1,
  onClick2,
}) => {
  return (
    <div className="reset-submit-button center row-sm-12">
      <button className="form-button submit-button" onClick={onClick1}>
        {buttonText1}
      </button>
      <button className="form-button reset-button" onClick={onClick2}>
        {buttonText2}
      </button>
    </div>
  );
};

export default TwoButtons;
