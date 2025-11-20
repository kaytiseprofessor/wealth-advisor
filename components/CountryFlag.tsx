import React from 'react';

interface CountryFlagProps {
  code: string;
  name: string;
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ code, name, className }) => {
  return (
    <img 
      src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w320/${code.toLowerCase()}.png 2x`}
      alt={`${name} flag`}
      className={className}
      loading="lazy"
    />
  );
};

export default CountryFlag;