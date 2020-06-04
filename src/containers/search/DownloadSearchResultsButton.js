import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './style.scss';
import {selectPageLoading} from '../../selectors/loadingSelector';
import {Link} from 'react-router-dom';

const DownloadSearchResultsButton = () => {
  let path = window.location.href.split('?')[1];
  return (
    <div>
      Download results&nbsp;<Link target='_blank' to={`search/download?${path}`} ><i className={`${style.downloadSearchIcon} fa fa-cloud-download fa-2x`}/></Link>
    </div>
  );
};

DownloadSearchResultsButton.propTypes = {
  isPending: PropTypes.bool,
  queryParams: PropTypes.object
};

const mapStateToProps = state => ({
  isPending: selectPageLoading(state),
});

export default connect(mapStateToProps)(DownloadSearchResultsButton);