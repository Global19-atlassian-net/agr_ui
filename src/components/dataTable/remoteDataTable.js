/* eslint-disable react/no-set-state */
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
  PaginationTotalStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import DownloadButton from './downloadButton';
import Utils from './utils';
// import * as analytics from '../../lib/analytics';
// import PaginationPanel from './paginationPanel';
import { DEFAULT_TABLE_STATE } from '../../constants';
import LoadingOverlay from './loadingOverlay';
import PerPageSizeSelector from './pagePerSizeSelector';
import NoData from '../noData';

class RemoteDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = DEFAULT_TABLE_STATE;
    this.columnRefs = new Map();

    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.props.onUpdate(this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.state, prevState)) {
      this.props.onUpdate(this.state);
    }
  }

  setColumnRef(key, ref) {
    this.columnRefs.set(key, ref);
  }

  reset() {
    this.setState(DEFAULT_TABLE_STATE);
    this.columnRefs.forEach(ref => ref && ref.cleanFiltered());
  }

  handleTableChange(type, newState) {
    // TODO: GA calls
    this.setState(newState);
  }

  render() {
    const { columns, data, downloadUrl, keyField, loading, totalRows } = this.props;
    const { page, sizePerPage } = this.state;

    if (!loading && totalRows === 0) {
      return <NoData />;
    }

    // const options = {
    //   onFilterChange: this.handleFilterChange,
    //   onPageChange: this.handlePageChange,
    //   onSizePerPageList: this.handleSizeChange,
    //   sortName: sort.name,
    //   sortOrder: sort.order,
    //   onSortChange: this.handleSortChange,
    //   paginationPanel: PaginationPanel,
    //   paginationShowsTotal: Utils.renderPaginationShowsTotal,
    //   page: page,
    //   sizePerPage: limit,
    //   sizePerPageDropDown: Utils.renderSizePerPageDropDown,
    //   sizePerPageList: [10, 25, 100],
    // };

    const pagination = paginationFactory({
      custom: true,
      page,
      paginationTotalRenderer: Utils.renderPaginationShowsTotal,
      sizePerPage,
      showTotal: true,
      totalSize: totalRows,
      sizePerPageList: [10, 25, 100],
      sizePerPageRenderer: PerPageSizeSelector,
    });

    return (
      <div style={{position: 'relative'}}>
        <LoadingOverlay loading={loading} />

        <PaginationProvider pagination={pagination}>
          {
            ({paginationProps, paginationTableProps}) => (
              <div>
                <BootstrapTable
                  bootstrap4
                  bordered={false}
                  columns={columns}
                  condensed
                  data={data}
                  filter={filterFactory()}
                  keyField={keyField}
                  onTableChange={this.handleTableChange}
                  remote={{filter: true}}
                  {...paginationTableProps}
                />
                <span className='text-muted'>
                  <PaginationTotalStandalone {...paginationProps} />
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  per page
                </span>

                <PaginationListStandalone {...paginationProps} />
              </div>
            )
          }
        </PaginationProvider>


        <DownloadButton downloadUrl={downloadUrl} />
      </div>
    );
  }
}

RemoteDataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.arrayOf(PropTypes.object),
  downloadUrl: PropTypes.string,
  keyField: PropTypes.string,
  loading: PropTypes.bool,
  onUpdate: PropTypes.func,
  totalRows: PropTypes.number,
};

export default RemoteDataTable;
