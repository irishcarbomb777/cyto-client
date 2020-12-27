import React, {useState, useEffect} from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import "./Home.css";
import { LinkContainer } from "react-router-bootstrap";
import {BsPencilSquare} from "react-icons/bs";


export default function Home() {
  const [scandata, setScandata] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const scandata = await loadScandata();
        setScandata(scandata);
        console.log(scandata)
      } catch(e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadScandata() {
    return API.get("scandata", "/scandata")
  }

  function renderScandataList(notes) {
    return(
      <>
        <LinkContainer to="/scans/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Run a new scan</span>
          </ListGroup.Item>
        </LinkContainer>
        {scandata.map(({ userId, scanId, analysisType, dataOutput }) => (
          <LinkContainer key={scanId} to={`/scandata/${userId}/${scanId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {analysisType}
              </span>
              <br />
              <span className="font-weight-normal">
                {dataOutput}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>CytoDynamic Solutions</h1>
        <p className="text-muted">Area Detection MVP</p>
      </div>
    );
  }
  function renderScandata() {
    return (
      <div className="scandata">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Scan Data</h2>
        <ListGroup>{!isLoading&&renderScandataList(scandata)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderScandata() : renderLander()}
    </div>
  );
}