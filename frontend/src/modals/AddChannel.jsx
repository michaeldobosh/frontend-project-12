import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, FormGroup, FormControl, Button, Form, InputGroup } from 'react-bootstrap';
import cn from 'classnames';
import * as yup from 'yup';
import { selectors as storeChannels } from '../slices/channelsSlice';

// const socket = io('ws://localhost:3000');

const AddChannel = ({ handleChannel, hideModal, current }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [{ validated, error }, setValidated] = useState({ validated: false, error: '' });
  const input = useRef();

  const channelsNames = useSelector(storeChannels.selectAll).map((c) => c.name);

  const validateSchema = yup.object({
    name: yup.string().min(3).max(20).required()
      .notOneOf(channelsNames),
  });

  useEffect(() => {
    input.current.focus();
    console.log(input)
  });

  const onSubmit = (evt) => {
    evt.preventDefault();

    validateSchema.validate({ name })
      .then(() => {
        setValidated({
          validated: true,
          error: '',
        });
      })
      .then(() => {
        handleChannel(current, name);
      })
      .catch((err) => {
        setValidated({
          validated: false,
          error: err.message.replaceAll(' ', '_').toLowerCase().split(':')[0],
        });
        input.current.className = 'form-control is-invalid';
        evt.preventDefault();
        evt.stopPropagation();
      });
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('add_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={onSubmit}
        >
          <Form.Group controlId="validationCustom01">
            <InputGroup hasValidation>
              <Form.Control
                ref={input}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {t(error)}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div className="modal-footer">
            <Button type="button" className="btn btn-secondary" onClick={hideModal}>{t('cancel')}</Button>
            <Button type="submit" className="btn btn-primary">{t('submit')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
