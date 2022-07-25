import React from 'react';

export const GreenLed = (): any => (
  <div className='led-box' title='running'>
    <div className='led-green' />
  </div>
);
export const YellowLed = () => (
  <div className='led-box' title='starting'>
    <div className='led-yellow' />
  </div>
);
export const YellowLedBlink = () => (
  <div className='led-box' title='starting'>
    <div className='led-yellow-blink' />
  </div>
);
export const RedLed = (): any => (
  <div className='led-box' title='not running'>
    <div className='led-red' />
  </div>
);
export const RedLedBlink = () => (
  <div className='led-box' title='not running'>
    <div className='led-red-blink' />
  </div>
);
export const BlueLed = () => (
  <div className='led-box' title='startup'>
    <div className='led-blue' />
  </div>
);
