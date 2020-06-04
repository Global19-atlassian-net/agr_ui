import React from 'react';
import PropTypes from 'prop-types';
import Position from './Position';
import translationStyles from './translation.scss';

const TranslationRow = ({
  aminoAcids: aminoAcidsRaw = [],
  proteinStartPosition,
  proteinEndPosition,

  codons = [],
  cdsStartPosition,
  cdsEndPosition,

  isReference = false
}) => {
  const [lastAminoAcid] = aminoAcidsRaw.slice(-1);
  const isFrameshift = lastAminoAcid === 'X';
  const aminoAcids = isFrameshift ? aminoAcidsRaw.slice(0, -1) : aminoAcidsRaw;
  return (
    <>
      <div>
        {
          isReference && codons.length ?
            <a style={{fontFamily: 'monospace'}}>
              <Position end={cdsEndPosition} start={cdsStartPosition} />
              &nbsp;&nbsp;
            </a> :
            null
        }
        {codons.map((codon, index) => (
          <span className={translationStyles.codon} key={index}>{codon}</span>
        ))}
      </div>
      <div>
        {
          isReference && aminoAcids.length ?
            <a style={{fontFamily: 'monospace'}}>
              <Position end={proteinEndPosition} start={proteinStartPosition} />
              &nbsp;&nbsp;
            </a> :
            null
        }
        {aminoAcids.map((aa, index) => (
          <span className={translationStyles.aminoAcid} key={index}>{aa}</span>
        ))}
        {isFrameshift ? <span className="badge badge-secondary">frameshift</span> : null}
      </div>
    </>
  );
};

TranslationRow.propTypes = {
  aminoAcids: PropTypes.arrayOf(PropTypes.string),
  cdsEndPosition: PropTypes.any,
  cdsStartPosition: PropTypes.any,
  codons: PropTypes.arrayOf(PropTypes.string),
  isReference: PropTypes.bool,
  proteinEndPosition: PropTypes.any,
  proteinStartPosition: PropTypes.any,
};

const Translation = ({
  aminoAcids = [],
  proteinStartPosition,
  proteinEndPosition,

  codons = [],
  cdsStartPosition,
  cdsEndPosition,

  maxAminoAcidsPerRow = 5,

  ...translationRowProps
}) => {
  const rows = [];
  for (let aminoAcidOffset = 0; aminoAcidOffset < codons.length; aminoAcidOffset = aminoAcidOffset + maxAminoAcidsPerRow) {
    const row = (
      <TranslationRow
        {...translationRowProps}
        aminoAcids={aminoAcids.slice(aminoAcidOffset, aminoAcidOffset + maxAminoAcidsPerRow)}
        cdsEndPosition={Math.min(parseInt(cdsStartPosition) + (aminoAcidOffset + maxAminoAcidsPerRow - 1) * 3, parseInt(cdsEndPosition))}
        cdsStartPosition={parseInt(cdsStartPosition) + aminoAcidOffset * 3}
        codons={codons.slice(aminoAcidOffset * 3, (aminoAcidOffset + maxAminoAcidsPerRow) * 3)}
        proteinEndPosition={Math.min(parseInt(proteinStartPosition) + aminoAcidOffset + maxAminoAcidsPerRow - 1, parseInt(proteinEndPosition))}
        proteinStartPosition={parseInt(proteinStartPosition) + aminoAcidOffset}
      />
    );
    rows.push(row);
  }
  return (
    <>
      {rows}
    </>
  );
};

Translation.propTypes = {
  aminoAcids: PropTypes.arrayOf(PropTypes.string),
  cdsEndPosition: PropTypes.any,
  cdsStartPosition: PropTypes.any,
  codons: PropTypes.arrayOf(PropTypes.string),
  isReference: PropTypes.bool,
  maxAminoAcidsPerRow: PropTypes.number,
  proteinEndPosition: PropTypes.any,
  proteinStartPosition: PropTypes.any,
};

export default Translation;