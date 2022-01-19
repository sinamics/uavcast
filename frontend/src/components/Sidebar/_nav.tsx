// import { AppConfig } from '../../../config';
// import { Translate } from 'react-localize-redux';

const nav = {
  items: [
    {
      title: true,
      name: 'Application',
      wrapper: {
        element: '',
        attributes: {}
      },
      class: ''
    },
    {
      name: 'Map',
      url: '/map',
      icon: 'plane'
    },
    {
      // name: <Translate id="sidebarLinks.categories.header" />,
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'dashboard',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      name: 'Flight Controller',
      url: '/flightcontroller',
      icon: 'braille',
      id: 'connection_type'
    },
    {
      name: 'Endpoints',
      url: '/groundcontroller',
      icon: 'target',
      id: 'connection_type'
    },
    {
      // name: <Translate id="sidebarLinks.categories.header" />,
      name: 'Modem',
      url: '/modem',
      icon: 'usb',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      // name: <Translate id="sidebarLinks.categories.header" />,
      name: 'Camera',
      url: '/camera',
      icon: 'video camera',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      // name: <Translate id="sidebarLinks.categories.header" />,
      name: 'Vpn',
      url: '/vpn',
      icon: 'lock',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      name: 'Logviewer',
      url: '/logviewer',
      icon: 'chart line',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Configuration',
      wrapper: {
        element: '',
        attributes: {}
      },
      class: ''
    },
    {
      name: 'Settings',
      url: '/settings',
      icon: 'cogs',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      name: 'Backup & Restore',
      url: '/backup',
      icon: 'download',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    {
      name: 'Logs',
      url: '/logs',
      icon: 'newspaper',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    }
  ]
};
export default nav;
