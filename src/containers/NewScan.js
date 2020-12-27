import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import "./NewScan.css";


export default function NewScan() {
  const file = useRef(null);
  const history = useHistory();
  const [analysisType, setAnalysisType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return analysisType.length > 0;
  }

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

    setIsLoading(true);

    try {
        const attachment = file.current ? await s3Upload(file.current) : null;

        await createScandata({analysisType, attachment});
        history.push("/");
    } catch(e) {
        onError(e);
        setIsLoading(false);
    }
  }

  function createScandata(scandata) {
      console.log(scandata);
      return API.post("scandata", "/scandata", {
          body: scandata
      })
  }
  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="analysisType">
          <Form.Control
            value={analysisType}
            as="textarea"
            onChange={(e) => setAnalysisType(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Run Scan
        </LoaderButton>
      </Form>
    </div>
  );
}