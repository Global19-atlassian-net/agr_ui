import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchDisease,
/*  fetchAssociations,
  setPerPageSize,
  setCurrentPage,*/
} from '../../actions/disease';

import {
  selectData,
  selectAssociations,
  selectTotalAssociations,
  selectPerPageSize,
  selectCurrentPage,
  selectAssocationsError,
  selectLoadingAssociation,
} from '../../selectors/diseaseSelectors';

import HeadMetaTags from '../../components/headMetaTags';
import Subsection from '../../components/subsection';
import BasicDiseaseInfo from './basicDiseaseInfo';
import { DiseasePageAssociationsTable } from '../../components/disease';

class DiseasePage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchDisease(this.props.params.diseaseId));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.diseaseId !== prevProps.params.diseaseId) {
      this.props.dispatch(fetchDisease(this.props.params.diseaseId));
    }
  }

  render() {
    const disease = this.props.data;
    const title = this.props.params.diseaseId;
    if (!disease) {
      return null;
    }
    return (
      <div className='container'>
        <HeadMetaTags title={title} />

        <div className='alert alert-warning'>
          <i className='fa fa-warning' /> Page under active development
        </div>

        <h1>
          {disease.name} (<a href={'http://www.disease-ontology.org/?id=' + disease.doId}>{disease.doId}</a>)
          <hr />
        </h1>

        <Subsection>
          <BasicDiseaseInfo disease={disease} />
        </Subsection>

        <Subsection hardcoded title='Associations'>
          <DiseasePageAssociationsTable />
        </Subsection>
      </div>
    );
  }
}

DiseasePage.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.object), // An array containing the disease associations.
  associationsError: PropTypes.string,               // Association loading error messages.
  currentPage: PropTypes.number,                     // The current page of the associations table.
  data: PropTypes.object,
  dispatch: PropTypes.func,
  loadingAssociations: PropTypes.bool,               // Whether or not we are loading associations.
  params: PropTypes.object,
  perPageSize: PropTypes.number,                     // Number of associations to display per page.
  totalAssociations: PropTypes.number,               // Total number of associations.
};

function mapStateToProps(state) {
  return {
    data: selectData(state),
    associations: selectAssociations(state),
    loadingAssociations: selectLoadingAssociation(state),
    associationsError: selectAssocationsError(state),
    currentPage: selectCurrentPage(state),
    perPageSize: selectPerPageSize(state),
    totalAssociations: selectTotalAssociations(state)
  };
}

export { DiseasePage as DiseasePage };
export default connect(mapStateToProps)(DiseasePage);
