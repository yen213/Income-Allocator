import { createContext, useContext, useState } from "react";

import { EQUAL_ZERO } from "../constant/ErrorText";

// Define the data structure for the Charts.js library
export interface DataStructure {
  labels: string[];
  datasets: {
    // label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

// Define the data structure for the user input information
interface Payment {
  label: string | undefined;
  value: number | undefined;
  percentage: number | undefined;
}

// Define the type for the context
type DataContextType = {
  data: DataStructure | undefined | null;
  setData: (val: DataStructure | null) => void;
  income: 0 | number;
  setIncome: (val: number) => void;
  inputList: Payment[];
  setInputList: (val: Payment[]) => void;
  total: number;
  setTotal: (val: number) => void;
  totalPercentage: number;
  setTotalPercentage: (val: number) => void;
  errorText: String;
  setErrorText: (val: String) => void;
  showError: boolean;
  setShowError: (val: boolean) => void;
};

// Define the props type
type Props = {
  children: React.ReactNode;
};

// Checks that a component higher up in the component is wrapped with
// the DataProvider before using the context. Takes care of having
// to do undefined checks for context data
export const createDataContext = <DataContextType,>() => {
  const context = createContext<DataContextType | undefined>(undefined);

  const useDataContext = () => {
    const c = useContext(context);

    if (!c) {
      throw new Error(
        "useDataContext is not inside a Provider with a value. Check that a component " +
          "is wrapped with the DataProvider."
      );
    }

    return c;
  };

  return [useDataContext, context.Provider] as const;
};

// Get the context and provider
const [useData, CtxProvider] = createDataContext<DataContextType>();

// Custom hook to consume the data context
export { useData };

// Data provider to provide the state and state function to children components
export const DataProvider = ({ children }: Props) => {
  const [errorText, setErrorText] = useState<String>(EQUAL_ZERO);
  const [showError, setShowError] = useState<boolean>(false);
  const [data, setData] = useState<DataStructure | null>();
  const [income, setIncome] = useState<number>(0);
  const [total, setTotal] = useState<number>(income);
  const [totalPercentage, setTotalPercentage] = useState(100);
  const [inputList, setInputList] = useState<Payment[]>([
    { label: undefined, value: undefined, percentage: undefined },
  ]);

  return (
    <CtxProvider
      value={{
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
        errorText,
        setErrorText,
        showError,
        setShowError,
      }}
    >
      {children}
    </CtxProvider>
  );
};
