/* eslint-disable react/no-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import ControlsContainer from '../controlsContainer';
import { getOrthologId } from '../orthology';
import { STRINGENCY_HIGH } from '../orthology/constants';
import { selectOrthologs } from '../../selectors/geneSelectors';
import ExpressionAnnotationTable from './expressionAnnotationTable';
import HorizontalScroll from '../horizontalScroll';
import HelpPopup from '../helpPopup';
import ExpressionControlsHelp from './expressionControlsHelp';
import OrthologPicker from '../OrthologPicker';
import { selectExpressionRibbonSummary } from '../../selectors/expressionSelectors';
import { fetchExpressionRibbonSummary } from '../../actions/expression';

import { SELECTION, POSITION, COLOR_BY, FONT_STYLE } from '@geneontology/wc-ribbon-strips/dist/collection/globals/enums';
import LoadingSpinner from '../loadingSpinner';

class ExpressionComparisonRibbon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stringency: STRINGENCY_HIGH,
      selectedOrthologs: [],
      selectedBlock : {
        subject : null,
        group : null,
      }
    };
    this.handleOrthologChange = this.handleOrthologChange.bind(this);
    this.onExpressionGroupClicked = this.onExpressionGroupClicked.bind(this);
    this.onGroupClicked = this.onGroupClicked.bind(this);
  }

  componentDidMount() {
    this.dispatchFetchSummary();
    document.addEventListener('cellClick', this.onGroupClicked);
  }

  componentDidUpdate(prevProps, prevState) {
    const { geneId } = this.props;
    if (prevProps.geneId !== geneId || !isEqual(prevState.selectedOrthologs, this.state.selectedOrthologs)) {
      this.dispatchFetchSummary();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('cellClick', this.onGroupClicked);
  }

  dispatchFetchSummary() {
    this.props.dispatch(fetchExpressionRibbonSummary(this.getGeneIdList()));
  }

  getGeneIdList() {
    return [this.props.geneId].concat(this.state.selectedOrthologs.map(getOrthologId));
  }

  handleOrthologChange(values) {
    this.setState({selectedOrthologs: values});
  }

  onGroupClicked(e) {
    // to ensure we are only considering events coming from the disease ribbon
    if(e.target.id == 'expression-ribbon') {
      this.onExpressionGroupClicked(e.detail.subjects, e.detail.group);
    }
  }

  onExpressionGroupClicked(gene, term) {
    this.setState(state => {
      const current = state.selectedBlock;
      return {
        selectedBlock: {
          subject: gene,
          group: (current.group && current.group.id === term.id) ? null : term,
        }
      };
    });
  }

  render() {
    const { geneTaxon, orthology, summary } = this.props;
    const { selectedOrthologs, selectedBlock } = this.state;

    // const genes = [geneId].concat(selectedOrthologs.map(o => getOrthologId(o)));
    // if only looking at a single yeast gene, just show CC group
    // const groups = (geneTaxon === TAXON_IDS.YEAST && selectedOrthologs.length === 0) ? [CC] : [ANATOMY, STAGE, CC];
    if (!summary) {
      return null;
    }

    if (summary.error) {
      // eslint-disable-next-line no-console
      console.log(this.props.summary.error);
      return <span className='text-danger'>Error fetching expression annotation summary</span>;
    }

    if (!summary.data.subjects || !summary.data.categories) {
      return null;
    }

    // we should only show the GO CC category if only a yeast gene is being shown but the
    // GenericRibbon component gets messed up if you do that and then add an ortholog
    const taxonIdYeast = 'NCBITaxon:559292';
    const categories = summary.data.categories.filter(category => !(
      selectedOrthologs.length === 0 &&
      geneTaxon === taxonIdYeast &&
      category.id.startsWith('UBERON:')
    ));

    let updatedSummary = summary.data;
    updatedSummary.categories = categories;

    const genesWithData = orthology.supplementalData && Object.entries(orthology.supplementalData)
      .reduce((prev, [geneId, data]) => ({...prev, [geneId]: data.hasExpressionAnnotations}), {});

    return (
      <React.Fragment>
        <div className='pb-4'>
          <ControlsContainer>
            <span className='pull-right'>
              <HelpPopup id='expression-controls-help'>
                <ExpressionControlsHelp />
              </HelpPopup>
            </span>
            <OrthologPicker
              defaultEnabled
              defaultStringency={STRINGENCY_HIGH}
              focusTaxonId={geneTaxon}
              genesWithData={genesWithData}
              id='expression-ortho-picker'
              onChange={this.handleOrthologChange}
              orthology={orthology.data}
              value={selectedOrthologs}
            />
          </ControlsContainer>
        </div>



        <HorizontalScroll>
          <div className='text-nowrap' style={{'width' : '1100px' }} >
            {
              summary.loading ? <LoadingSpinner /> :
                <wc-ribbon-strips 
                  category-all-style={FONT_STYLE.BOLD}
                  color-by={COLOR_BY.CLASS_COUNT}
                  data={JSON.stringify(updatedSummary)}
                  group-clickable={false}
                  group-open-new-tab={false}
                  id='expression-ribbon'
                  new-tab={false}
                  selection-mode={SELECTION.COLUMN}
                  subject-base-url='/gene/'
                  subject-open-new-tab={false}
                  subject-position={POSITION.LEFT}
                />
            }
          </div>
          <div>{summary.loading && <LoadingSpinner />}</div>
          <div className='text-muted mt-2'>
            <i>Cell color indicative of annotation volume</i>
          </div>
        </HorizontalScroll>

        {selectedBlock.group &&
          <div className='pt-4'>
            <ExpressionAnnotationTable genes={this.getGeneIdList()} term={selectedBlock.group.id} />
          </div>
        }
      </React.Fragment>
    );
  }
}

ExpressionComparisonRibbon.propTypes = {
  dispatch: PropTypes.func,
  geneId: PropTypes.string.isRequired,
  geneSymbol: PropTypes.string.isRequired,
  geneTaxon: PropTypes.string.isRequired,
  orthology: PropTypes.object,
  summary: PropTypes.object,
};

const mapStateToProps = state => ({
  orthology: selectOrthologs(state),
  summary: selectExpressionRibbonSummary(state),
});

export default connect(mapStateToProps)(ExpressionComparisonRibbon);
