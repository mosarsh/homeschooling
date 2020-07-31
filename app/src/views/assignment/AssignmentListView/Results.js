import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
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
  ArrowRight as ArrowRightIcon
} from 'react-feather';
import Label from 'src/components/Label';
//import GenericMoreButton from 'src/components/GenericMoreButton';
import BulkOperations from './BulkOperations';

function applyPagination(assignments, page, limit) {
  return assignments.slice(page * limit, page * limit + limit);
}

const paymentStatusColors = {
  canceled: 'error',
  draft: 'warning',
  published: 'success',
  rejected: 'error'
};

const useStyles = makeStyles(() => ({
  root: {}
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
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {assignments.length}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(assignments.length / limit)}
      </Typography>
      <Card>
        <CardHeader
          // action={<GenericMoreButton />}
          title="Les travaux"
        />
        <Divider />
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAssignments.map((assignment) => {
                  const isAssignmentSelected = selectedAssignments.includes(assignment.id);

                  return (
                    <TableRow
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
                        {assignment.topic}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {assignment.description}
                        </Typography>
                      </TableCell>                     
                      <TableCell>
                        <Label color={paymentStatusColors[assignment.status]}>
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
                        <IconButton
                          component={RouterLink}
                          to={"/app/assignments/" + assignment.id}
                        >
                          <SvgIcon fontSize="small">
                            <ArrowRightIcon />
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
      <BulkOperations
        open={enableBulkOperations}
        selected={selectedAssignments}
      />
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
