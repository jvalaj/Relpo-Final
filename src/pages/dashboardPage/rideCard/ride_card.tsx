import { useUser } from "../../../contexts/user_context";
import { RideWithDistance } from "../../../interface/ride_interface";

export default function RideCard({ ride }: { ride: RideWithDistance }) {
  const [user] = useUser();
  return (
    <div className="card mb-3">
      <div className="d-flex align-items-center flex-wrap g-0">
       
        <div className="flex-grow-1">
          <div className="card-body">
            <h5 className="card-title">{ride.name}</h5>
            <p className="card-text">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Positions Available</strong>
                    </td>
                    <td>{ride.ridersCount}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Role Description</strong>
                    </td>
                    <td>{ride.desc}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Area</strong>
                    </td>
                    <td>{ride.city}</td>
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
