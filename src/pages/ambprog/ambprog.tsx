import BackButton from "../../components/backbtn/back"
export default function Aprogram(){
    return <div className="container-fluid" id='dboardcontainer'>
        <div className="row d-flex justify-content-center">
            <BackButton/>
            <div className="col mt-3 d-flex justify-content-center">

                <p><strong>Register for the Ambassador Program Below!</strong></p>
                
            </div>
        </div>
        <div className="row">
            <div className="col">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdC-D7eAdO9FEid7LwTGG5-N6oDcWYvtLPChiVED3BB8trABA/viewform?embedded=true" width={370} height={1500} frameBorder="0" marginHeight={0} marginWidth={0}>Loading…</iframe>
            </div>
        </div>
    </div>
}
