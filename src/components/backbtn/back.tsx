import {useHistory} from 'react-router-dom';
import Button from "react-bootstrap/esm/Button";

export default function BackButton(){

    const history=useHistory();
    return(
        <div className="container">
            <Button variant="light" onClick={() => history.push('/home')}>BACK</Button>
        </div>
    )
}