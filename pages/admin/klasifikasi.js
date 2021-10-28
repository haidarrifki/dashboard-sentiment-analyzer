import React, { useEffect, useState } from 'react';
// reactstrap components
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  Container,
  Row,
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  DropdownMenu,
  DropdownItem,
  CardFooter,
} from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import Header from 'components/Headers/Header.js';

import fetchJson from '../../lib/fetchJson';
import cutText from '../../lib/cutText';
import Router, { useRouter } from 'next/router';

const Klasifikasi = (props) => {
  // Router
  const router = useRouter();
  const currentPath = router.pathname;
  const currentQuery = router.query;
  currentQuery.page = currentQuery.page ? parseInt(currentQuery.page) : 1;
  currentQuery.size = currentQuery.size ? parseInt(currentQuery.size) : 10;

  // Loading process
  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const openModal = (index) => {
    setModalData(props.classifications[index]);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', startLoading);
    Router.events.on('routeChangeComplete', stopLoading);

    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', stopLoading);
    };
  }, []);

  const paginationHandler = (page, size) => {
    currentQuery.page = page;
    currentQuery.size = size;

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  let content;
  if (isLoading) {
    content = (
      <tbody>
        <tr>
          <td colSpan="3">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading data...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  } else {
    content =
      props.classifications.length > 0 ? (
        <tbody>
          {props.classifications.map((dataset, index) => (
            <tr key={dataset._id}>
              {/* <td>{index + 1}</td> */}
              <td>{cutText(dataset.review)}</td>
              <td>
                {dataset.sentiment === 1 ? (
                  <Badge key={dataset._id} color="success">
                    Positif
                  </Badge>
                ) : (
                  [
                    dataset.sentiment === 0 ? (
                      <Badge key={dataset._id} color="danger">
                        Negatif
                      </Badge>
                    ) : (
                      <Badge key={dataset._id} color="primary">
                        Unsupervised
                      </Badge>
                    ),
                  ]
                )}
              </td>
              <td className="text-right">
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn-icon-only text-light"
                    role="button"
                    size="sm"
                    color=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fas fa-ellipsis-v" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem onClick={() => openModal(index)}>
                      Detail
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan="3" align="center">
              No data.
            </td>
          </tr>
        </tbody>
      );
  }

  let modalContent;
  if (modalData) {
    modalContent = (
      <ModalBody>
        <h3>Data</h3>
        <p>
          <Badge key={modalData._id} color="default" pill>
            {modalData.type}
          </Badge>
        </p>
        <h3>Label</h3>
        <p>
          {modalData.sentiment === 1 ? (
            <Badge key={modalData._id} color="success" pill>
              Positif
            </Badge>
          ) : (
            [
              modalData.sentiment === 0 ? (
                <Badge key={modalData._id} color="danger" pill>
                  Negatif
                </Badge>
              ) : (
                <Badge key={modalData._id} color="primary" pill>
                  Unsupervised
                </Badge>
              ),
            ]
          )}
        </p>
        <h3>Teks</h3>
        <p>{modalData.review}</p>
      </ModalBody>
    );
  }

  return (
    <>
      <Header data={props.statistic} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="mb-0">List Klasifikasi</h3>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">No</th> */}
                    <th scope="col">Teks</th>
                    <th scope="col">Sentimen</th>
                    <th scope="col" />
                  </tr>
                </thead>
                {content}
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem
                      className={currentQuery.page === 1 ? 'disabled' : ''}
                    >
                      <PaginationLink
                        onClick={() =>
                          paginationHandler(
                            currentQuery.page - 1,
                            currentQuery.size
                          )
                        }
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          paginationHandler(
                            currentQuery.page + 1,
                            currentQuery.size
                          )
                        }
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        <Modal
          toggle={() => setModalOpen(!modalOpen)}
          isOpen={modalOpen}
          centered={true}
          size="lg"
        >
          <div className=" modal-header">
            <h5 className=" modal-title" id="exampleModalLabel">
              Detail Dataset
            </h5>
            <button
              aria-label="Close"
              className=" close"
              type="button"
              onClick={() => setModalOpen(!modalOpen)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {modalContent}
          <ModalFooter>
            <Button
              color="secondary"
              type="button"
              onClick={() => setModalOpen(!modalOpen)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

Klasifikasi.layout = Admin;

export async function getServerSideProps({ params, query, ...props }) {
  const statistic = await fetchJson(`http://localhost:3000/api/statistics`);

  const classifications = await fetchJson(
    `http://localhost:3000/api/classifications?page=${query.page}&size=${query.size}`
  );
  return {
    props: { statistic, classifications, page: query.page, size: query.size }, // will be passed to the page component as props
  };
}

export default Klasifikasi;
