import React, { useEffect, useState, useRef } from 'react';
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
  Form,
} from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import Header from 'components/Headers/Header.js';

import fetchJson from '../../lib/fetchJson';
import cutText from '../../lib/cutText';
import Router, { useRouter } from 'next/router';

const Datasets = (props) => {
  // Router
  const router = useRouter();
  const currentPath = router.pathname;
  const currentQuery = router.query;
  currentQuery.page = currentQuery.page ? parseInt(currentQuery.page) : 1;
  currentQuery.size = currentQuery.size ? parseInt(currentQuery.size) : 10;
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const [file, setFile] = useState(null);
  const fileUploadRef = useRef(null);
  // Loading process
  const [isLoading, setLoading] = useState(false);
  const [isLoadingImport, setLoadingImport] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const openModal = (index) => {
    setModalData(props.datasets[index]);
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

  const uploadToClient = (event) => {
    setFile(null);
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setFile(i);
    }
  };

  const uploadToServer = async (event) => {
    event.preventDefault();
    if (!file) {
      return alert('file belum dipilih');
    }
    setLoadingImport(true);
    const body = new FormData();
    body.append('file', file);
    await fetchJson('/api/datasets/import', {
      method: 'POST',
      body,
    });
    setLoadingImport(false);
    refreshData();
    setFile(null);
    fileUploadRef.current.value = '';
    alert('Import datasets success');
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
      props.datasets.length > 0 ? (
        <tbody>
          {props.datasets.map((dataset, index) => (
            <tr key={dataset._id}>
              {/* <td>{index + 1}</td> */}
              <td>{cutText(dataset.review)}</td>
              <td>
                {dataset.label === 'positive' ? (
                  <Badge key={dataset._id} color="success">
                    Positif
                  </Badge>
                ) : (
                  [
                    dataset.label === 'negative' ? (
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
          {modalData.label === 'pos' ? (
            <Badge key={modalData._id} color="success" pill>
              Positif
            </Badge>
          ) : (
            [
              modalData.label === 'neg' ? (
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
                    <h3 className="mb-0">List Dataset</h3>
                  </div>
                  <div className="col text-right">
                    <Form>
                      <div className="custom-file">
                        <input
                          lang="en"
                          type="file"
                          onChange={uploadToClient}
                          ref={fileUploadRef}
                          accept=".csv, .xls, .xlsx, text/csv, application/csv,
                            text/comma-separated-values, application/csv, application/excel,
                            application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
                            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />
                        <Button
                          color="primary"
                          size="sm"
                          onClick={uploadToServer}
                          disabled={isLoadingImport}
                        >
                          {isLoadingImport ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            'Import'
                          )}
                        </Button>
                        <Button
                          color="success"
                          size="sm"
                          href="/sample_dataset.csv"
                          download
                        >
                          Download sample
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">No</th> */}
                    <th scope="col">Teks</th>
                    <th scope="col">Probabilitas</th>
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

Datasets.layout = Admin;

export async function getServerSideProps({ params, query, ...props }) {
  const statistic = await fetchJson(`http://localhost:3000/api/statistics`);

  const datasets = await fetchJson(
    `http://localhost:3000/api/datasets?page=${query.page}&size=${query.size}`
  );
  return {
    props: { statistic, datasets, page: query.page, size: query.size }, // will be passed to the page component as props
  };
}

export default Datasets;
