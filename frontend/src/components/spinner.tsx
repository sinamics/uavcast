import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = ({ children, size = 'massive' }: any) => {
  return (
    <Dimmer active>
      <Loader size={size} children={children} />
    </Dimmer>
  );
};

export default Spinner;
