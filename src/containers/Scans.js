import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Scans.css"
import { s3Upload } from "../libs/awsLib";
export default function Notes() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const file = useRef(null);
  const { userId, scanId } = useParams();
  const history = useHistory();
  const [scandata, setScandata] = useState(null);
  const [analysisType, setAnalysisType] = useState("");

  useEffect(() => {
    function loadScandata() {
      return API.get("scandata", `/scandata/${userId}/${scanId}`);
    }

    async function onLoad() {
      try {
        const scandata = await loadScandata();
        const { analysisType, dataOutput, attachment } = scandata;

        if (attachment) {
          scandata.attachmentURL = await Storage.vault.get(attachment);
        }

        setAnalysisType(analysisType);
        setScandata(scandata);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [userId, scanId]);

function validateForm() {
  return analysisType.length > 0;
}

function formatFilename(str) {
  return str.replace(/^\w+-/, "");
}

function handleFileChange(event) {
  file.current = event.target.files[0];
}

function deleteScan() {
  console.log(userId, scanId);
  return API.del("scandata", `/scandata/${userId}/${scanId}`);
}

async function handleDelete(event) {
  event.preventDefault();

  const confirmed = window.confirm(
    "Are you sure you want to delete this note?"
  );

  if (!confirmed) {
    return;
  }

  setIsDeleting(true);

  try {
    await deleteScan();
    history.push("/");
  } catch(e) {
    onError(e);
    setIsDeleting(false);
  }
}

function saveNote(scandata) {
  console.log(scandata)
  return API.put("scandata", `/scandata/${userId}/${scanId}`,{
    body: scandata
  });
}

async function handleSubmit(event) {
  let attachment;

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
    if(file.current) { 
      attachment = await s3Upload(file.current);
    }

    await saveNote({
        analysisType,
        attachment: attachment || scandata.attachment
    });
    history.push("/");
  } catch(e) {
    onError(e);
    setIsLoading(false);
  }
}

return (
  <div className="Notes">
    {scandata && (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="analysisType">
          <Form.Control
            as="textarea"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          {scandata.attachment && (
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={scandata.attachmentURL}
              >
                {formatFilename(scandata.attachment)}
              </a>
            </p>
          )}
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Save
        </LoaderButton>
        <LoaderButton
          block
          size="lg"
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </LoaderButton>
      </Form>
    )}
  </div>
);
}