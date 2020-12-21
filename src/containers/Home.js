import React from "react";
import "./Home.css";
import {Form, Button} from 'react-bootstrap';
import config from "../config"
import { s3Upload } from "../libs/awsLib"


export default function Home() {
    const file = React.useRef(null);

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
          alert(
            `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
              1000000} MB.`
        );
        return;
        }

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

          } catch (e) {
          }
        
    }



  return (
    <div className="Home">
      <div className="lander">
        <h1>Area Detection</h1>
        <p className="text-muted">Upload Image or Image Series for Analysis</p>
      </div>
      <Form onSubmit={handleSubmit}>
            <Form.Group controlId="file">
                <Form.Label>Input Image</Form.Label>
                <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
            <Button type="submit"/>
      </Form>
    </div>
  );
}