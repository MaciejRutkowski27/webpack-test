import React, { useState, useEffect } from "react";

const ImageContainer = ({
  initialHotspotData,
  onHotspotClick,
  activeHotspot,
  hotspotContents,
  onClosePopup,
}) => {
  const [hotspotData, setHotspotData] = useState(initialHotspotData || []);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const newHotspotData = [];

    for (let i = 1; i <= 2; i++) {
      const horizontalPctField = document.querySelector(
        `input[name="hotspot_horizontal_pct[${i}]"]`
      );
      const verticalPctField = document.querySelector(
        `input[name="hotspot_vertical_pct[${i}]"]`
      );
      const productNameField = document.querySelector(
        `input[name="hotspot_product_name[${i}]"]`
      );
      const productLinkField = document.querySelector(
        `input[name="hotspot_product_link[${i}]"]`
      );
      console.log("productLinkField:", productLinkField);
      newHotspotData.push({
        id: i,
        horizontalPct: horizontalPctField?.value || "",
        verticalPct: verticalPctField?.value || "",
        productName: productNameField?.value || "",
        productLink: productLinkField?.value || "",
      });
      console.log(
        `Hotspot ${i} - horizontalPct: ${horizontalPctField?.value}, verticalPct: ${verticalPctField?.value}, productName: ${productNameField?.value}, productLink: ${productLinkField?.value}`
      );
    }
    setHotspotData(newHotspotData);

    const hiddenField = document.querySelector('input[name="hotspot_image"]');
    const newImageUrl = hiddenField ? hiddenField.value : "";

    setImageUrl(newImageUrl);
    console.log("hotspotData in useEffect:", newHotspotData);
    console.log("activeHotspot in useEffect:", activeHotspot);
  }, []);

  const getPopupPosition = (hotspot) => {
    const popupWidth = 200; // Adjust this value as needed
    const popupHeight = 100; // Adjust this value as needed

    const left = `${hotspot.horizontalPct}%`;
    const top = `${hotspot.verticalPct}%`;

    return {
      left,
      top,
      transform: `translate(-${popupWidth / 2}%, -${popupHeight}%)`, // Adjust this value as needed
    };
  };
  useEffect(() => {
    const handleClickOutsidePopup = (event) => {
      const popup = document.querySelector(".popup_test");
      const hotspot = document.querySelector(".hotspot");

      if (
        popup &&
        !popup.contains(event.target) &&
        hotspot &&
        !hotspot.contains(event.target)
      ) {
        onClosePopup();
      }
    };
    console.log("hotspotData:", hotspotData);
    console.log("activeHotspot:", activeHotspot);
    document.body.addEventListener("click", handleClickOutsidePopup);

    return () => {
      document.body.removeEventListener("click", handleClickOutsidePopup);
    };
  }, [onClosePopup]);

  return (
      <div style={{ position: "relative" }}>
    {imageUrl && <img src={imageUrl} alt="Subspace" />}
    {hotspotData.map((hotspot) => (
      <div
        className={`hotspot hotspot-${hotspot.id}`}
        key={hotspot.id}
        style={{
          position: "absolute",
          left: `${hotspot.horizontalPct}%`,
          top: `${hotspot.verticalPct}%`,
        }}
        onClick={() => onHotspotClick(hotspot.id)}
      >
          <button className="hot-spot_dot tap_area">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18V6"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ))}
      {activeHotspot !== null && (
        <div
          className="popup_test"
          style={{
            position: "absolute",
            left: `${hotspotData[activeHotspot - 1]?.horizontalPct}%`,
            top: `${hotspotData[activeHotspot - 1]?.verticalPct}%`,
            backgroundColor: "white",
            // Add other styles as needed
          }}
        >
          <p className="hotspot-text">
            Product: {hotspotData[activeHotspot - 1]?.productName}
          </p>
          <p className="hotspot-text">
            Link: {hotspotData[activeHotspot - 1]?.productLink}
          </p>
        </div>
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
  ]);

  const handleHotspotClick = (hotspotId) => {
    console.log("Clicked hotspot with id:", hotspotId);

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
    const selectedHotspot = hotspots.find(
      (hotspot) => hotspot.id === hotspotId
    );
    setSelectedProducts((prevSelected) => [...prevSelected, selectedHotspot]);
  };

  const handleClosePopup = () => {
    setActiveHotspot(null);
  };

  return (
    <div className="venueimage">
      <ImageContainer
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activeHotspot}
        hotspotContents={hotspotContents}
        onClosePopup={handleClosePopup}
      />
    </div>
  );
};

export default App;

