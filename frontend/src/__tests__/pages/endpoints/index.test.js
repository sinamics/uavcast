// /* eslint-disable space-before-function-paren */
// import { render, screen, fireEvent, cleanup } from '@testing-library/react';
// import Endpoints from '../../../pages/endpoints';
// import Enzyme, { mount } from 'enzyme';
// import { MockedProvider } from '@apollo/client/testing';
// import { GetEndpointsDocument } from '../../../graphql/generated/dist';
// import TestRenderer from 'react-test-renderer';
// import { act } from 'react-dom/test-utils';
// import { watch } from 'fs';
// import wait from 'waait';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// import i18n from '../../../translations/i18next';
// import { I18nextProvider } from 'react-i18next';
// import '@testing-library/jest-dom/extend-expect';

// Enzyme.configure({ adapter: new Adapter() });

// const mock = {
//   request: {
//     query: GetEndpointsDocument
//   },
//   result: {
//     data: {
//       getEndpoints: {
//         data: [
//           {
//             id: 1,
//             telemEnable: false,
//             moduleActive: false,
//             name: 'gcs',
//             endpointIPaddress: '10.0.0.100',
//             telemetryPort: 14550,
//             videoPort: 5600,
//             videoEnable: false
//           }
//         ]
//       }
//     }
//   }
// };

// // test('render correctly', () => {
// //   const component = TestRenderer.create(
// //     <MockedProvider mocks={[mock]} addTypename={false}>
// //       <Endpoints />
// //     </MockedProvider>
// //   );

// //   const tree = component.toJSON();
// //   expect(tree.children).toContain('hand point right large icon middle aligned');
// // });

// test('render correctly', async () => {
//   let wrapper;
//   await act(async () => {
//     wrapper = mount(
//       <I18nextProvider i18n={i18n}>
//         <MockedProvider mocks={[mock]} addTypename={false}>
//           <Endpoints />
//         </MockedProvider>
//       </I18nextProvider>
//     );
//   });

//   await act(() => wait(0));
//   wrapper.update();

//   expect(wrapper).toBeTruthy();
//   expect(wrapper.find('.endpoint-title')).text('Ground Control Stations');
// });

// afterEach(cleanup);
