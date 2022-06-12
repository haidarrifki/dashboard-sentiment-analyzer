import React, { useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
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
import Header from 'components/Headers/HeaderTable.js';

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
  // Data
  const [datasets, setDatasets] = useState(props.datasets);
  const refreshData = () => {
    // router.replace(router.asPath);
    const fetchData = async () => {
      const datasets = await fetchJson(
        `/api/datasets?page=${currentQuery.page}&size=${currentQuery.size}`
      );
      setLoadingImport(false);
      setFile(null);
      fileUploadRef.current.value = '';
      enqueueSnackbar('Import datasets success', {
        variant: 'success',
      });
      setDatasets(datasets);
    };
    setTimeout(fetchData, 2500);
  };
  // Notistack
  const { enqueueSnackbar } = useSnackbar();
  // Files
  const [file, setFile] = useState(null);
  const fileUploadRef = useRef(null);
  // Loading process
  const [isLoading, setLoading] = useState(false);
  const [isLoadingImport, setLoadingImport] = useState(false);
  const [isLoadingClear, setLoadingClear] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const openModal = (index) => {
    setModalData(datasets[index]);
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
    refreshData();
  };

  const clearDatasets = async (event) => {
    event.preventDefault();
    const text =
      'Data yang dihapus akan hilang dan tidak bisa dikembalikan. Apakah anda yakin?';
    if (!window.confirm(text)) return;
    setLoadingClear(true);
    try {
      await fetchJson('/api/datasets/clear', {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
    }
    setLoadingClear(false);
    enqueueSnackbar('Clear datasets success', {
      variant: 'success',
    });
    setDatasets([]);
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
      datasets.length > 0 ? (
        <tbody>
          {datasets.map((dataset, index) => (
            <tr key={dataset._id}>
              {/* <td>{index + 1}</td> */}
              <td>{cutText(dataset.review)}</td>
              <td>
                {dataset.sentiment === 'positive' ? (
                  <Badge key={dataset._id} color="success">
                    Positif
                  </Badge>
                ) : (
                  [
                    dataset.sentiment === 'negative' ? (
                      <Badge key={dataset._id} color="danger">
                        Negatif
                      </Badge>
                    ) : (
                      <Badge key={dataset._id} color="primary">
                        Neutral
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
        {/* <h3>Data</h3>
        <p>
          <Badge key={modalData._id} color="default" pill>
            {modalData.type}
          </Badge>
        </p> */}
        <h3>Label</h3>
        <p>
          {modalData.sentiment === 'positive' ? (
            <Badge key={modalData._id} color="success" pill>
              Positif
            </Badge>
          ) : (
            [
              modalData.sentiment === 'negative' ? (
                <Badge key={modalData._id} color="danger" pill>
                  Negatif
                </Badge>
              ) : (
                <Badge key={modalData._id} color="primary" pill>
                  Neutral
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
      <Header />
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
                          disabled={isLoadingImport || !file}
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
                        <Button
                          color="danger"
                          size="sm"
                          onClick={clearDatasets}
                          disabled={isLoadingClear || datasets.length < 1}
                        >
                          {isLoadingClear ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            'Clear Datasets'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
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

Datasets.layout = Admin;

export async function getServerSideProps({ query }) {
  const datasets = await fetchJson(
    `${process.env.BASE_URL}/api/datasets?page=${query.page}&size=${query.size}`
  );
  return {
    props: { datasets, page: query.page, size: query.size }, // will be passed to the page component as props
  };
}

export default Datasets;
