import { useEffect, useState } from 'react';
import RCslider from 'rc-slider';
import 'rc-slider/assets/index.css';

const { Handle } = RCslider;

const SliderHandle = (props: any) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Handle value={value} {...restProps}>
      <div className='inner'>
        <div className={`wdc-tooltip${dragging ? ' active' : ''}`}>
          <span className='wdc-tooltip-inner'>{value}</span>
        </div>
      </div>
    </Handle>
  );
};

const Slider = (props: any) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  const handleSlide = (sliderValue: number) => {
    setValue(sliderValue);
  };

  return <RCslider handle={SliderHandle} {...props} value={value} onChange={handleSlide} />;
};

export default Slider;
