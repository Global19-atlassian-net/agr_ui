import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataSourceCard from './dataSourceCard';
import {
  AttributeList,
  AttributeLabel,
  AttributeValue,
} from '../../components/attribute';
import DataSourceLink from '../../components/dataSourceLink';
import ExternalLink from '../../components/externalLink';
import CrossReferenceList from '../../components/crossReferenceList';
import SynonymList from '../../components/synonymList';

class BasicGeneInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geneData: this.props.geneData,
    };
  }

  renderDescription(data) {
    if (!data.geneSynopsis && !data.geneSynopsisUrl) {
      return '';
    }
    return (
      <div>
        {data.geneSynopsis && <p dangerouslySetInnerHTML={{__html: data.geneSynopsis}} />}
        {data.geneSynopsisUrl &&
          <ExternalLink href={data.geneSynopsisUrl}>
            {data.geneSynopsisUrl}
          </ExternalLink>
        }
      </div>
    );
  }

  render() {
    const gene = this.state.geneData;
    return (
      <div className='row'>
        <div className='col-sm-4 order-sm-last'>
          <DataSourceCard reference={gene.crossReferences.gene[0]} species={gene.species} />
        </div>
        <div className='col-sm-8 order-sm-first'>
          <AttributeList bsClassName='col-12'>
            <AttributeLabel>Symbol</AttributeLabel>
            <AttributeValue>{gene.symbol}</AttributeValue>

            <AttributeLabel>Name</AttributeLabel>
            <AttributeValue>{gene.name}</AttributeValue>

            <AttributeLabel>Synonyms</AttributeLabel>
            <AttributeValue placeholder='None'>
              {gene.synonyms && <SynonymList synonyms={gene.synonyms} />}
            </AttributeValue>

            <AttributeLabel>Biotype</AttributeLabel>
            <AttributeValue>{gene.soTermName.replace(/_/g, ' ')}</AttributeValue>

            <AttributeLabel>Description</AttributeLabel>
            <AttributeValue>{this.renderDescription(gene)}</AttributeValue>

            <AttributeLabel>Genomic Resources</AttributeLabel>
            <AttributeValue>
              {gene.crossReferences.generic_cross_reference && <CrossReferenceList crossReferences={gene.crossReferences.generic_cross_reference} />}
            </AttributeValue>

            <AttributeLabel>Additional Information</AttributeLabel>
            <AttributeValue>
              {gene.crossReferences &&
                gene.crossReferences['gene/references'] &&
                <DataSourceLink reference={gene.crossReferences['gene/references'][0]} text='Literature' />
              }
            </AttributeValue>
          </AttributeList>
        </div>
      </div>
    );
  }
}

BasicGeneInfo.propTypes = {
  geneData: PropTypes.object
};

export default BasicGeneInfo;
