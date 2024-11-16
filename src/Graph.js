import React from 'react';
import { Line } from 'react-chartjs-2';

const Graph = ({ data, options }) => {
  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
