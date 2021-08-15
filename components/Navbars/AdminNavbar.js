import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useSnackbar } from 'notistack';
import useUser from '../../lib/useUser';
import fetchJson from '../../lib/fetchJson';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from 'reactstrap';

function AdminNavbar({ brandText }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, mutateUser } = useUser();

  const logout = async (event) => {
    event.preventDefault();
    mutateUser(await fetchJson('/api/users/logout', { method: 'POST' }), false);
    enqueueSnackbar('Logout success', {
      variant: 'success',
    });
    Router.push('/auth/login');
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link href="/admin/dashboard">
            <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
              {brandText}
            </a>
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={user?.photo} />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user?.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem href="/api/users/logout" onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Keluar</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
