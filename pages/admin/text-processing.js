import React, { useEffect, useState } from 'react';
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
  CardBody,
  Form,
  FormGroup,
  CardFooter,
  Input,
} from 'reactstrap';
// layout for this page
import Admin from 'layouts/Admin.js';
// core components
import Header from 'components/Headers/HeaderTable.js';

import fetchJson from '../../lib/fetchJson';
import cutText from '../../lib/cutText';
import Router, { useRouter } from 'next/router';

function TextProcessing(props) {
  // Router
  const router = useRouter();
  const currentPath = router.pathname;
  const currentQuery = router.query;
  currentQuery.page = currentQuery.page ? parseInt(currentQuery.page) : 1;
  currentQuery.size = currentQuery.size ? parseInt(currentQuery.size) : 10;
  // Notistack
  const { enqueueSnackbar } = useSnackbar();
  // Data
  const [textProcessings, setTextProcessings] = useState(props.textProcessings);
  const refreshData = () => {
    // router.replace(router.asPath);
    const fetchData = async () => {
      try {
        const textProcessings = await fetchJson(
          `/api/text-processings?page=${currentQuery.page}&size=${currentQuery.size}`
        );
        enqueueSnackbar('Text preprocessing from datasets success', {
          variant: 'success',
        });
        setLoading(false);
        setTextProcessings(textProcessings);
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        });
        setLoading(false);
      }
    };
    fetchData();
    // setTimeout(fetchData, 2000);
  };
  // Loading process
  const [isLoading, setLoading] = useState(false);
  // const [isLoadingClear, setLoadingClear] = useState(false);
  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const [modalFormOpen, setModalFormOpen] = React.useState(false);
  const [modalDataForm, setModalDataForm] = React.useState(null);

  const openModal = (index) => {
    setModalData(props.textProcessings[index]);
    setModalOpen(!modalOpen);
  };

  const openFormModal = async () => {
    setModalFormOpen(!modalFormOpen);
    try {
      const data = await fetchJson('/api/settings');
      setModalDataForm(
        `${data.settings.firstRatio}:${data.settings.secondRatio}`
      );
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

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

  const processText = async (e) => {
    e.preventDefault();
    if (!window.confirm('Lakukan pemrosesan text dari datasets?')) return;
    setModalFormOpen(false);
    setLoading(true);
    try {
      const data = await fetchJson('/api/text-processings/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratio: e.target.ratio.value,
        }),
      });
      if (data.status === false) {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
        setModalFormOpen(true);
        setLoading(false);
      } else {
        refreshData();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
      setLoading(false);
    }
  };

  // const clearDatasets = async (event) => {
  //   event.preventDefault();
  //   const text =
  //     'Data yang dihapus akan hilang dan tidak bisa dikembalikan. Apakah anda yakin?';
  //   if (confirm(text) == true) {
  //     setLoadingClear(true);
  //     try {
  //       await fetchJson('/api/text-processings/clear', {
  //         method: 'DELETE',
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       enqueueSnackbar('Something went wrong', {
  //         variant: 'error',
  //       });
  //     }
  //     setLoadingClear(false);
  //     enqueueSnackbar('Clear text processings list success', {
  //       variant: 'success',
  //     });
  //     setTextProcessings([]);
  //   } else {
  //     return;
  //   }
  // };

  let content;
  if (isLoading) {
    content = (
      <tbody>
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  } else {
    content =
      textProcessings.length > 0 ? (
        <tbody>
          {textProcessings.map((dataset, index) => (
            <tr key={dataset._id}>
              {/* <td>{index + 1}</td> */}
              <td>{cutText(dataset.review, 'textProcessing')}</td>
              <td>{cutText(dataset.textProcessed, 'textProcessing')}</td>
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
            <td colSpan="4" align="center">
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
        <h3>Sebelum Processing</h3>
        <p>{modalData.review}</p>
        <h3>Sesudah Processing</h3>
        <p>{modalData.textProcessed}</p>
      </ModalBody>
    );
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="mb-0">List Text Processing</h3>
                  </div>
                  <div className="col text-right">
                    {/* <Button
                      color="primary"
                      size="sm"
                      onClick={processText}
                      disabled={isLoading || textProcessings.length > 0}
                    >
                      Proses Dataset
                    </Button> */}
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => openFormModal()}
                      disabled={isLoading}
                    >
                      Proses Dataset
                    </Button>
                    {/* <Button
                      color="danger"
                      size="sm"
                      onClick={clearDatasets}
                      disabled={isLoadingClear || textProcessings.length < 1}
                    >
                      {isLoadingClear ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        'Clear Text Processings'
                      )}
                    </Button> */}
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sebelum Processing</th>
                    <th scope="col">Sesudah Processing</th>
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

        <Modal
          toggle={() => setModalFormOpen(!modalFormOpen)}
          isOpen={modalFormOpen}
          centered={true}
        >
          <div className=" modal-body p-0">
            <Card className=" bg-secondary shadow border-0">
              <CardBody className=" px-lg-5 py-lg-5">
                <Form role="form" onSubmit={processText}>
                  <FormGroup>
                    <label className=" form-control-label" htmlFor="ratio">
                      Perbandingan Data
                    </label>
                    <Input
                      name="ratio"
                      defaultValue={modalDataForm}
                      id="ratio"
                      type="text"
                      pattern="^[0-9][0-9]:[0-9][0-9]$"
                      title="Contoh Format: 90:10"
                      required
                    ></Input>
                  </FormGroup>
                  <div className=" text-center">
                    <Button className=" my-4" color="primary" type="submit">
                      Proses
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>
      </Container>
    </>
  );
}

TextProcessing.layout = Admin;

export async function getServerSideProps({ query }) {
  const textProcessings = await fetchJson(
    `${process.env.BASE_URL}/api/text-processings?page=${query.page}&size=${query.size}`
  );
  return {
    props: { textProcessings, page: query.page, size: query.size }, // will be passed to the page component as props
  };
}

export default TextProcessing;
