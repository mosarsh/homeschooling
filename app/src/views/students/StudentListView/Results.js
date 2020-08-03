/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
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
  Search as SearchIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';
import Label from 'src/components/Label';

function applyFilters(students, query, filters) {
  return students.filter((student) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (student[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && student[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
}

function applyPagination(students, page, limit) {
  return students.slice(page * limit, page * limit + limit);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySort(students, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = students.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line no-shadow
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  },
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
  title: {
    fontWeight: '500'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  }
}));

const studentStatusColors = {
  canceled: 'error',
  pending: 'warning',
  joined: 'success',
  rejected: 'error'
};

function Results({ className, students, ...rest }) {
  const classes = useStyles();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllStudents = (event) => {
    setSelectedStudents(event.target.checked
      ? students.map((student) => student.id)
      : []);
  };

  const handleSelectOneStudent = (event, studentId) => {
    if (!selectedStudents.includes(studentId)) {
      setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
    } else {
      setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== studentId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  // Usually query is done on backend with indexing solutions
  const paginatedStudents = applyPagination(students, page, limit);
  const enableBulkOperations = selectedStudents.length > 0;
  const selectedSomeStudents = selectedStudents.length > 0 && selectedStudents.length < students.length;
  const selectedAllStudents = selectedStudents.length === students.length;

  return (
    <Card className={clsx(classes.root, className)}
      {...rest}
    > 
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllStudents}
              indeterminate={selectedSomeStudents}
              onChange={handleSelectAllStudents}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Supprimer
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllStudents}
                    indeterminate={selectedSomeStudents}
                    onChange={handleSelectAllStudents}
                  />
                </TableCell>
                <TableCell>
                  Nome
                </TableCell>
                <TableCell align="right">
                  Statut
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student) => {
                const isStudentSelected = selectedStudents.includes(student.id);

                return (
                  <TableRow
                    hover
                    key={student.id}
                    selected={isStudentSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isStudentSelected}
                        onChange={(event) => handleSelectOneStudent(event, student.id)}
                        value={isStudentSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Avatar
                          className={classes.avatar}
                          src={student.avatar}
                        >
                          {getInitials(student.name)}
                        </Avatar>
                        <div>
                          <Typography className={classes.title}
                            color="inherit"
                            variant="h6"
                          >
                            {student.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {student.email}
                          </Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                        <Label color={studentStatusColors[student.status]}>
                          {student.status}
                        </Label>
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
        count={students.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  students: PropTypes.array
};

Results.defaultProps = {
  students: []
};

export default Results;
