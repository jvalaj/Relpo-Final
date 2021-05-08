import React from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'

export default function Loading() {
    return (
        <div className="display-3 d-flex align-items-center justify-content-center min-vh-100">
            <Spinner animation="grow" variant="primary" />
  <Spinner animation="grow" variant="secondary" />
  <Spinner animation="grow" variant="success" />
  <Spinner animation="grow" variant="danger" />
  <Spinner animation="grow" variant="warning" />
  <Spinner animation="grow" variant="info" />
        </div>
    )
}
