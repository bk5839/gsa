/* Copyright (C) 2019-2020 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';

import _ from 'gmp/locale';

import {TICKET_STATUS, TICKET_STATUS_TRANSLATIONS} from 'gmp/models/ticket';

import SaveDialog from 'web/components/dialog/savedialog';

import ErrorBubble from 'web/components/form/errorbubble';
import FormGroup from 'web/components/form/formgroup';
import Layout from 'web/components/layout/layout';
import Select from 'web/components/form/select';
import TextArea from 'web/components/form/textarea';
import useFormValidation, {
  syncVariables,
} from 'web/components/form/useFormValidation';

import PropTypes from 'web/utils/proptypes';
import {renderSelectItems} from 'web/utils/render';

import {editTicketRules as validationRules} from './validationrules';

const STATUS = [TICKET_STATUS.open, TICKET_STATUS.fixed, TICKET_STATUS.closed];

const STATUS_ITEMS = STATUS.map(status => ({
  value: status,
  label: TICKET_STATUS_TRANSLATIONS[status],
}));

const EditTicketDialog = ({
  closedNote = '',
  fixedNote = '',
  openNote = '',
  ticketId,
  title = _('Edit Ticket'),
  status,
  userId,
  users,
  onClose,
  onSave,
}) => {
  const stateSchema = {
    // variables needing validation
    openNote,
    closedNote,
    fixedNote,
  };

  const deps = {
    // variables not needing validation but needed as dependencies
    status,
  };

  const {
    formValues,
    dependencies,
    shouldWarn,
    handleValueChange,
    handleDependencyChange,
    validityStatus,
    handleSubmit,
  } = useFormValidation(stateSchema, validationRules, onSave, deps);

  return (
    <SaveDialog
      title={title}
      onClose={onClose}
      onSave={vals => handleSubmit(vals)}
      values={{
        ticketId,
      }}
      defaultValues={{
        closedNote,
        fixedNote,
        openNote,
        status,
        userId,
      }}
    >
      {({values, onValueChange}) => {
        syncVariables(values, formValues, dependencies);

        return (
          <Layout flex="column">
            <FormGroup title={_('Status')}>
              <Select
                name="status"
                items={STATUS_ITEMS}
                value={dependencies.status}
                onChange={handleDependencyChange}
              />
            </FormGroup>
            <FormGroup title={_('Assigned User')}>
              <Select
                name="userId"
                items={renderSelectItems(users)}
                value={values.userId}
                onChange={onValueChange}
              />
            </FormGroup>
            <ErrorBubble
              visible={shouldWarn && !validityStatus.openNote.validity}
              content={validityStatus.openNote.error}
            >
              {({targetRef}) => (
                <div ref={targetRef}>
                  <FormGroup title={_('Note for Open')}>
                    <TextArea
                      name="openNote"
                      grow="1"
                      rows="5"
                      value={values.openNote}
                      onChange={handleValueChange}
                    />
                  </FormGroup>
                </div>
              )}
            </ErrorBubble>
            <ErrorBubble
              visible={shouldWarn && !validityStatus.fixedNote.validity}
              content={validityStatus.fixedNote.error}
            >
              {({targetRef}) => (
                <div ref={targetRef}>
                  <FormGroup title={_('Note for Fixed')}>
                    <TextArea
                      name="fixedNote"
                      grow="1"
                      rows="5"
                      value={values.fixedNote}
                      onChange={handleValueChange}
                    />
                  </FormGroup>
                </div>
              )}
            </ErrorBubble>
            <ErrorBubble
              visible={shouldWarn && !validityStatus.closedNote.validity}
              content={validityStatus.closedNote.error}
            >
              {({targetRef}) => (
                <div ref={targetRef}>
                  <FormGroup title={_('Note for Closed')}>
                    <TextArea
                      name="closedNote"
                      grow="1"
                      rows="5"
                      value={values.closedNote}
                      onChange={handleValueChange}
                    />
                  </FormGroup>
                </div>
              )}
            </ErrorBubble>
          </Layout>
        );
      }}
    </SaveDialog>
  );
};

EditTicketDialog.propTypes = {
  closedNote: PropTypes.string,
  fixedNote: PropTypes.string,
  openNote: PropTypes.string,
  status: PropTypes.oneOf(STATUS),
  ticketId: PropTypes.id.isRequired,
  title: PropTypes.toString,
  userId: PropTypes.id.isRequired,
  users: PropTypes.arrayOf(PropTypes.model),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditTicketDialog;

// vim: set ts=2 sw=2 tw=80:
