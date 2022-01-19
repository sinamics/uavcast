/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import nav from './_nav';
import SidebarFooter from '../SidebarFooter/SidebarFooter';
import SidebarForm from '../SidebarForm/SidebarForm';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import SidebarMinimizer from '../SidebarMinimizer/SidebarMinimizer';
import { Icon, Menu } from 'semantic-ui-react';

class Sidebar extends Component {
  constructor(props: Record<string, unknown> | Readonly<Record<string, unknown>>) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
  }

  handleClick(e: { preventDefault: () => void; target: { parentElement: { classList: { toggle: (arg0: string) => void } } } }) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName: any, props: any) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown opens' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show');
    }
  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1
  //     ? 'nav nav-second-level collapse in'
  //     : 'nav nav-second-level collapse';
  // }

  render() {
    const props = this.props;
    // badge addon to NavItem
    const badge: any = (badge: { class: any; variant: any; text: any }) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (
          <span className={classes} color={badge.variant}>
            {badge.text}
          </span>
        );
      }
    };

    // simple wrapper for nav-title item
    const wrapper: any = (item: {
      wrapper: {
        element: string;
        attributes: (React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement>) | null | undefined;
      };
      name: React.ReactNode;
    }) => {
      return item.wrapper && item.wrapper.element
        ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)
        : item.name;
    };

    // nav list section title
    const title: any = (title: { class: any }, key: string | number | null | undefined) => {
      const classes = classNames('nav-title', title.class);
      return (
        <li key={key} className={classes}>
          {wrapper(title)}{' '}
        </li>
      );
    };

    // nav list divider
    const divider: any = (divider: { class: any }, key: string | number | null | undefined) => {
      const classes = classNames('divider', divider.class);
      return <li key={key} className={classes} />;
    };

    // nav label with nav link
    const navLabel: any = (item: { class: any; icon: any; label: { variant: any; class: any } }, key: any) => {
      const classes = {
        item: classNames('hidden-cn', item.class),
        link: classNames('nav-label', item.class ? item.class : ''),
        icon: classNames(
          !item.icon ? 'fa fa-circle' : item.icon,
          item.label.variant ? `text-${item.label.variant}` : '',
          item.label.class ? item.label.class : ''
        )
      };
      return navLink(item, key, classes);
    };

    // nav item with nav link
    const navItem: any = (item: { class: any; variant: any; icon: any; id: React.ReactText }, key: any) => {
      const classes = {
        item: classNames(item.class),
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      };
      return navLink(item, key, classes);
    };

    // nav link
    const navLink: any = (
      item: { url: any; name: React.ReactNode; badge: any },
      key: string | number | null | undefined,
      classes: { item: any; link: any; icon: any }
    ) => {
      const url = item.url ? item.url : '';

      return (
        <div key={key} className={classes.item}>
          {isExternal(url) ? (
            <Menu.Item href={url} className={classes.link} active>
              <Icon name={classes.icon} />
              {item.name}
              {badge(item.badge)}
            </Menu.Item>
          ) : (
            // activeClassName= should be set to active, but cant get location props for now.
            <NavLink to={url} className={classes.link} activeClassName='active' onClick={this.hideMobile}>
              <Icon name={classes.icon} />
              {item.name}
              {badge(item.badge)}
            </NavLink>
          )}
        </div>
      );
    };

    // nav dropdown
    const navDropdown: any = (
      item: { url: any; icon: string | undefined; name: React.ReactNode; children: any },
      key: string | number | null | undefined
    ) => {
      return (
        <li key={key} className={this.activeRoute(item.url, props)}>
          {/* TODO Changed from a to button, must be validate */}
          <button
            className='nav-link nav-dropdown-toggle'
            // onClick={(e)=>this.handleClick(e)}
          >
            <i className={item.icon} />
            {item.name}
          </button>
          <ul className='nav-dropdown-items pl-3'>{navList(item.children)}</ul>
        </li>
      );
    };

    // nav type
    const navType = (item: { title: any; divider: any; label: any; children: any }, idx: any) =>
      item.title
        ? title(item, idx)
        : item.divider
        ? divider(item, idx)
        : item.label
        ? navLabel(item, idx)
        : item.children
        ? navDropdown(item, idx)
        : navItem(item, idx);

    // nav list
    const navList = (items: any[]) => {
      return items.map((item: any, index: any) => navType(item, index));
    };

    const isExternal = (url: string) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    //sidebar-nav root
    return (
      <div className='sidebar'>
        <SidebarHeader />
        <SidebarForm />
        <nav className='sidebar-nav'>
          <Menu.Item>{navList(nav.items)}</Menu.Item>
        </nav>
        <SidebarFooter />
        <SidebarMinimizer />
      </div>
    );
  }
}

export default Sidebar;
