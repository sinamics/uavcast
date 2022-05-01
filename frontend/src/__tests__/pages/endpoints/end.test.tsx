/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable space-before-function-paren */
// import * as React from 'react';
// import { customRender } from '../../../utils/customRender';
// import { GetEndpointsDocument } from '../../../graphql/generated/dist';
// import { Route } from 'react-router';
// import Endpoints from '../../../pages/endpoints';
// import ModuleActive from '../../../pages/endpoints/components/apModuleActive';
import '@testing-library/jest-dom/extend-expect';
import '@apollo/client';

// const endpoints = {
//   // route: '/endpoint',
//   request: {
//     query: GetEndpointsDocument,
//     variables: {}
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

// const waitForData = () => new Promise((res) => setTimeout(res, 0));

// describe('endpoints', () => {
//   test('paid user', async () => {
//     const { getByTestId } = customRender(<ModuleActive  />, [endpoints]);
//     await waitForData();
//     const el = getByTestId('endpoint-title');
//     expect(el.textContent).toContain('Ground Control Stations');
//   });
// });
