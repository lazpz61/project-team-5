import React, { useState, useEffect } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useUser } from "../Components/UserContext";
import { useParams, useNavigate } from "react-router-dom";

function ProfileInfo({ userType, username }) {
  if (userType === "renter") {
    return (
      <div
        style={{
          marginLeft: "10px",
        }}
      >
        <h1>Profile Page</h1>
        <p>Welcome, {username}!</p>
        <p>You are a renter!</p>
      </div>
    );
  } else if (userType === "host") {
    return (
      <div
        style={{
          marginLeft: "10px",
        }}
      >
        <h1>Profile Page</h1>
        <p>Welcome, {username}!</p>
        <p>You are a host!</p>
      </div>
    );
  } else if (userType === "general") {
    return (
      <div>
        <h1>Profile Page</h1>
        <p>Welcome, {username}!</p>
        <p>You are a renter/host!</p>
      </div>
    );
  } else {
    return (
      <div
        style={{
          marginLeft: "10px",
        }}
      >
        <h1>Profile Page</h1>
        <p>Welcome, {username}!</p>
        <p>I don't know what you are!</p>
      </div>
    );
  }
}

function View() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { username, userType } = useUser();
  const navigate = useNavigate();
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "",
    price: "",
    owner: "",
  });
  const [updateReservationData, setUpdateReservationData] = useState({
    reservation_id: null,
    start_date: "",
    end_date: "",
    item_id: "",
    user_name: ""
  });

  useEffect(() => {
    fetchEquipmentData();
    fetchReservationData();
    fetchReviewsData();
  }, [username]);

  const fetchEquipmentData = () => {
    fetch("http://127.0.0.1:5000/api/getEquipment")
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error("Error:", error));
  };

  const fetchReservationData = () => {
    fetch("http://127.0.0.1:5000/api/getReservation")
      .then((response) => response.json())
      .then((data) => setReservationData(data))
      .catch((error) => console.error("Error:", error));
  };

  const fetchReviewsData = () => {
    fetch(`http://127.0.0.1:5000/api/getReviews/${username}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleRemoveClick = (event, equipment) => {
    event.stopPropagation();
    setSelectedItem(equipment);
    setShowRemoveModal(true);
  };

  const handleRemoveReservationClick = (event, reservation) => {
    event.stopPropagation();
    setSelectedItem(reservation);
    setShowRemoveModal(true);
  };

  const handleAddClick = () => {
    navigate("/Items");
  };


  const handleRemoveConfirm = () => {
    if (!selectedItem) {
      console.error("No item selected for removal.");
      return;
    }
    console.log("Selected Item:", selectedItem);
    fetch(`http://127.0.0.1:5000/api/removeEquipment/${selectedItem.itemid}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchEquipmentData();
        setShowRemoveModal(false);
        setSelectedItem(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUpdateClick = (event, equipment) => {
    event.stopPropagation();
    setSelectedItem(equipment);
    setUpdateFormData({
      id: equipment.itemid,
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      price: equipment.price,
      owner: equipment.owner,
    });
    setShowUpdateModal(true);
  };

  
  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    console.log(updateFormData);
    fetch(`http://127.0.0.1:5000/api/updateEquipment/${updateFormData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchEquipmentData();
        setShowUpdateModal(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleRemoveReservationConfirm = () => {
    if (!selectedItem) {
      console.error("No item selected for removal.");
      return;
    }
    console.log("Selected Item:", selectedItem);
    fetch(`http://127.0.0.1:5000/api/removeReservation/${selectedItem.reservation_id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchReservationData();
        setShowRemoveModal(false);
        setSelectedItem(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUpdateReservationClick = (event, reservation) => {
    event.stopPropagation();
    setSelectedItem(reservation);
    setUpdateReservationData({
      reservation_id: reservation.reservation_id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      item_id: reservation.item_id,
      user_name: reservation.user_name
    });
    setShowUpdateModal(true);
  };

  const handleUpdateReservationSubmit = (event) => {
    event.preventDefault();
    console.log(updateReservationData);
    fetch(`http://127.0.0.1:5000/api/updateReservation/${updateReservationData.reservation_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateReservationData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchReservationData();
        setShowUpdateModal(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCardClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowModal(true);
  };

  const handleProfileClick = () => {
    navigate("/AllProfile");
  };

  const dateDisplay = (date) => {
    return new Date(date).toLocaleDateString('en-US', 
    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (userType === "renter") {
    return (
      <div>
        <NavbarCustom />
        <ProfileInfo userType={userType} username={username} />
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="success"
            type="submit"
            style={{
              fontSize: "20px",
              width: "45%",
              marginRight: "5px",
              marginTop: "15px",
              marginBottom: "25px",
            }}
            id="submitButton"
            onClick={() => handleAddClick()}
          >
            View Item
          </Button>
          <Button
            variant="secondary" // Set the desired Bootstrap button variant
            onClick={() => handleProfileClick()} // Replace handleNewButtonClick with your logic
            style={{
              fontSize: "20px",
              width: "45%",
              marginLeft: "5px",
              marginTop: "15px",
              marginBottom: "25px",
            }}
          >
            View other Profiles
          </Button>
        </div>
        <Container fluid>
          <Row>
            <Col md={8} className="reservation-column">
              <h2>Active Reservations</h2>
              <Row>
                {reservationData.map(
                  (reservation) =>
                  reservation.user_name === username && (
                      <Col key={reservation.reservation_id} xs={12} sm={6} md={6} lg={6}>
                        <Card
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body>
                            <Card.Text>Start Date: {dateDisplay(reservation.start_date)}</Card.Text>
                            <Card.Text>End Date: {dateDisplay(reservation.end_date)}</Card.Text>
                            <Button
                              variant="danger"
                              name={`remove-${reservation.reservation_id}`}
                              onClick={(e) => handleRemoveReservationClick(e, reservation)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              name={`remove-${reservation.reservation_id}`}
                              onClick={(e) => handleUpdateReservationClick(e, reservation)}
                            >
                              Modify
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                )}
              </Row>
            </Col>
            <Col md={4} className="reviews-column">
              <h2>Reviews for {username}</h2>
              {reviews.length === 0 ? (
                <p>This person has no reviews yet.</p>
              ) : (
                reviews.map((review, index) => (
                  <Card key={index} style={{ marginBottom: "10px" }}>
                    <Card.Body>
                      <Card.Title>{review[3]}</Card.Title>
                      <Card.Text>Rating: {review[4]}</Card.Text>
                      <Card.Text>{review[5]}</Card.Text>
                      <Card.Text>By: {review[2]}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>
        </Container>
        {/* Add a section to display reviews */}


        <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
          {/* Remove confirmation modal */}
          <Modal.Header closeButton>
            <Modal.Title>Confirm Removal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove {selectedItem?.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button name="remove2" variant="danger" onClick={handleRemoveReservationConfirm}>
              Remove
            </Button>
            <Button
              name="cancel"
              variant="secondary"
              onClick={() => setShowRemoveModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          {/* Update reservation modal */}
          <Modal.Header closeButton>
            <Modal.Title>Edit Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateReservationSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={updateReservationData.start_date}
                  onChange={(e) =>
                    setUpdateReservationData({ ...updateReservationData, start_date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={updateReservationData.end_date}
                  onChange={(e) =>
                    setUpdateReservationData({
                      ...updateReservationData,
                      end_date: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );

  } else if (userType === "host") {
    return (
      <div>
        <NavbarCustom />
        <ProfileInfo userType={userType} username={username} />
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="success"
            type="submit"
            style={{
              fontSize: "20px",
              width: "45%",
              marginRight: "5px",
              marginTop: "15px",
              marginBottom: "25px",
            }}
            id="submitButton"
            onClick={() => handleAddClick()}
          >
            Add Item
          </Button>
          <Button
            variant="secondary" // Set the desired Bootstrap button variant
            onClick={() => handleProfileClick()} // Replace handleNewButtonClick with your logic
            style={{
              fontSize: "20px",
              width: "45%",
              marginLeft: "5px",
              marginTop: "15px",
              marginBottom: "25px",
            }}
          >
            View other Profiles
          </Button>
        </div>
        <Container fluid>
          <Row>
            <Col md={8} className="equipment-column">
              <h2>Equipment Items</h2>
              <Row>
                {equipmentData.map(
                  (equipment) =>
                    equipment.owner === username && (
                      <Col key={equipment.id} xs={12} sm={6} md={6} lg={6}>
                        <Card
                          onClick={() => handleCardClick(equipment)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body>
                            <Card.Title>{equipment.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Status: {equipment.status}
                            </Card.Subtitle>
                            <Card.Text>{equipment.description}</Card.Text>
                            <Card.Text>Price: ${equipment.price}</Card.Text>
                            <Card.Text>Owner: {equipment.owner}</Card.Text>
                            <Button
                              variant="danger"
                              name={`remove-${equipment.itemid}`}
                              onClick={(e) => handleRemoveClick(e, equipment)}
                            >
                              Remove
                            </Button>
                            <Button
                              variant="primary"
                              name={`remove-${equipment.itemid}`}
                              onClick={(e) => handleUpdateClick(e, equipment)}
                            >
                              Update
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                )}
              </Row>
            </Col>
            <Col md={4} className="reviews-column">
              <h2>Reviews for {username}</h2>
              {reviews.length === 0 ? (
                <p>This person has no reviews yet.</p>
              ) : (
                reviews.map((review, index) => (
                  <Card key={index} style={{ marginBottom: "10px" }}>
                    <Card.Body>
                      <Card.Title>{review[3]}</Card.Title>
                      <Card.Text>Rating: {review[4]}</Card.Text>
                      <Card.Text>{review[5]}</Card.Text>
                      <Card.Text>By: {review[2]}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>
        </Container>
        {/* Add a section to display reviews */}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEquipment?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Status: {selectedEquipment?.status}</p>
            <p>Description: {selectedEquipment?.description}</p>
            <p>Price: ${selectedEquipment?.price}</p>
            <p>Owner: {selectedEquipment?.owner}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              name="close"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
          {/* Remove confirmation modal */}
          <Modal.Header closeButton>
            <Modal.Title>Confirm Removal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove {selectedItem?.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button name="remove2" variant="danger" onClick={handleRemoveConfirm}>
              Remove
            </Button>
            <Button
              name="cancel"
              variant="secondary"
              onClick={() => setShowRemoveModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          {/* Update item modal */}
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={updateFormData.name}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={updateFormData.description}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={updateFormData.status}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      status: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={updateFormData.price}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      price: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default View;
