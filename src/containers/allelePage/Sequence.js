import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import style from './sequence.scss';


const Sequence = ({
  sequence = '',
  maxCharacterLengthInline = 20,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <>
      <button className="btn btn-link p-0" onClick={toggle} type="button">
        <span
          className={`${style.sequence} ${style.sequenceInline}`}
          style={{
            width: `${maxCharacterLengthInline}ch`,
          }}
        >
          {sequence}
        </span>
        <span
          className={`${style.sequence} ${style.sequenceInline}`}
          style={{
            width: '1ch',
          }}
        >
          &hellip;
        </span>
      </button>
      <Modal fade={false} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Full sequence</ModalHeader>
        <ModalBody className={`mh-50 text-break px-5 ${style.modalBody}`}>
          <div className={style.sequence}>{sequence}</div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-secondary" onClick={toggle} type="button">Cancel</button>
        </ModalFooter>
      </Modal>
    </>
  );
};

Sequence.propTypes = {
  maxCharacterLengthInline: PropTypes.number,
  sequence: PropTypes.string,
};

export default Sequence;
