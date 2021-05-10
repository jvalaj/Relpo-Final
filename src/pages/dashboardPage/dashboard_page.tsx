import { useUser } from "../../contexts/user_context";
import "./dashboard_page.css";
import { Form, Modal, Button } from "react-bootstrap";
import { FormEvent, useEffect, useState } from "react";

import {
  addRide,
  addRideToUser,
  getUserByUID,
} from "../../utils/firebase/firestore";
import RideInterface, {
  RideWithDistance,
} from "../../interface/ride_interface";
import fire from "../../utils/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import RideCard from "./rideCard/ride_card";
import RideInfo from "./rideInfo/ride_info";
import { signOut } from "../../utils/firebase/auth";
import { useHistory } from "react-router-dom";


export default function DashboardPage() {
  const [user] = useUser();
  const [hostModalVisibility, setHostModalVisibility] = useState(false);
  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const [hostedRides, setHostedRides] = useState<
    RideWithDistance[] | undefined
  >(undefined);
  const [rideName, setRideName] = useState("");
  const [ridersCount, setRidersCount] = useState(0);
  const [city, setCity] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRide, setSelectedRide] = useState<null | RideWithDistance>(
    null
  );
  const history = useHistory();
  const [yourRidesVisibility, setYourRidesVisibility] = useState(false);
  const closeRideInfo = () => setSelectedRide(null);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (rideName === "") return;
    if (city === "") return;
    //verification
    const tempUID = uuidv4();
    if (user)
      addRide({
        name: rideName,
        ridersCount,
        city,
        desc,
        uuid: tempUID,
        host: user?.uuid,
        participants: [],
      }).then(() => {
        addRideToUser(user, tempUID, true);
        setHostModalVisibility(false);
        history.push("/ride/" + tempUID);
        setRideName("");
        setRidersCount(0);
        setCity("");
        setDesc("");
        setLoading(false);
      });
  }
  async function processRides(rides: any) {
    console.log(rides)
    const tempRides: RideWithDistance[] = [];
    for (let ride of rides) {
      const rideUser = await getUserByUID(ride.host);
      tempRides.push({
        ...ride,
        user: rideUser,
      });
    }
    return tempRides;
  }

  useEffect(() => {
    if (hostedRides) return;
    fire
      .firestore()
      .collection("rides")
      .onSnapshot(async (snapshot: any) => {
        const rides: RideInterface[] = [];
        snapshot.docs.forEach((doc: any) => rides.push(doc.data()));
        setHostedRides(await processRides(rides));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center " id='dboardcontainer'>
      <Modal
        centered
        show={yourRidesVisibility}
        onHide={() => setYourRidesVisibility(false)}
      >
        <Modal.Header closeButton>Your Gigs</Modal.Header>
        <Modal.Body>
          {user &&
            hostedRides &&
            hostedRides.filter(
              (ride) =>
                ride.host === user?.uuid ||
                ride.participants.includes(user?.uuid)
            ).length > 0 &&
            hostedRides
              .filter(
                (ride) =>
                  ride.host === user?.uuid ||
                  ride.participants.includes(user?.uuid)
              )
              .map((ride) => (
                <div
                  onClick={() => history.push("/ride/" + ride.uuid)}
                  className="pointer-on-hover"
                >
                  <RideCard ride={ride} />
                </div>
              ))}
          {user &&
            hostedRides &&
            hostedRides.filter(
              (ride) =>
                ride.host === user?.uuid ||
                ride.participants.includes(user?.uuid)
            ).length === 0 && (
              <div className="text-danger text-center">
                YOU HAVE NOT HOSTED OR APPLIED TO ANY GIGS YET.
              </div>
            )}
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={selectedRide !== null}
        onHide={() => {
          setSelectedRide(null);
          setJoinModalVisibility(true);
        }}
      >
        <Modal.Header closeButton>Apply to {selectedRide?.name}</Modal.Header>
        <Modal.Body>
          {selectedRide && (
            <RideInfo closeRideInfo={closeRideInfo} ride={selectedRide} />
          )}
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={hostModalVisibility}
        onHide={() => setHostModalVisibility(false)}
      >
        <Modal.Header closeButton>Host a Gig</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Gig Name</Form.Label>
              <Form.Control
                value={rideName}
                onChange={(e) => setRideName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Positions Available</Form.Label>
              <Form.Control
                value={ridersCount}
                onChange={(e) => {
                  if (parseInt(e.target.value) >= 0)
                    setRidersCount(parseInt(e.target.value));
                }}
                type={"number"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description of story and each role</Form.Label>
              <Form.Control
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>City/Area (Please Enter Complete Address)</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
            <Button
              disabled={loading}
              variant="dark"
              className="rounded-pill"
              type="submit"
            >
              {!loading ? "Host Now" : "Loading.."}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={joinModalVisibility}
        onHide={() => setJoinModalVisibility(false)}
      >
        <Modal.Header closeButton>Available Gigs</Modal.Header>
        <Modal.Body>
          {!selectedRide &&
            hostedRides &&
            hostedRides.filter((ride) => ride.host !== user?.uuid).length > 0 &&
            hostedRides
              .filter((ride) => ride.host !== user?.uuid)
              .map((ride) => (
                <div
                  onClick={() => {
                    setJoinModalVisibility(false);
                    setTimeout(() => setSelectedRide(ride), 100);
                  }}
                  className="pointer-on-hover"
                >
                  <RideCard key={ride.uuid} ride={ride} />
                </div>
              ))}
          {!selectedRide &&
            hostedRides &&
            hostedRides.filter((ride) => ride.host !== user?.uuid).length ===
            0 && (
              <div className="text-center text-danger">NO GIGS NEAR YOU! </div>
            )}
        </Modal.Body>
      </Modal>


      <div className="container-fluid min-vh-100 d-flex flex-column p-3 ">
        <div className="row-fluid p-3">
          <div className="col-fluid text-center text-inline">
            <h3 className="display-2">Hi,{user?.name}</h3>
          </div>
        </div>
        <div className="row-fluid p-3 d-flex flex-grow-1  flex-column align-items-center justify-content-center">
          <div className="col-fluid">
            <button
              type="button"
              className="btn btn-dark"
              id="buttonsbox"
              onClick={() => setHostModalVisibility(true)}
            >
              HOST A GIG
              </button>
          </div>
          <div className="col-fluid">
            <Button
              type="button"
              className="btn btn-dark"
              id="buttonsbox"
              onClick={() => setYourRidesVisibility(true)}
            >
              YOUR GIGS
              </Button>
          </div>

          <div className="col-fluid">
            <button
              onClick={() => setJoinModalVisibility(true)}
              type="button"
              className="btn btn-dark"
              id="buttonsbox"
            >
              FIND GIGS 
              </button>
          </div>
          <div className="col-fluid">
            <button
              onClick={signOut}
              type="button"
              className="btn btn-dark text-wrap"
              id="buttonsbox"
            >
              SIGN OUT
              </button>
          </div>
        </div>
      </div>
    </div>

  );
}


