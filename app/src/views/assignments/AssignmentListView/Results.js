import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Bold
} from 'react-feather';
import Label from 'src/components/Label';

function applyPagination(assignments, page, limit) {
  return assignments.slice(page * limit, page * limit + limit);
}

const assignmentStatusColors = {
  canceled: 'error',
  draft: 'warning',
  published: 'success',
  rejected: 'error'
};

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  title:{
    fontWeight: '500'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  }
}));

function Results({ className, assignments, ...rest }) {
  const classes = useStyles();
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const handleSelectAllAssignments = (event) => {
    setSelectedAssignments(event.target.checked
      ? assignments.map((assignment) => assignment.id)
      : []);
  };

  const handleSelectOneAssignment = (event, assignmentId) => {
    if (!selectedAssignments.includes(assignmentId)) {
      setSelectedAssignments((prevSelected) => [...prevSelected, assignmentId]);
    } else {
      setSelectedAssignments((prevSelected) => prevSelected.filter((id) => id !== assignmentId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const paginatedAssignments = applyPagination(assignments, page, limit);
  const enableBulkOperations = selectedAssignments.length > 0;
  const selectedSomeAssignments = selectedAssignments.length > 0 && selectedAssignments.length < assignments.length;
  const selectedAllAssignments = selectedAssignments.length === assignments.length;

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllAssignments}
              indeterminate={selectedSomeAssignments}
              onChange={handleSelectAllAssignments}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Supprimer
            </Button>
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Éditer
            </Button>
          </div>
        </div>
      )}
        <PerfectScrollbar>
          <Box minWidth={1150}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllAssignments}
                      indeterminate={selectedSomeAssignments}
                      onChange={handleSelectAllAssignments}
                    />
                  </TableCell>
                  <TableCell>
                    Topique
                  </TableCell>
                  <TableCell>
                    Statut
                  </TableCell>
                  <TableCell align="right">
                    Actes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAssignments.map((assignment) => {
                  const isAssignmentSelected = selectedAssignments.includes(assignment.id);

                  return (
                    <TableRow
                      hover
                      key={assignment.id}
                      selected={selectedAssignments.indexOf(assignment.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isAssignmentSelected}
                          onChange={(event) => handleSelectOneAssignment(event, assignment.id)}
                          value={isAssignmentSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.title}
                            variant="inherit"
                            color="textPrimary"
                          >
                            {assignment.topic}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {assignment.description}
                        </Typography>
                      </TableCell>                     
                      <TableCell>
                        <Label color={assignmentStatusColors[assignment.status]}>
                          {assignment.status}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={"/app/assignments/" + assignment.id + "/edit"}
                        >
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={assignments.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </div>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  assignments: PropTypes.array
};

Results.defaultProps = {
  assignments: []
};

export default Results;
