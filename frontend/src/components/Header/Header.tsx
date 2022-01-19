/* eslint-disable jsx-a11y/anchor-has-content */
const Header = (props: any): JSX.Element => {
  const sidebarToggle = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  };

  const mobileSidebarToggle = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  };

  return (
    <nav className='app-header navbar navbar-light' style={{ backgroundColor: '#ffffff' }}>
      <a href='/#' className='navbar-brand' />
      <button
        className='navbar-toggler d-xl-none mr-auto ml-4'
        type='button'
        data-toggle='collapse'
        data-target='#navbarTogglerDemo03'
        aria-controls='navbarTogglerDemo03'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={mobileSidebarToggle}
      >
        <span className='navbar-toggler-icon' />
      </button>
      <button
        className='navbar-toggler d-none d-xl-block mr-auto ml-3'
        id='NavbarToggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={sidebarToggle}
      >
        <span className='navbar-toggler-icon' />
      </button>
    </nav>
  );
};

export default Header;
