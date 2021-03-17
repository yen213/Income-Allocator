import React from "react";

import { useData } from "../context/DataContext";

/**
 * Renders the error text with the current error message
 */
const ErrorText: React.FC = () => {
  // Use context state
  const { errorText } = useData();

  return (
    <div className="center col-sm-12">
      <p className="error-text">{errorText}</p>
    </div>
  );
};

export default ErrorText;
