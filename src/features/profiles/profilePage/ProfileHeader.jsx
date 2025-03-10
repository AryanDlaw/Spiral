import React from 'react';
import { NavLink } from 'react-router-dom';
import { Segment, Grid, Item, Header, Statistic, Divider, Reveal, Button } from 'semantic-ui-react';

export default function ProfileHeader({profile, isCurrentUser, url}) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' style={{display: 'block', marginBottom: 10}} content={profile.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group>
                        <Statistic label='Followers' value={10} />
                        <Statistic label='Following' value={5} />
                    </Statistic.Group>
                    {!isCurrentUser &&
                    <>
                    <Divider />
                    <div style={{display:'flex'}}>
                    <Button positive as={NavLink} to={`/video/${url.params?.id}`} icon="video" content="Video Call"/>
                    <Reveal animated='move'>
                        <Reveal.Content visible style={{width: '100%'}}>
                            <Button fluid color='teal' content='Following' />
                        </Reveal.Content>
                        <Reveal.Content hidden style={{width: '100%'}}>
                            <Button basic fluid color='red' content='Unfollow' />
                        </Reveal.Content>
                    </Reveal>
                    </div>
                    </>}

                </Grid.Column>
            </Grid>
        </Segment>
    )

}