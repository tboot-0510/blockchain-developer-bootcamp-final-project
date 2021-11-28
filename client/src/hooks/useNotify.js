import React from 'react';
import Notify from "bnc-notify";
import BlocknativeSdk from 'bnc-sdk';
import WebSocket from 'ws';
import { NOTIFY_API_KEY } from '../constant';

const staging = true;
const networkID = 4;

const optionsBlk = {
  dappId:NOTIFY_API_KEY,
  networkId:networkID,
  ws: WebSocket,
  onerror: error => console.log(`Notify error: ${error.message}`)
}

const options = {
  dappId:NOTIFY_API_KEY,
  networkId:networkID,
  desktopPosition:"topRight",
  onerror: error => console.log(`Notify error: ${error.message}`)
}

export function initNotify() {
  const notify = Notify;

  // const blocknative = new BlocknativeSdk(optionsBlk)

  return notify(options);
  // return blocknative;
}