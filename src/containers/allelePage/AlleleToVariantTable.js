import React from 'react';
import PropTypes from 'prop-types';
import { VariantJBrowseLink } from '../../components/variant';
import Sequence from './Sequence';
import useAllAlleleVariants from '../../hooks/useAlleleVariants';
import LoadingSpinner from '../../components/loadingSpinner';
import { DataTable } from '../../components/dataTable';

const AlleleToVariantTable = ({allele = {}, alleleId}) => {
  const {
    data: dataRaw = {
      results: [],
      total: 0,
    },
    isLoading,
    isFetching,
    tableState,
    setTableState,
  } = useAllAlleleVariants(alleleId);
  const [ variant1 = {} ] = dataRaw.results;
  const { location: locationVariant1 = {} } = variant1;
  const gene = allele.gene || {};
  const { genomeLocations: geneLocations } = gene;
  const [geneLocation] = geneLocations || [];

  const data = dataRaw.results.map((variant) => ({
    ...variant,
    geneLocation,
    species: allele.species
  }));

  const columns = [
    {
      dataField: 'displayName',
      text: 'Variant name',
      formatter: (name, {location, type = {}, geneLocation = {}, species = {}}) => (
        <VariantJBrowseLink
          geneLocation={geneLocation}
          location={location}
          species={species.name}
          type={type.name}
        >
          <span className="text-break">{name}</span>
        </VariantJBrowseLink>
      ),
      headerStyle: {width: '220px'},
    },
    {
      dataField: 'type',
      text: 'Variant type',
      formatter: ({name = ''} = {}) => name.replace(/_/g, ' '),
      headerStyle: {width: '100px'},
    },
    {
      dataField: 'location',
      text: 'Location',
      headerFormatter: () => (
        <React.Fragment>
          Chromosome:position
          <br/>
          <span className="text-muted">(Assembly: {locationVariant1.assembly})</span>
        </React.Fragment>
      ),
      formatter: ({chromosome = '', start = '', end = ''} = {}) => {
        return (start !== end) ? `${chromosome}:${start}-${end}` : `${chromosome}:${start}`;
      },
      headerStyle: {width: '160px'},
    },
    {
      dataField: 'nucleotideChange',
      text: 'Nucleotide change',
      formatter: (nucleotideChange) => {
        return <Sequence sequence={nucleotideChange || ''} />;
      },
      headerStyle: {width: '160px'},
    },
    {
      dataField: 'consequence',
      text: 'Most severe consequence',
      formatter: term => term && term.replace(/_/g, ' '),
      headerStyle: {width: '150px'},
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      downloadUrl={`/api/allele/${alleleId}/variants/download`}
      key={alleleId}
      keyField='id'
      loading={isFetching}
      noDataMessage='No mapped variant information available'
      pagination={false}
      setTableState={setTableState}
      tableState={tableState}
      totalRows={dataRaw.total}
    />
  );
};
AlleleToVariantTable.propTypes = {
  allele: PropTypes.shape({
    gene: PropTypes.shape({
      genomeLocations: PropTypes.any,
    }),
    species: PropTypes.shape({
      name: PropTypes.string,
    })
  }),
  alleleId: PropTypes.any,
};


export default AlleleToVariantTable;
