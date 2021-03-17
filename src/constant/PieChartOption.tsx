// Constant for the options configuration passed in to the options
// prop on the chart pie chart component
const option = (income: number) => {
  return {
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
};

export default option;
