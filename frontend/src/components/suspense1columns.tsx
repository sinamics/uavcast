import { Container, Grid, Placeholder, Segment } from 'semantic-ui-react';

const Suspense1column = () => {
  return (
    <Container fluid>
      <Grid padded columns={1} stackable>
        <Grid.Column>
          <Segment raised>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='full' />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
              <Placeholder.Header>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
              <Placeholder.Header>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='full' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Suspense1column;
