import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <Navbar className="justify-content-between">
      <ConnectButton />
    </Navbar>
  );
};

export default Header;