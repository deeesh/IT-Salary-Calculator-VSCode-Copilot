import React, { useState } from 'react';

const SalaryForm = () => {
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');

  interface SalaryFormState {
    salary: string;
    currency: string;
  }

  interface SalaryFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: SalaryFormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(`Salary: ${salary}, Currency: ${currency}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="salary">Salary:</label>
        <input
          type="number"
          id="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="currency">Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          {/* Add more currency options as needed */}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SalaryForm;