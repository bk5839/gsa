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

import {connect} from 'react-redux';

import _ from 'gmp/locale';
import {dateTimeWithTimeZone} from 'gmp/locale/date';

import {isDefined, hasValue} from 'gmp/utils/identity';

import {YES_VALUE} from 'gmp/parser';

import {duration} from 'gmp/models/date';
import {OPENVAS_SCAN_CONFIG_TYPE} from 'gmp/models/scanconfig';
import {scannerTypeName} from 'gmp/models/scanner';

import {
  loadEntity as loadSchedule,
  selector as scheduleSelector,
} from 'web/store/entities/schedules';

import {
  loadEntity as loadScanConfig,
  selector as scanConfigSelector,
} from 'web/store/entities/scanconfigs';

import PropTypes from 'web/utils/proptypes';
import compose from 'web/utils/compose';
import withGmp from 'web/utils/withGmp';
import {renderYesNo} from 'web/utils/render';

import HorizontalSep from 'web/components/layout/horizontalsep';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import DetailsTable from 'web/components/table/detailstable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import DetailsBlock from 'web/entity/block';

export const compareAlerts = (alertA, alertB) => {
  const nameA = alertA.name.toLowerCase();
  const nameB = alertB.name.toLowerCase();
  if (nameA > nameB) {
    return 1;
  }
  if (nameA < nameB) {
    return -1;
  }
  return 0;
};

class TaskDetails extends React.Component {
  componentDidMount() {
    const {entity} = this.props;

    if (isDefined(entity.config)) {
      this.props.loadScanConfig(entity.config.id);
    }
    if (isDefined(entity.schedule)) {
      this.props.loadSchedule(entity.schedule.id);
    }
  }

  render() {
    const {links = true, entity, scanConfig, schedule} = this.props;
    const {
      alerts,
      applyOverrides,
      autoDelete,
      autoDeleteData,
      averageDuration,
      config,
      hostsOrdering,
      inAssets,
      lastReport,
      minQod,
      preferences,
      scanner,
      target,
      maxChecks,
      maxHosts,
    } = entity;
    const {iface = {}} = preferences;

    let dur;
    const has_duration =
      hasValue(lastReport) && hasValue(lastReport.scan_start);
    if (has_duration) {
      if (hasValue(lastReport.scan_end)) {
        const diff = lastReport.scan_end.diff(lastReport.scan_start);
        dur = duration(diff).humanize();
      } else {
        dur = _('Not finished yet');
      }
    } else {
      dur = _('No scans yet');
    }

    const hasAvDuration = isDefined(averageDuration) && averageDuration > 0;
    const avDuration = hasAvDuration ? averageDuration.humanize() : '';

    return (
      <Layout grow="1" flex="column">
        {isDefined(target) && (
          <DetailsBlock title={_('Target')}>
            <DetailsLink textOnly={!links} type="target" id={target.id}>
              {target.name}
            </DetailsLink>
          </DetailsBlock>
        )}

        {isDefined(alerts) && (
          <DetailsBlock title={_('Alerts')}>
            <HorizontalSep>
              {alerts.sort(compareAlerts).map(alert => (
                <span key={alert.id}>
                  <DetailsLink textOnly={!links} type="alert" id={alert.id}>
                    {alert.name}
                  </DetailsLink>
                </span>
              ))}
            </HorizontalSep>
          </DetailsBlock>
        )}

        {isDefined(scanner) && (
          <DetailsBlock title={_('Scanner')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('Name')}</TableData>
                  <TableData>
                    <span>
                      <DetailsLink
                        textOnly={!links}
                        type="scanner"
                        id={scanner.id}
                      >
                        {scanner.name}
                      </DetailsLink>
                    </span>
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableData>{_('Type')}</TableData>
                  <TableData>{scannerTypeName(scanner.scannerType)}</TableData>
                </TableRow>
                {isDefined(config) && (
                  <TableRow>
                    <TableData>{_('Scan Config')}</TableData>
                    <TableData>
                      <span>
                        <DetailsLink
                          textOnly={!links}
                          type="scanconfig"
                          id={config.id}
                        >
                          {config.name}
                        </DetailsLink>
                      </span>
                    </TableData>
                  </TableRow>
                )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE &&
                  hasValue(hostsOrdering) && (
                    <TableRow>
                      <TableData>{_('Order for target hosts')}</TableData>
                      <TableData>{hostsOrdering.toLowerCase()}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE && (
                    <TableRow>
                      <TableData>{_('Network Source Interface')}</TableData>
                      <TableData>{iface.value}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE &&
                  isDefined(maxChecks) && (
                    <TableRow>
                      <TableData>
                        {_('Maximum concurrently executed NVTs per host')}
                      </TableData>
                      <TableData>{maxChecks}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE &&
                  isDefined(maxHosts) && (
                    <TableRow>
                      <TableData>
                        {_('Maximum concurrently scanned hosts')}
                      </TableData>
                      <TableData>{maxHosts}</TableData>
                    </TableRow>
                  )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('Assets')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('Add to Assets')}</TableData>
                <TableData>{renderYesNo(inAssets)}</TableData>
              </TableRow>

              {inAssets === YES_VALUE && (
                <TableRow>
                  <TableData>{_('Apply Overrides')}</TableData>
                  <TableData>{renderYesNo(applyOverrides)}</TableData>
                </TableRow>
              )}

              {inAssets === YES_VALUE && (
                <TableRow>
                  <TableData>{_('Min QoD')}</TableData>
                  <TableData>{minQod + ' %'}</TableData>
                </TableRow>
              )}
            </TableBody>
          </DetailsTable>
        </DetailsBlock>

        {isDefined(schedule) && (
          <DetailsBlock title={_('Schedule')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('Name')}</TableData>
                  <TableData>
                    <span>
                      <DetailsLink
                        textOnly={!links}
                        type="schedule"
                        id={schedule.id}
                      >
                        {schedule.name}
                      </DetailsLink>
                    </span>
                  </TableData>
                </TableRow>
                {isDefined(schedule.event) && (
                  <TableRow>
                    <TableData>{_('Next')}</TableData>
                    <TableData>
                      {dateTimeWithTimeZone(schedule.event.nextDate)}
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('Scan')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('Duration of last Scan')}</TableData>
                <TableData>{dur}</TableData>
              </TableRow>
              {hasAvDuration && (
                <TableRow>
                  <TableData>{_('Average Scan duration')}</TableData>
                  <TableData>{avDuration}</TableData>
                </TableRow>
              )}
              <TableRow>
                <TableData>{_('Auto delete Reports')}</TableData>
                <TableData>
                  {autoDelete === 'keep'
                    ? _(
                        'Automatically delete oldest reports but always keep ' +
                          'newest {{nr}} reports',
                        {nr: autoDeleteData},
                      )
                    : _('Do not automatically delete reports')}
                </TableData>
              </TableRow>
            </TableBody>
          </DetailsTable>
        </DetailsBlock>
      </Layout>
    );
  }
}

TaskDetails.propTypes = {
  entity: PropTypes.model.isRequired,
  gmp: PropTypes.gmp.isRequired,
  links: PropTypes.bool,
  loadScanConfig: PropTypes.func.isRequired,
  loadSchedule: PropTypes.func.isRequired,
  scanConfig: PropTypes.model,
  schedule: PropTypes.model,
};

const mapStateToProps = (rootState, {entity = {}}) => {
  const scheduleSel = scheduleSelector(rootState);
  const scanConfigSel = scanConfigSelector(rootState);
  return {
    scanConfig: isDefined(entity.config)
      ? scanConfigSel.getEntity(entity.config.id)
      : undefined,
    schedule: isDefined(entity.schedule)
      ? scheduleSel.getEntity(entity.schedule.id)
      : undefined,
  };
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  loadScanConfig: id => dispatch(loadScanConfig(gmp)(id)),
  loadSchedule: id => dispatch(loadSchedule(gmp)(id)),
});

export default compose(
  withGmp,
  connect(mapStateToProps, mapDispatchToProps),
)(TaskDetails);

// vim: set ts=2 sw=2 tw=80:
