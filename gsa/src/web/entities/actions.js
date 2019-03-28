/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import {isDefined} from 'gmp/utils/identity';

import TableData from 'web/components/table/data';

import PropTypes from 'web/utils/proptypes';
import SelectionType from 'web/utils/selectiontype';

import EntitySelection from './selection';

const EntitiesActions = ({
  children,
  entity,
  selectionType,
  onEntityDeselected,
  onEntitySelected,
  ...props
}) => {
  if (!isDefined(children) && selectionType !== SelectionType.SELECTION_USER) {
    return null;
  }
  return selectionType === SelectionType.SELECTION_USER ? (
    <TableData align={['center', 'center']}>
      <EntitySelection
        entity={entity}
        onSelected={onEntitySelected}
        onDeselected={onEntityDeselected}
      />
    </TableData>
  ) : (
    <TableData grow>{children({entity, ...props})}</TableData>
  );
};

EntitiesActions.propTypes = {
  children: PropTypes.func,
  entity: PropTypes.model,
  selectionType: PropTypes.string,
  onEntityDeselected: PropTypes.func,
  onEntitySelected: PropTypes.func,
};

export default EntitiesActions;

// vim: set ts=2 sw=2 tw=80: