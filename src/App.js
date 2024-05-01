import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerPosition from "./MarkerPosition";
import arrow from "./images/icon-arrow.svg";
import bgDesktop from "./images/pattern-bg-desktop.png";

// https://geo.ipify.org/api/v2/country?apiKey=at_vzC0bc999FREbd83cnC3iyxXNeUGt&ipAddress=8.8.8.8
function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=8.8.8.8`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  async function getEnteredAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&i${checkIpAddress.test(ipAddress) ?
      `ipAddress = ${ipAddress}` : checkDomain.test(ipAddress) ? `domain=${ipAddress}` : "" }`
    );
    const data = await res.json();
    setAddress(data);

  }

  function handleSubmit (e)  {
    e.preventDefault()
    getEnteredAddress();
    setIpAddress("")
  }


  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img
            src={bgDesktop}
            alt="background"
            className="w-full h-80 object-cover"
          ></img>
        </div>
        <div className="auto p-8">
          <h1 className="text-2xl lg:text-4xl text-center font-bold text-white mb-8">
            IP Address Tracker
          </h1>

          <form onSubmit={handleSubmit} autoComplete="off"  className="flex justify-center mx-auto max-w-xl">
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP address or domain"
              className="py-3 px-6 rounded-l-lg w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            ></input>
            <button
              type="submit"
              className="bg-black py-5 px-6 hover:opacity-55 rounded-r-lg"
            >
              <img src={arrow} alt="icon"></img>
            </button>
          </form>
        </div>

        {address && (
          <>
            <article
              className="bg-white rounded-lg shadow-md p-8  grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl lg:mx-auto text-center lg:text-center relative md:text-left lg:-mb-20"
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-400 ">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Ip address
                </h2>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  {address.ip}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Location
                </h2>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  {address.location.region},
                </p>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  {address.location.city}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400 ">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Timezone
                </h2>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  UTC {address.location.timezone}
                </p>
              </div>

              <div className="">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  ISP
                </h2>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  {address.isp}
                </p>
                <p className="font-bold text-2xl text-slate-900 md:text-xl">
                  {address.isp}
                </p>
              </div>
            </article>

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "500px", width: "100vw",  }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
