/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2017 Greenbone Networks GmbH
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

import glamorous from 'glamorous';

import PropTypes from '../../utils/proptypes.js';

import {get_img_url} from '../../utils/urls.js';

import withIconCss from './withIconCss.js';
import withIconSize from './withIconSize.js';

const Anchor = glamorous.a({
  display: 'flex',
});

class IconComponent extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let {value, onClick} = this.props;

    if (onClick) {
      onClick(value);
    }
  }

  render() {
    const {img, href, alt = '', value, onClick, ...other} = this.props; // eslint-disable-line no-unused-vars
    let img_path = get_img_url(img);

    if (href) {
      return (
        <Anchor
          {...other}
          href={href}
          onClick={this.handleClick}
        >
          <img src={img_path} alt={alt}/>
        </Anchor>
      );
    }
    return (
      <img
        {...other}
        alt={alt}
        src={img_path}
        onClick={this.handleClick}
      />
    );
  }
}

IconComponent.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  img: PropTypes.string.isRequired,
  value: PropTypes.any,
  onClick: PropTypes.func,
};

export default withIconSize(withIconCss(IconComponent));

// vim: set ts=2 sw=2 tw=80:
