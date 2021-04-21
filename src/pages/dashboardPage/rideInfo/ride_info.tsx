import React from "react";
import { useHistory } from "react-router";
import { useUser } from "../../../contexts/user_context";
import { RideWithDistance } from "../../../interface/ride_interface";
import {
  addRideToUser,
  addUserToRide,
} from "../../../utils/firebase/firestore";

export default function RideInfo({
  ride,
  closeRideInfo,
}: {
  ride: RideWithDistance;
  closeRideInfo: any;
}) {
  const [user] = useUser();
  const history = useHistory();
  function addRide() {
    if (user)
      addRideToUser(user, ride.uuid, false).then(() =>
        addUserToRide(user, ride).then(() => {
          closeRideInfo();
          history.push("/ride/" + ride.uuid);
        })
      );
  }

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-12">
          <div className="card-body">
            <img
              className="m-2"
              width={120}
              height={120}
              src={
                ride.imageURL !== ""
                  ? ride.imageURL
                  : "https://www.iconbunny.com/icons/media/catalog/product/3/3/332.9-cycle-icon-iconbunny.jpg"
              }
              alt="ride"
            />
            <h5 className="card-title">{ride.name}</h5>
            <p className="card-text">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Distance</strong>
                    </td>
                    <td>{ride.distance.toFixed()}m</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Riders</strong>
                    </td>
                    <td>{ride.ridersCount}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{ride.city}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={addRide} className="btn btn-dark">
                Join
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
