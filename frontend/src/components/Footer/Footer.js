import React, { Component } from 'react';
// import { AppConfig } from '../../../config.js'

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear()
    };
  }
  render() {
    return (
      <div />
      // <footer className='app-footer'>
      //   {AppConfig.Commercial ? (
      //     <span>
      //       <a href={AppConfig.CommercialWebLink}>{AppConfig.CommercialAppName}</a> &copy; {this.state.year}
      //     </span>
      //   ) : (
      //     <span>
      //       <a href='https://uavcast.uavmatrix.com/'>UAVcast</a> &copy; {this.state.year}
      //     </span>
      //   )}
      //   <span className='ml-auto'>
      //     Powered by{' '}
      //     {AppConfig.Commercial ? (
      //       <a href={AppConfig.CommercialWebLink}>{AppConfig.CommercialAppName}</a>
      //     ) : (
      //       <a href='https://www.uavmatrix.com/'>UAVmatrix</a>
      //     )}{' '}
      //   </span>
      // </footer>
    );
  }
}

export default Footer;
