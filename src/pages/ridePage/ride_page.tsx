import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import Loading from "../../components/loading/loading";
import { usePosition } from "../../components/useLocation/useLocation";
import { useUser } from "../../contexts/user_context";
import RideInterface from "../../interface/ride_interface";
import UserInterface from "../../interface/user_interface";
import fire from "../../utils/firebase/firebase";
import {
  getUserByUID,
  removeUserFromRide,
} from "../../utils/firebase/firestore";
import ChatBox from "./chatBox/chat_box";
import userimage from "./user.png";

export interface RideWithID extends RideInterface {
  docID: string;
}
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
export default function RidePage() {
  const params: any = useParams();
  const history = useHistory();
  const { latitude, longitude } = usePosition();

  const [user] = useUser();
  const [ride, setRide] = useState<null | undefined | RideWithID>(undefined);
  const [participants, setParticipants] = useState<UserInterface[]>([]);
  const [host, setHost] = useState<null | UserInterface>(null);
  const [showChats, setShowChats] = useState(false);
  const [dis, setDis] = useState(0);
  async function deleteRide() {
    const data = await fire
      .firestore()
      .collection("rides")
      .doc(ride?.docID)
      .get();
    data.ref.delete();
    history.push("/home");
  }

  useEffect(() => {
    fire
      .firestore()
      .collection("rides")
      .where("uuid", "==", params.rideID)
      .onSnapshot((data: any) => {
        if (data && data.docs.length === 1) {
          if (!user) return;
          const _ride = data.docs[0].data();
          if (
            !_ride.participants.includes(user?.uuid) &&
            _ride.host !== user.uuid
          ) {
            history.push("/home");
          } else {
            setRide({ ..._ride, docID: data.docs[0].id });
          }
        } else {
          history.push("/home");
        }
      });
    //eslint-disable-next-line
  }, [params.rideID]);
  useEffect(() => {
    // console.log(ride.lat, latitude);
    if (ride) setDis(getDistance(ride.lat, ride.long, latitude, longitude));
  }, [ride, latitude, longitude]);
  useEffect(() => {
    async function t() {
      if (ride) {
        const hostDoc: any = await getUserByUID(ride.host);
        if (hostDoc) setHost(hostDoc);
        let tempParticipants: UserInterface[] = [];
        for (let participant of ride.participants) {
          const doc: any = await getUserByUID(participant);
          if (doc) tempParticipants.push(doc);
        }
        setParticipants(tempParticipants);
      }
    }
    if (ride) t();
  }, [ride]);
  if (ride === undefined) return <Loading />;
  if (ride === null) return <div>NOT FOUND :(</div>;
  return (
    <div className="container min-vh-100 ">
      <Modal centered show={showChats} onHide={() => setShowChats(false)}>
        <Modal.Header closeButton>Chat</Modal.Header>
        <Modal.Body>
          <ChatBox ride={ride} />
        </Modal.Body>
      </Modal>
      <div className="row ">
        <div className="col-md-8 p-3 d-flex align-items-center justify-content-center">
          <span className="border border-dark w-100">
            <div className="card">
              <div className="card-header">{ride.name}</div>
              <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img
                    height={128}
                    width={128}
                    src={
                      ride.imageURL !== ""
                        ? ride.imageURL
                        : "https://www.iconbunny.com/icons/media/catalog/product/3/3/332.9-cycle-icon-iconbunny.jpg"
                    }
                    alt="..."
                    className="img-fluid m-3"
                  />
                </div>
                <div
                  className="badge badge-warning"
                  style={{ height: 20 }}
                ></div>
                <div className="col-md-8 ">
                  <div className="card-body">
                    {host && (
                      <h5 className="card-title">{host?.name}'s Ride</h5>
                    )}
                    <p className="card-text">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Distance</strong>
                            </td>
                            <td>{dis.toFixed()}km</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Riders</strong>
                            </td>
                            <td>{ride.ridersCount}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Area</strong>
                            </td>
                            <td>{ride.city}</td>
                          </tr>
                        </tbody>
                      </table>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </div>
        <div className="col-md-4 d-flex align-items-center  p-3 justify-content-center flex-column">
          <button
            onClick={() => setShowChats(true)}
            className="btn btn-outline-dark flex-grow-1 w-100 mb-1 "
          >
            CHAT
          </button>
          {user?.uuid === ride.host && (
            <button
              onClick={deleteRide}
              className="btn btn-outline-danger flex-grow-1 w-100 mb-1 "
            >
              DELETE RIDE
            </button>
          )}
        </div>
      </div>
      {participants.length > 0 && (
        <div className="row d-flex align-items-center justify-content-center mt-4">
          <h2>PARTICIPANTS</h2>
        </div>
      )}
      {participants.map((p) => (
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">{p.name}</div>
              <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img src={userimage} alt="..." className="img-fluid" />
                </div>
                <div
                  className="badge badge-warning"
                  style={{ height: 20 }}
                ></div>
                <div className="col-md-8 ">
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Email</strong>
                            </td>
                            <td>{p.email}</td>
                          </tr>
                        </tbody>
                      </table>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {user?.uuid === ride.host && (
            <div className="col-md-4  d-flex align-items-center justify-content-center flex-column">
              <button
                onClick={() => {
                  removeUserFromRide(p.uuid, ride);
                }}
                className="btn btn-danger flex-grow-1 w-100 mt-1"
              >
                KICK
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
