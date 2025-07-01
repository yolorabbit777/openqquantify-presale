import React, { useState, useEffect } from 'react';
import { Battery } from 'components/Battery';
import './index.scss'; // Assume this CSS makes the overlay cover the screen

export const LoadingOverlay = ({ isLoading, setLoading }) => {
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isLoading) {
      interval = setInterval(() => {
        if (charge >= 100) {
            setCharge(0);
        } else {
            setCharge(charge + 2);
        }
      }, 700); // Adjust the timing as needed
    }

    if (!isLoading) {
        setCharge(0)
    }

    return () => clearInterval(interval);
  }, [isLoading, charge, setLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="overlay">
      <Battery charge={charge} />
    </div>
  );
};
