import React from 'react';

interface SalaryResultProps {
  salary: number;
  tax: number;
  netSalary: number;
}

const SalaryResult: React.FC<SalaryResultProps> = ({ salary, tax, netSalary }) => {
  return (
    <div className="salary-result">
      <h2>Salary Calculation Result</h2>
      <p>Gross Salary: ${salary.toFixed(2)}</p>
      <p>Tax Deducted: ${tax.toFixed(2)}</p>
      <p>Net Salary: ${netSalary.toFixed(2)}</p>
    </div>
  );
};

export default SalaryResult;