import { Card, Spacer, Page, Divider, Grid, useMediaQuery, Collapse, Text } from "@geist-ui/react";

const Footer = (): JSX.Element => {

  const isMobile = useMediaQuery('mobile');

  return (
    <Page.Footer >
      <div className=" mt-4" >
        <Divider />
        <Spacer h={1} />

        {isMobile ?
          <Collapse.Group style={{ border: '1px solid white', }}>
            <Collapse title="Question A" scale={0.6} >
              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            </Collapse>
            <Collapse title="Question B" scale={0.6}>
              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            </Collapse>
          </Collapse.Group>
          :
          <Grid.Container gap={3} justify="center">
            <Grid xs={22} md={7}>
              <Card width="100%">
                <Text p b>Platform</Text>
              </Card>
            </Grid>
            <Grid xs={22} md={7}>
              <Card width="100%">
                <Text p b>Hello</Text>
              </Card>
            </Grid>
            <Grid xs={22} md={7}>
              <Card width="100%">
                <Text p b>Company</Text>
              </Card>
            </Grid>
          </Grid.Container>
        }
      </div>
    </Page.Footer>
  )
}

export default Footer;