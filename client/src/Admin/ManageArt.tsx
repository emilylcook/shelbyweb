import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { useHistory } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import useAuth from '../utils/useAuth';
import useArtData from '../utils/useCollectionData';
import { Art, columns, orderData, OrderType } from './tablehelpers';
import { Grid, IconButton, TableSortLabel, Typography } from '@material-ui/core';
import { HorizontalTitle } from '../common';
import SearchField from './SearchField';
import EditArtModal from './EditArtModal';

// TODO
// filters on columns and such

export default function ManageArt() {
  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const { art, loading } = useArtData();

  const [tableData, setTableData] = useState<Art[]>([]);
  const [visibleRows, setVisibleRows] = useState<Art[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [searchText, setSearchText] = useState<string>('');

  const [modalData, setModalData] = useState<Art | any | null>(null);

  const [order, setOrder] = React.useState<OrderType>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('name');

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    let sortedList = visibleRows;
    sortedList = orderData(tableData, property, isAsc ? 'asc' : 'desc');

    setVisibleRows(sortedList);
  };

  useEffect(() => {
    if (art && !loading) {
      setTableData(art);
      const sorted = orderData(art, 'name', 'asc');
      setVisibleRows(sorted);
    }
  }, [art, loading]);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!isAuthenticated) {
    history.push('/');
    return null;
  }

  // Handle do search
  const handleDoSearch = (value: string) => {
    const toLowerCase = value.toLowerCase();
    if (toLowerCase !== searchText) {
      setSearchText(toLowerCase);
      setPage(0); // on filter change we will go back to page 0
    }
  };

  //   search on name
  const matchedVisibleList = visibleRows.filter(x => x.name.toLowerCase().includes(searchText));

  return (
    <Grid container>
      <EditArtModal
        handleClose={(arts?: Art[]) => {
          if (arts) {
            setTableData(arts);
            const sorted = orderData(arts, orderBy, order);
            setVisibleRows(sorted);
          }
          setModalData(null);
        }}
        art={modalData}
        open={!!modalData}
      />

      <Grid item xs={12} className={classes.header}>
        <HorizontalTitle title="Manage Art" includeSpacer />

        <Grid item xs={12} sm={6} className={classes.search}>
          <SearchField onChange={(e: string) => handleDoSearch(e)} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div
            onClick={() => {
              setModalData({ id: -1 });
            }}
          >
            Add Art
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.tableContainer}>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label=" table">
              <TableHead className={classes.tableHeader}>
                <TableRow className={classes.tableHeader}>
                  <TableCell className={classes.headerCell}>
                    {columns.map(column => (
                      <TableSortLabel
                        key={column.id}
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={createSortHandler(column.id)}
                        style={{ minWidth: column.minWidth }}
                      >
                        <Typography className={classes.headerItem}>{column.label}</Typography>
                      </TableSortLabel>
                    ))}

                    <Typography
                      className={classes.headerItem}
                      style={{ minWidth: 20 }}
                    ></Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matchedVisibleList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    const VALID_SHIPPING_DETAILS =
                      row.shippingDetails &&
                      typeof row.shippingDetails.length === 'number' &&
                      typeof row.shippingDetails.height === 'number' &&
                      typeof row.shippingDetails.width === 'number' &&
                      typeof row.shippingDetails.pounds === 'number' &&
                      typeof row.shippingDetails.ounces === 'number';

                    return (
                      <TableRow
                        className={classes.row}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell className={classes.mediumCell}>{row.name}</TableCell>
                        <TableCell className={classes.cell}>{row.collections.join(', ')}</TableCell>
                        <TableCell className={classes.cell}>{row.tags.join(', ')}</TableCell>
                        <TableCell className={classes.priceCell}>
                          {row.price ? `$${row.price}` : ''}
                        </TableCell>
                        <TableCell className={classes.quantityCell}>{row.quantity}</TableCell>
                        <TableCell className={classes.cell}>
                          {VALID_SHIPPING_DETAILS ? 'Valid' : 'Missing/Incomplete'}
                        </TableCell>
                        <TableCell className={classes.cell}>{row.hidden ? 'hidden' : ''}</TableCell>

                        <TableCell className={classes.lastCell}>
                          {/* TODO pencil icon */}
                          <div
                            onClick={() => {
                              setModalData(row);
                            }}
                          >
                            <IconButton aria-label="edit" color="primary">
                              <EditIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={visibleRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  search: { marginLeft: 50 },
  header: {
    marginTop: 20,
    marginBottom: 20
  },
  tableContainer: {
    marginLeft: 50,
    marginRight: 50,
    width: '-webkit-fill-available',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0
    }
  },
  quantityCell: {
    width: 120
  },
  priceCell: {
    width: 100
  },
  cell: {
    width: 170
  },
  longCell: {
    width: 300
  },
  mediumCell: {
    width: 240
  },
  lastCell: {
    width: 20,
    flex: 1
  },
  row: {
    display: 'flex'
  },
  root: {
    width: '100%'
  },
  headerItem: {},
  container: {
    maxHeight: 440
  },
  headerCell: {
    display: 'flex',
    backgroundColor: '#acc1b1'
  },
  tableHeader: {
    backgroundColor: '#acc1b1'
  }
}));
