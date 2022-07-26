import classnames from 'classnames';
import { Grid, Header, Label, Table } from 'semantic-ui-react';
import { useZerotierNetworksQuery, useChildProcessCmdMutation, ZerotierNetworksDocument } from '../../../graphql/generated/dist';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ZerotierTable = () => {
  const [kernelCommand] = useChildProcessCmdMutation();
  const { data: { zerotierNetworks: { networks = [] } = {} } = {} }: any = useZerotierNetworksQuery({
    fetchPolicy: 'network-only',
    pollInterval: 5000
  });
  return (
    <Grid stackable padded columns={2}>
      <Grid.Column>
        <Header
          as='h4'
          content='Networks'
          subheader='All registered networks no this device. Get your id from https://uavnet.uavmatrix.com'
        />
      </Grid.Column>
      <Grid.Column style={{ paddingTop: 30 }}>
        <Table basic selectable structured>
          <Table.Header>
            {/* <Table.Row>
              <Table.HeaderCell textAlign='center' colSpan='3'>
                Registered Networks
              </Table.HeaderCell>
            </Table.Row> */}
            <Table.Row>
              <Table.HeaderCell>Nwid</Table.HeaderCell>
              <Table.HeaderCell>IP Address</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell textAlign='right'>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {networks &&
              networks.map((prop: any, idx: any) => {
                const ZtStatusClass = classnames({
                  'text-danger': prop.status !== 'OK',
                  'text-success': prop.status === 'OK'
                });
                return (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <Header
                        as='h4'
                        // color={prop.current ? 'green' : 'black'}
                        content={prop.name}
                        subheader={prop.type}
                      />
                    </Table.Cell>
                    <Table.Cell>{prop.assignedAddresses[0]}</Table.Cell>
                    <Table.Cell className={ZtStatusClass}>{prop.status}</Table.Cell>
                    <Table.Cell>{prop.type}</Table.Cell>
                    <Table.Cell>
                      <Label
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          kernelCommand({
                            variables: { cmd: 'sudo zerotier-cli leave ' + prop.nwid, path: '/' },
                            refetchQueries: [{ query: ZerotierNetworksDocument }]
                          })
                        }
                        color='orange'
                        ribbon='right'
                      >
                        Leave
                      </Label>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </Grid.Column>
    </Grid>
  );
};

export default ZerotierTable;
