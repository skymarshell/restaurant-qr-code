import React, { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { useSearchParams } from "react-router-dom";
import ReactToPrint, { useReactToPrint } from "react-to-print";


function Print_QrCode(props) {
  const [searchParams] = useSearchParams();
  const qrCodeValue = searchParams.get("value");
  const tableNumber = searchParams.get("tableNumber");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const customerCount = searchParams.get("customerCount");
  console.log(qrCodeValue);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    reactToPrintFn();
  }, []);

  return (
    <>
      <div
        className="max-w-[300px] flex flex-col justify-center items-center border border-black"
        ref={contentRef}>
        <h1>DiamondBu</h1>
        <h1>โต๊ะ {tableNumber}</h1>
        <QRCode className="" value={`${qrCodeValue}`} />
        <p>{start}</p>
        <p>{end}</p>
        <p>Number of customers: {customerCount}</p>
      </div>
      <button onClick={reactToPrintFn}>Print</button>
    </>
  );
}

export default Print_QrCode;
