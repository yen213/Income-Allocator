/**
 * Renders footer message with important user information in regards to using
 * the calculator
 */
const FooterNote = () => {
  return (
    <div className="footer">
      <p>
        *Due to the rounding of decimal places for the calculations, Income Left
        may sometimes be off by (+/-) 0.01 - 0.09 cents/percentage. In this
        case, use the non-percentage value for Income Left and add it to another
        income breakdown.
      </p>
      <p>*Changing income will delete all entered allocation.</p>
    </div>
  );
};

export default FooterNote;
