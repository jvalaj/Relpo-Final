import {useHistory} from 'react-router-dom';
import Button from "react-bootstrap/esm/Button";

export default function BackButton(){

    const history=useHistory();
    return(
        <div className="container">
            <Button variant="light" className='m-2' onClick={() => history.push('/home')}>BACK</Button>
        </div>
    )
}