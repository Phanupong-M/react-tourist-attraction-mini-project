import { useState, useEffect } from "react";
import axios from "axios";

function LandingPage() {
  const [search, setSearch] = useState("");
  const [trips, setTrips] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState(search);
  const [copiedId, setCopiedId] = useState(null);

  const getSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${debouncedValue}`
      );
      setTrips(response.data.data);
    } catch (error) {
      console.log("failed to get data", error);
    }
  };

  useEffect(() => {
        getSearch();
  }, [debouncedValue]);

  useEffect(() => {
    const timeout = setTimeout (() => {
        setDebouncedValue(search)
    },800)

    return () => clearTimeout(timeout)
  },[search])

  function handleCatgory (cateogry) {
    setSearch(cateogry)
  }

    // console.log("xxx");


  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col items-center justify-start mt-10">
        <h1 className="text-3xl font-bold text-blue-500">เที่ยวไหนกันดี</h1>

        <div className="flex flex-col justify-start mt-10 w-[80%] gap-2 mb-8 ">
          <label htmlFor="search">ค้นหาที่เที่ยว</label>
          <input
            className="border-b-2 w-full text-center focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="หาที่เที่ยวแล้วไปกัน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {trips.map((trip) => (
          <div
            key={trip.eid}
            className="flex flex-col md:flex-row w-full p-6 mb-6 gap-6"
          >
            {/* Left side - Main image */}
            <div className="w-2/5">
              <img
                src={trip.photos[0]}
                alt=""
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>

            {/* Right side - Content */}
            <div className="w-3/5 flex flex-col relative">
              <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
              <p className="text-gray-500 mb-2">
                {trip.description.length > 100
                  ? trip.description.substring(0, 100) + "..."
                  : trip.description}
              </p>

              <a 
                className="text-blue-500 underline mb-4"
                href={trip.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                อ่านต่อ
              </a>

              {/* {viewMore && <div>{trip.url}</div>} */}

              {/* Tags section */}
              <div className="mb-4">
                <span className="text-gray-600">หมวด </span>
                {trip.tags.map((item, index) => (
                    <>
                    {index == item.length && <span className="text-gray-700">และ</span>}
                    <span
                        key={index}
                        className=" underline text-gray-700 rounded-full inline-block py-1 px-1 mx-1 cursor-pointer"
                        onClick = {() => {handleCatgory(item)}}
                    >
                        {item}
                    </span>
                    </>
                ))}
              </div>

              {/* Thumbnail images */}
              <div className="flex flex-row gap-2 mt-auto">
                {trip.photos.map(
                  (item, index) =>
                    index !== 0 && (
                      <img
                        key={index}
                        src={item}
                        alt=""
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )
                )}
              </div>

              <a className="absolute bottom-0 right-0">copy link</a>

            </div>


          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;

