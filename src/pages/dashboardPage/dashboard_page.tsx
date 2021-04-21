import { useUser } from "../../contexts/user_context";
import "./dashboard_page.css";
import { Form, Modal, Button } from "react-bootstrap";
import React, { FormEvent, useEffect, useState } from "react";
import { usePosition } from "../../components/useLocation/useLocation";
import plus from "./images/plus.png";
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
import { uploadButtonImage } from "../../utils/firebase/storage";

function rad(x: number) {
  return (x * Math.PI) / 180;
}

function getDistance(
  rideLat: number,
  rideLong: number,
  currLat: number,
  currLong: number
) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(rideLat - currLat);
  var dLong = rad(rideLong - currLong);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(rideLat)) *
      Math.cos(rad(currLat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = (R * c) / 1000;
  return d; // returns the distance in meter
}

export default function DashboardPage() {
  const [user] = useUser();
  const { latitude, longitude } = usePosition();
  const [hostModalVisibility, setHostModalVisibility] = useState(false);
  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const [image, setImage] = useState<any>();
  const [hostedRides, setHostedRides] = useState<
    RideWithDistance[] | undefined
  >(undefined);
  const [rideName, setRideName] = useState("");
  const [ridersCount, setRidersCount] = useState(0);
  const [city, setCity] = useState("");
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
    let tempURL = "";
    if (image) {
      tempURL = await uploadButtonImage(user, image);
    }
    if (rideName === "") return;
    if (city === "") return;
    //verification
    const tempUID = uuidv4();
    if (user)
      addRide({
        name: rideName,
        ridersCount,
        city,
        lat: latitude,
        long: longitude,
        uuid: tempUID,
        host: user?.uuid,
        participants: [],
        imageURL: tempURL,
      }).then(() => {
        addRideToUser(user, tempUID, true);
        setHostModalVisibility(false);
        history.push("/ride/" + tempUID);
        setRideName("");
        setRidersCount(0);
        setCity("");
        setLoading(false);
      });
  }
  async function processRides(rides: any) {
    console.log(latitude);
    const tempRides: RideWithDistance[] = [];
    for (let ride of rides) {
      const rideUser = await getUserByUID(ride.host);
      tempRides.push({
        ...ride,
        distance: getDistance(ride.lat, ride.long, latitude, longitude),
        user: rideUser,
      });
    }
    tempRides.sort((a, b) => a.distance - b.distance);
    return tempRides;
  }
  useEffect(() => {
    if (!longitude || !latitude || !hostedRides) return;
    async function t() {
      const newrides: any = await processRides(hostedRides);
      setHostedRides((rides) => newrides);
    }
    t();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  useEffect(() => {
    if (hostedRides || !longitude || !latitude) return;
    fire
      .firestore()
      .collection("rides")
      .onSnapshot(async (snapshot: any) => {
        const rides: RideInterface[] = [];
        snapshot.docs.forEach((doc: any) => rides.push(doc.data()));
        setHostedRides(await processRides(rides));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);
  function onImageChange(e: any) {
    setImage(e.target.files[0]);
  }
  return (
    <div className="section1">
      <Modal
        centered
        show={yourRidesVisibility}
        onHide={() => setYourRidesVisibility(false)}
      >
        <Modal.Header closeButton>Your Rides</Modal.Header>
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
                YOU HAVE NOT HOSTED OR JOINED ANY RIDES YET.
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
        <Modal.Header closeButton>Book {selectedRide?.name}</Modal.Header>
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
        <Modal.Header closeButton>Host a ride</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Ride Name</Form.Label>
              <Form.Control
                value={rideName}
                onChange={(e) => setRideName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>No. of riders</Form.Label>
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
              <Form.Label>City/Area</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Add Image (Optional)</Form.Label>
              <div
                className="d-flex align-items-center justify-content-center pointer-on-hover"
                style={{
                  backgroundColor: "#F4F5F8",
                  height: 109,
                  width: 92,
                }}
                onClick={() => document.getElementById("choose_pp")?.click()}
              >
                <img
                  alt="plus"
                  height={image ? 109 : 27}
                  width={image ? 92 : 27}
                  src={image ? URL.createObjectURL(image) : plus}
                />
                <input
                  id="choose_pp"
                  style={{
                    display: "none",
                  }}
                  type="file"
                  onChange={onImageChange}
                />
              </div>
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
        <Modal.Header closeButton>Join a ride</Modal.Header>
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
              <div className="text-center text-danger">NO RIDES NEAR YOU! </div>
            )}
        </Modal.Body>
      </Modal>
      <div className="container" id="base">
        <div className="row-fluid ">
          <div className="col-fluid text-center text-inline">
            <h3 className="display-2">Hi,{user?.name}</h3>
          </div>
          <br />
          <div
            className="row d-flex flex-row justify-content-around"
            id="btncontainer"
          >
            <div className="col-fluid">
              <button
                type="button"
                className="btn btn-dark"
                id="buttonsbox"
                onClick={() => setHostModalVisibility(true)}
              >
                HOST
              </button>
            </div>
            <div className="col-fluid">
              <Button
                type="button"
                className="btn btn-dark"
                id="buttonsbox"
                onClick={() => setYourRidesVisibility(true)}
              >
                YOUR RIDES
              </Button>
            </div>

            <div className="col-fluid">
              <button
                onClick={() => setJoinModalVisibility(true)}
                type="button"
                className="btn btn-dark"
                id="buttonsbox"
              >
                JOIN
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
    </div>
  );
}
