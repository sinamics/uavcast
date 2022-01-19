import { useTranslation } from 'react-i18next';
import { Card, Grid, List } from 'semantic-ui-react';

const GroundcontrolHelp = () => {
  const { t } = useTranslation();
  return (
    <Card className='mb-5 theme' fluid color='green'>
      <Card.Content>
        <Card.Header>
          <div className='themeText' dangerouslySetInnerHTML={{ __html: t('modem.tips.title') }} />
        </Card.Header>
        {/* <Translate id='modem.title' /> */}
      </Card.Content>
      <Grid className='pb-3' padded columns={1}>
        <List divided relaxed style={{ wordBreak: 'break-word' }}>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>
                  <div dangerouslySetInnerHTML={{ __html: t('modem.tips.title') }} />
                </List.Header> */}
              <List.Description as='a'>
                {/* <div dangerouslySetInnerHTML={{ __html: t('modem.tips.1') }} /> */}
                <p>Make sure you have opened video and telemetry port in the desination firewall!</p>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header> */}
              <List.Description as='a'>
                {/* <div dangerouslySetInnerHTML={{ __html: t('modem.tips.2') }} /> */}
                <p>
                  Both the companion device and the receiver Ground Control Station need to be in the same local or VPN network
                </p>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header> */}
              <List.Description as='a'>
                {/* <div dangerouslySetInnerHTML={{ __html: t('modem.tips.2') }} /> */}
                <p>
                  Start with enabling one GCS at the time, adding several receivers will add more traffic and could slow down the
                  communication
                </p>
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Grid>
    </Card>
  );
};

export default GroundcontrolHelp;
