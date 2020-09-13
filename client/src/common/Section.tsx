import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Theme } from '@material-ui/core';
import { FormField } from '../models/FormFields';

type SectionProps = {
  title?: string;
  fields: { [fieldName: string]: FormField };
  formGroup?: string;
  showBorder?: boolean;
};

const Section = ({ fields, title, formGroup, showBorder }: SectionProps) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className={clsx({ [classes.border]: showBorder }, classes.section)}>
      {title && (
        <Grid item xs={12}>
          <Typography className={classes.sectionTitle}>{title}</Typography>
        </Grid>
      )}
      {Object.entries(fields).map(([name, field]) => {
        return (
          <Grid
            key={name}
            item
            xs={field.gridWidth.xs}
            sm={field.gridWidth.sm}
            md={field.gridWidth.md}
            lg={field.gridWidth.lg}
          >
            <field.InputComponent
              {...field}
              name={formGroup ? `${formGroup}.${field.name}` : field.name}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  border: {
    borderLeft: `8px solid gray`,
    borderRadius: 10,
    marginTop: 20,
    paddingLeft: 10,
    marginBottom: 20
  },
  section: {
    marginTop: 10,
    marginBottom: 10
  },
  sectionTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 500
  }
}));

export default Section;
