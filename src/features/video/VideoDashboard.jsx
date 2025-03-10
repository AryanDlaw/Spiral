import React from 'react'
import AdditionalBar from './AdditionalBar'
import Notification from './Notification'
import VideoContainer from './VideoContainer'
import {ContextProvider} from '../../app/api/Context'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../app/firestore/firestoreService'
import { listenToSelectedUserProfile, listenToCurrentUserProfile } from '../profiles/profileActions'
import useFirestoreDoc from '../../app/hooks/useFirestoreDoc'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { Segment } from 'semantic-ui-react'

export default function VideoDashboard({match}) {
    const dispatch = useDispatch();
    const { selectedUserProfile , currentUserProfile } = useSelector((state) => state.profile);
    const { currentUser } = useSelector((state) => state.auth);
    const { loading, error } = useSelector((state) => state.async);

    useFirestoreDoc({
        query: () => getUserProfile(match.params.id),
        data: (profile) => dispatch(listenToSelectedUserProfile(profile)),
        deps: [dispatch, match.params.id],
      });

    useFirestoreDoc({
        query: () => getUserProfile(currentUser.uid),
        data: (profile) => dispatch(listenToCurrentUserProfile(profile)),
        deps: [dispatch, currentUser],
      });

      if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
      return <LoadingComponent content='Loading ...' />;

    return (
        <Segment style={{height:'100vh' , marginTop:'-40px'}}>
        <ContextProvider>
            <Notification />
            <VideoContainer />
            <AdditionalBar profile={selectedUserProfile} user={currentUserProfile} />
        </ContextProvider>
        </Segment>
    )
}
