import { useUser } from "../../../contexts/user_context";
import { RideWithDistance } from "../../../interface/ride_interface";

export default function RideCard({ ride }: { ride: RideWithDistance }) {
  const [user] = useUser();
  return (
    <div className="card mb-3">
      <div className="d-flex align-items-center flex-wrap g-0">
        <div className="p-2">
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
        </div>
        <div className="flex-grow-1">
          <div className="card-body">
            <h5 className="card-title">{ride.name} Ride</h5>
            <p className="card-text">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Distance</strong>
                    </td>
                    <td>{ride.distance.toFixed()}km</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Riders</strong>
                    </td>
                    <td>{ride.ridersCount}</td>
                  </tr>
                </tbody>
              </table>
              <div className="badge badge-warning m-2" style={{ height: 20 }}>
                {ride.host === user?.uuid && "You are the Host"}
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
