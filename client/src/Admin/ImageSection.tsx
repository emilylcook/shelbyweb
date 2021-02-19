import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { getDownloadUrl } from '../utils/useCollectionData';

export default function ImageSection() {
  const classes = useStyles();
  const { register, setValue, getValues } = useFormContext();

  const [previewUrl, setPreviewUrl] = useState<any>();

  const name = 'imageFile';
  const [imageUrl, setImageUrl] = useState<any>(getValues('imageUrl'));
  const image = getValues('image');

  const changeImage = (event: any) => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      const tempUrl = URL.createObjectURL(file);

      setValue(name, file);
      setPreviewUrl(tempUrl);
    };

    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    register({ name }); // custom register react-select
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, name]);

  React.useEffect(() => {
    const getImage = async () => {
      const url = await getDownloadUrl(image);
      setImageUrl(url);
    };

    if (!imageUrl && image) {
      getImage();
    }
  }, [image, imageUrl]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <input
          className="field"
          id="upload"
          //   ref="upload"
          type="file"
          accept="image/*"
          onChange={changeImage}
          onClick={event => {}}
        />
      </Grid>
      <Grid item xs={12}>
        {previewUrl ? (
          <img className={classes.image} alt={'Preview'} src={previewUrl} />
        ) : imageUrl ? (
          <img className={classes.image} alt={'Preview'} src={imageUrl} />
        ) : (
          'no image, or you need to reload! (if you reopened this after saving) ... for now:('
        )}
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  image: {
    marginRight: 40,
    maxWidth: '100px',
    maxHeight: '100px',
    width: 'auto',
    // margin: 'auto',
    height: 'auto'
  }
}));
