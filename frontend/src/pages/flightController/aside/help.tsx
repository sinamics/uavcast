import { useTranslation } from 'react-i18next';
import { Card, Grid, Label, List } from 'semantic-ui-react';

const ModemHelp = () => {
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
              <List.Description>
                {/* <p> */}
                <Label size='mini' pointing='right'>
                  GPIO
                </Label>
                Its very important that this device and your Flight Controller shares the same electrical ground if you have
                connected your FC to GPIO, serial communication depends on that.
                {/* </p> */}
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='hand point right' size='large' verticalAlign='middle' />
            <List.Content>
              {/* <List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header> */}
              <List.Description>
                {/* <p> */}
                <Label size='mini' pointing='right'>
                  USB
                </Label>
                If you experience issues using USB cable, make sure you have removed all other USB devices. Some USB`s could cause
                conflicts.
                {/* </p> */}
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Grid>
    </Card>
  );
};

export default ModemHelp;
