import React, { useState, useEffect, useRef } from "react";

const ImageContainer = ({
  initialHotspotData,
  onHotspotClick,
  activeHotspot,
  onClosePopup,
}) => {
  const [hotspotData, setHotspotData] = useState(initialHotspotData || []);
  const [imageUrl, setImageUrl] = useState("");
  const hotspotRefs = useRef([]);
  const [logoVisibility, setLogoVisibility] = useState(
    initialHotspotData.map(() => true)
  );

  const toggleLogo = (hotspotId) => {
    if (activeHotspot === hotspotId) {
      // If the popup is open, close it
      onClosePopup();
    } else {
      // If the popup is closed, open it and update logo visibility
      onHotspotClick(hotspotId);
    }
  };

  useEffect(() => {
    const newHotspotData = [];

    let i = 1;
    while (true) {
      const horizontalPctField = document.querySelector(
        `input[name="hotspot_horizontal_pct[${i}]"]`
      );

      if (!horizontalPctField) {
        break;
      }

      const verticalPctField = document.querySelector(
        `input[name="hotspot_vertical_pct[${i}]"]`
      );
      const productNameField = document.querySelector(
        `input[name="hotspot_product_name[${i}]"]`
      );
      const productTextField = document.querySelector(
        `input[name="hotspot_product_text[${i}]"]`
      );
      const productLinkField = document.querySelector(
        `input[name="hotspot_product_link[${i}]"]`
      );

      newHotspotData.push({
        id: i,
        horizontalPct: horizontalPctField?.value || "",
        verticalPct: verticalPctField?.value || "",
        productName: productNameField?.value || "",
        productText: productTextField?.value || "",
        productLink: productLinkField?.value || "",
      });

      i++;
    }

    setHotspotData(newHotspotData);

    const hiddenField = document.querySelector('input[name="hotspot_image"]');
    const newImageUrl = hiddenField ? hiddenField.value : "";

    setImageUrl(newImageUrl);
    setLogoVisibility((prevVisibility) =>
      prevVisibility.map((_, index) => index === activeHotspot - 1)
    );
  }, [initialHotspotData, activeHotspot]);

  useEffect(() => {
    const handleClickOutsidePopup = (event) => {
      const popup = document.querySelector(".popup_test");
      const hotspots = document.querySelectorAll(".hotspot");

      if (popup && !popup.contains(event.target)) {
        let isOutsideHotspots = true;

        hotspots.forEach((hotspot) => {
          if (hotspot.contains(event.target)) {
            isOutsideHotspots = false;
          }
        });

        if (isOutsideHotspots) {
          onClosePopup();
        }
      }
    };

    document.body.addEventListener("click", handleClickOutsidePopup);

    return () => {
      document.body.removeEventListener("click", handleClickOutsidePopup);
    };
  }, [onHotspotClick, onClosePopup]);

  return (
    <div style={{ position: "relative" }}>
      {imageUrl && <img src={imageUrl} alt="Subspace" />}
      {hotspotData.map((hotspot, index) => (
        <div
          className={`hotspot hotspot-${hotspot.id} ${
            activeHotspot !== null && activeHotspot === hotspot.id
              ? "active-hotspot"
              : ""
          }`}
          key={hotspot.id}
          style={{
            position: "absolute",
            left: `${hotspot.horizontalPct}%`,
            top: `${hotspot.verticalPct}%`,
            zIndex:
              activeHotspot !== null && activeHotspot === hotspot.id ? 999 : 1,
          }}
          onClick={() => toggleLogo(hotspot.id)}
        >
          <button className="hot-spot_dot tap_area">
            <div className="logo-container">
              {activeHotspot !== null && activeHotspot === hotspot.id ? (
                <svg
                  id="closing-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "block" }}
                >
                  <path
                    d="M9.16992 14.83L14.8299 9.17"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.8299 14.83L9.16992 9.17"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  id="reevela-logo"
                  width="35"
                  height="40"
                  viewBox="0 -10 50 80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="

 M37.8135 43.0955C37.5059 42.8309 37.0445 42.4529 36.4678 41.9992C35.8911 41.5267 35.3913 40.9975 34.9876 40.3737L29.8933 32.4918C30.47 32.2272 31.0082 31.9247 31.4888 31.5656C31.4696 31.1687 31.4504 30.7906 31.4504 30.3748C31.4504 29.1084 31.7195 28.0499 32.2578 27.2182C32.7768 26.3677 33.4689 25.9518 34.334 25.9518C34.6031 25.9518 34.8722 25.9896 35.1029 26.0842C35.199 25.5927 35.2375 25.0824 35.2375 24.572C35.2375 24.3452 35.2375 24.1184 35.199 23.9105C35.026 21.1509 33.8534 19.015 31.7195 17.5029C29.4127 15.8773 26.26 15.0646 22.2614 15.0646H10.7656C10.0735 15.0646 9.7467 15.3292 9.7467 15.8773V16.0475C9.7467 16.3877 10.0158 16.898 10.5926 17.5785C11.1693 18.2589 11.4576 18.9583 11.4576 19.6576V40.3737C11.4576 41.0731 11.1693 41.7724 10.5926 42.4529C10.0158 43.1333 9.7467 43.6437 9.7467 43.9839V44.154C9.7467 44.6832 10.0735 44.9479 10.7656 44.9479H20.1852C20.8581 44.9479 21.2041 44.6832 21.2041 44.154V43.9839C21.2041 43.6437 20.8773 43.1333 20.2429 42.4529C19.5893 41.7724 19.2817 41.0731 19.2817 40.3737V33.796L23.2226 33.7204L24.7605 36.5178L26.8751 40.3737C27.0481 40.8651 27.1443 41.2621 27.1443 41.5645C27.1443 41.7157 27.125 41.8669 27.0674 41.9614C26.9136 42.2639 26.6637 42.6041 26.3176 43.001C25.9716 43.379 25.7986 43.7004 25.7986 43.9839V44.154C25.7986 44.6832 26.1446 44.9479 26.8174 44.9479H35.1414C36.2563 44.9479 37.2752 44.8156 38.2172 44.532C38.2556 44.4186 38.2941 44.3052 38.2941 44.154V43.9839C38.2941 43.6437 38.1403 43.3412 37.8327 43.0766L37.8135 43.0955ZM26.0485 29.4675C25.837 29.7322 25.5871 29.959 25.3372 30.1291C24.7413 30.5827 24.0492 30.7906 23.2418 30.7906H21.9538C21.0503 30.7906 20.3582 30.5638 19.9161 30.0535C19.474 29.5431 19.2433 28.7304 19.2433 27.5585V20.1869C19.2433 19.5442 19.3971 19.015 19.7046 18.5992C20.0122 18.2022 20.3967 17.9943 20.8965 17.9943H21.6655C23.0688 17.9943 24.3376 18.6937 25.4526 20.0546C26.5868 21.4344 27.1443 23.1922 27.1443 25.347C27.1443 26.1976 27.0674 26.9536 26.9136 27.5963C26.7406 28.3523 26.4522 28.9572 26.0485 29.4486V29.4675Z
  M43.3114 37.6141C42.9269 37.4818 42.5617 37.5763 42.2541 37.8787C41.8504 38.4269 41.2544 38.8616 40.4663 39.2018C39.6973 39.561 38.8515 39.7311 37.9672 39.7311C35.8718 39.7311 34.257 38.8049 33.0843 36.9904L41.6005 32.2839C42.7154 31.7168 43.2729 30.8474 43.2729 29.6755C43.2729 28.1823 42.5617 26.8592 41.1391 25.6684C39.7358 24.4965 37.7557 23.9105 35.2182 23.9105H35.1028C32.2193 23.9105 29.7394 24.8934 27.6632 26.8403C27.3941 27.1049 27.1442 27.3506 26.9135 27.6341C26.7405 28.3902 26.4521 28.995 26.0484 29.4865C25.8369 29.7511 25.587 29.9779 25.3371 30.148C24.8181 31.3955 24.549 32.7942 24.549 34.3253C24.549 35.1002 24.6066 35.8374 24.722 36.5367L26.8366 40.3926C27.0096 40.8841 27.1057 41.281 27.1057 41.5834C27.2211 41.7346 27.3556 41.8859 27.5094 42.0182C29.4702 43.9839 32.0078 44.9668 35.122 44.9668C36.237 44.9668 37.2559 44.8345 38.1979 44.551C39.3897 44.1918 40.447 43.6059 41.3506 42.7931C42.9461 41.3377 43.7728 39.9012 43.8304 38.5025C43.8497 38.0489 43.6766 37.7653 43.2922 37.633L43.3114 37.6141ZM32.2577 27.2372C32.7767 26.3866 33.4688 25.9708 34.3339 25.9708C34.603 25.9708 34.8721 26.0086 35.1028 26.1031C35.6795 26.311 36.1601 26.7457 36.4869 27.464C36.9675 28.4469 37.1982 29.4109 37.1982 30.3181C37.1982 31.2254 36.833 31.9626 36.0832 32.4729L32.1039 34.8356C31.7771 33.8716 31.5849 32.7942 31.4887 31.6034C31.4695 31.2065 31.4503 30.8285 31.4503 30.4126C31.4503 29.1462 31.7194 28.0878 32.2577 27.2561V27.2372Z"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>
      ))}
      {activeHotspot !== null && (
        <a
          href={hotspotData[activeHotspot - 1]?.productLink}
          target="_self"
          rel="noopener noreferrer"
          className={`popup_test ${
            parseFloat(hotspotData[activeHotspot - 1]?.horizontalPct) > 75
              ? "over-75"
              : ""
          }`}
          style={{
            position: "absolute",
            left: `${
              parseFloat(hotspotData[activeHotspot - 1]?.horizontalPct) > 75
                ? parseFloat(hotspotData[activeHotspot - 1]?.horizontalPct) - 26 + "%"
                : parseFloat(hotspotData[activeHotspot - 1]?.horizontalPct) +
                  3 +
                  "%"
            }`,
            top: `${hotspotData[activeHotspot - 1]?.verticalPct}%`,
            zIndex: 999,
            transform: `${
              parseFloat(hotspotData[activeHotspot - 1]?.horizontalPct) > 75
                ? "translateX(0)"
                : "translateX(0)"
            }`,
          }}
        >
          <p className="popup-title">
            {hotspotData[activeHotspot - 1]?.productName}
          </p>
          <p className="hotspot-text">
            {hotspotData[activeHotspot - 1]?.productText}
          </p>
        </a>
      )}
    </div>
  );
};

const App = () => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hotspotContents, setHotspotContents] = useState({});
  const [hotspots, setHotspots] = useState([
    { id: 1, x: 275, y: 730 },
    { id: 2, x: 450, y: 500 },
    { id: 3, x: 100, y: 73 },
    { id: 4, x: 350, y: 450 },
    { id: 5, x: 350, y: 450 },
    { id: 6, x: 275, y: 730 },
    { id: 7, x: 275, y: 730 },
    { id: 8, x: 275, y: 730 },
    { id: 9, x: 275, y: 730 },
    { id: 10, x: 275, y: 730 },
  ]);

  const handleHotspotClick = (hotspotId) => {
    // Check if the click is on the logo (SVG) or its path
    const isSVGClick =
      event.target.tagName === "svg" ||
      event.target.closest("svg") ||
      event.target.tagName === "path" ||
      event.target.closest("path");

    if (isSVGClick) {
      // If it's a logo click, toggle the logo
      toggleLogo(hotspotId);
    } else {
      

      if (hotspotId === activeHotspot) {
        // If the same hotspot is clicked again, close it
        setActiveHotspot(null);
        return;
      }

      // Get the selected hotspot based on its id
      const selectedHotspot = hotspots.find(
        (hotspot) => hotspot.id === hotspotId
      );

      // Update the rest of your code for setting hotspot contents and updating state...
      let title, description;

      switch (hotspotId) {
        case 1:
          title = "Chair";
          description = "Perfect to sit and read a book in";
          break;
        case 2:
          title = "Curtains";
          description = "Elegant and sunproof";
          break;
        case 3:
          title = "Pillow";
          description = "Soft and comfy";
          break;
        default:
          title = "Default Title";
          description = "Default Description";
      }

      const contentForHotspot = {
        title,
        description,
      };

      setHotspotContents((prevContents) => ({
        ...prevContents,
        [hotspotId]: contentForHotspot,
      }));

      setActiveHotspot(hotspotId);
      setSelectedProducts((prevSelected) => [...prevSelected, selectedHotspot]);
    }
  };

  const handleClosePopup = () => {
    setActiveHotspot(null);
  };

  return (
    <div className="app-container">
      {activeHotspot !== null && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#0006",
            zIndex: 100,
          }}
          onClick={handleClosePopup}
        ></div>
      )}
      <div className="venueimage">
        <ImageContainer
          initialHotspotData={hotspots}
          onHotspotClick={handleHotspotClick}
          activeHotspot={activeHotspot}
          onClosePopup={handleClosePopup}
        />
      </div>
    </div>
  );
};

export default App;
