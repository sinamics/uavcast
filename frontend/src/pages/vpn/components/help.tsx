import { useTranslation } from 'react-i18next';
import { Card, Grid, List } from 'semantic-ui-react';

const VpnHelp = () => {
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
        <List divided relaxed style={{ wordBreak: 'break-all' }}>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>
                  <div dangerouslySetInnerHTML={{ __html: t('modem.tips.title') }} />
                </List.Header> */}
              <List.Description as='a'>
                <div dangerouslySetInnerHTML={{ __html: t('modem.tips.1') }} />
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header> */}
              <List.Description as='a'>
                <div dangerouslySetInnerHTML={{ __html: t('modem.tips.2') }} />
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Grid>
    </Card>
  );
};

export default VpnHelp;
