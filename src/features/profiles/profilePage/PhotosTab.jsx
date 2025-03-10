import React, { useState } from 'react';
import { Grid, Header, Button, Tab, Card, Image , Confirm} from 'semantic-ui-react';
import PhotoUploadWidget from '../../../app/common/photos/PhotoUploadWidget';
import useFirestoreColection from '../../../app/hooks/useFirestoreCollection';
import {
  getUserPhotos,
  setMainPhoto,
  deletePhotoFromCollection,
} from '../../../app/firestore/firestoreService';
import { useDispatch, useSelector } from 'react-redux';
import { listenToUserPhotos } from '../profileActions';
import toast from 'react-hot-toast';
import { deleteFromFirebaseStorage } from '../../../app/firestore/firebaseService';

export default function PhotosTab({ profile, isCurrentUser }) {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const { loading } = useSelector((state) => state.async);
  const {authenticated} = useSelector(state => state.auth);
  const { photos } = useSelector((state) => state.profile);
  const [updating, setUpdating] = useState({ isUpdating: false, target: null });
  const [deleting, setDeleting] = useState({ isDeleting: false, target: null });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updateImage , setUpdateImage] = useState({photo:null , target:null , value:false});

  // setUpdateImage(prevState=>({
  //   ...prevState,
  //   [name]:value
  // }));

  useFirestoreColection({
    query: () => getUserPhotos(profile.id),
    data: (photos) => dispatch(listenToUserPhotos(photos)),
    deps: [profile.id, dispatch],
  });

  async function handleSetMainPhoto(photo, target) {
    setUpdating({ isUpdating: true, target });
    setConfirmOpen(true);
    setUpdateImage({photo:photo,target:target,value:true});
  }

async function updateImg(){
    try {
      setConfirmOpen(false);
      await setMainPhoto(updateImage.photo);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating({ isUpdating: false, target: null });  
    }
}

  async function handleDeletePhoto(photo, target) {
    setDeleting({ isDeleting: true, target });
    try {
      await deleteFromFirebaseStorage(photo.name);
      await deletePhotoFromCollection(photo.id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting({ isDeleting: false, target: null });
    }
  }

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='user' content={`Photos`} />
          {isCurrentUser && (
            <Button
              onClick={() => setEditMode(!editMode)}
              floated='right'
              basic
              content={editMode ? 'Cancel' : 'Add Photo'}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <PhotoUploadWidget setEditMode={setEditMode} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {authenticated && (
                  <Button.Group fluid widths={2}>
                    <Button
                      name={photo.id}
                      loading={
                        updating.isUpdating && updating.target === photo.id
                      }
                      onClick={(e) => handleSetMainPhoto(photo, e.target.name)}
                      disabled={photo.url === profile.photoURL}
                      basic
                      color='green'
                      icon="picture"
                      
                    />
                    <Button
                      name={photo.id}
                      onClick={(e) => handleDeletePhoto(photo, e.target.name)}
                      loading={deleting.isDeleting && deleting.target === photo.id}
                      disabled={photo.url === profile.photoURL}
                      basic
                      color='red'
                      icon='trash'
                    />
                  </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
        <Confirm 
        content={'are you sure?'}
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setUpdateImage({value:true});
          updateImg()
      }}
      />
      </Grid>
    </Tab.Pane>
  );
}