import { DataStructure, useData } from "../context/DataContext";
import { backgroundColor, borderColor } from "../constant/PieCharBgColor";

/**
 * Returns the data object needed for the pie chart
 */
const useBuildDataObj = (): DataStructure => {
  // Use context states
  const { income, inputList } = useData();

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

  if (inputList.length > 0 && income !== 0) {
    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i].value && inputList[i].value !== 0) {
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
  }

  return dataObj;
};

export default useBuildDataObj;
