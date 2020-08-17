import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Grid,
  Hidden,
  Typography,
  makeStyles
} from '@material-ui/core';
import ViewConfigIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewWeekIcon from '@material-ui/icons/ViewWeekOutlined';
import ViewDayIcon from '@material-ui/icons/ViewDayOutlined';
import ViewAgendaIcon from '@material-ui/icons/ViewAgendaOutlined';

const viewOptions = [
  {
    label: 'Month',
    value: 'dayGridMonth',
    icon: ViewConfigIcon
  },
  {
    label: 'Week',
    value: 'timeGridWeek',
    icon: ViewWeekIcon
  },
  {
    label: 'Day',
    value: 'timeGridDay',
    icon: ViewDayIcon
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: ViewAgendaIcon
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

function Toolbar({
  date,
  view,
  onDatePrev,
  onDateNext,
  onEventAdd,
  onViewChange,
  onDateToday,
  className,
  ...rest
}) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      {...rest}
      alignItems="center"
      container
      justify="space-between"
      spacing={3}
    >
      <Grid item>
        <ButtonGroup size="small">
          <Button onClick={onDatePrev}>Précédent</Button>
          <Button onClick={onDateToday}>Aujourd'hui</Button>
          <Button onClick={onDateNext}>Prochain</Button>
        </ButtonGroup>
      </Grid>
      <Hidden smDown>
        <Grid item>
          <Typography
            variant="h4"
            color="textPrimary"
          >
            {moment(date).format('dddd, MMMM Do YYYY')}
          </Typography>
        </Grid>
      </Hidden>
    </Grid>
  );
}

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  date: PropTypes.any.isRequired,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onEventAdd: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.string
};

export default Toolbar;