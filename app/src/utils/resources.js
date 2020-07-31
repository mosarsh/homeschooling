import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  makeStyles,
  Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

function Resources({className, resources, ...rest }) {
  const classes = useStyles();

  const distinctResources = [...new Map(resources.map(item => [item['id'], item])).values()]

  return (
    distinctResources.length > 0 && (
    <Grid 
        item 
        xs={12}
        lg={8}
    >
        <Card className={clsx(classes.root, className)}
        {...rest}
        >
        <List>
            {distinctResources.map((resource, i) => (
            <ListItem
                divider={i < resource.length - 1}
                key={resource.id}
            >
                <ListItemIcon>
                    <img src={resource.icon} />
                </ListItemIcon>
                <ListItemText>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >
                    {resource.name}
                </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                <Tooltip title="View">
                    <IconButton
                    edge="end"
                    size="small"
                    >
                    <DeleteIcon />
                    </IconButton>
                </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>
            ))}
        </List>
        </Card>
    </Grid>
    )
  );
}

Resources.propTypes = {
    className: PropTypes.string,
    resources: PropTypes.array
};

export default Resources;
