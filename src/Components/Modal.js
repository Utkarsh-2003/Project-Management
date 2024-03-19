import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Mark As Done
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are You  Sure? This Task will be marked as done!
        </p>
        <Button className="me-2" variant="success" onClick={() => alert("Work Done!")}>Mark As Done</Button>
        <Button variant="danger" onClick={props.onHide}>Cancel</Button>
      </Modal.Body>
     
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Mark As Done
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

render(<App />);