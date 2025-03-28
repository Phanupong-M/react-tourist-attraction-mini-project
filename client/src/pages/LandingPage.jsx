import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Check } from "lucide-react";

function LandingPage() {
  const [search, setSearch] = useState("");
  const [trips, setTrips] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState(search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copyLink, setCopyLink] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const getSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${debouncedValue}`
      );
      setTrips(response.data.data);
    } catch (error) {
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      console.log("failed to get data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearch();
  }, [debouncedValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(search);
    }, 800);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleCatgory(cateogry) {
    setSearch((prev) => `${prev} ${cateogry}`);
  }

  useEffect(() => {
    if (copyLink) {
      const timer = setTimeout(() => {
        setCopyLink(null);
        setShowPopup(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [copyLink]);

  const copyToClipboard = async (url, tripId) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyLink(tripId);
      setShowPopup(true);
    } catch (err) {
      console.error("ไม่สามารถคัดลอกลิงก์ได้: ", err);
    }
  };
  console.log(search);
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center justify-start mt-10">
        <h1 className="text-3xl font-bold text-blue-500">เที่ยวไหนกันดี</h1>

        {/* Search bar */}
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

        {/* Loading & Error */}
        {loading && <div>กำลังค้นหา...</div>}

        {!loading && trips.length === 0 && (
          <div className="text-center py-8">
            <p className="">ไม่พบข้อมูลการท่องเที่ยวที่คุณค้นหา</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Travel Card*/}
        {trips.map((trip) => (
          <div
            key={trip.eid}
            className="flex flex-col md:flex-row w-full p-6 mb-6 gap-6"
          >
            {/* Left side - Main image */}
            <div className="md:w-2/5 w-full">
              <img
                src={trip.photos[0]}
                alt={`สถานที่ท่องเที่ยว ${trip.title}`}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>

            {/* Right side - Content */}
            <div className="md:w-3/5 w-full flex flex-col relative">
              <a
                href={trip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold mb-2 text-gray-800 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
              >
                {trip.title}
              </a>
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

              {/* Tags section */}
              <div className="mb-4">
                <span className="text-gray-600">หมวด </span>
                {trip.tags.map((item, index) => (
                  <>
                    {index == trip.tags.length - 1 && (
                      <span className="text-gray-700">และ</span>
                    )}
                    <span
                      key={index}
                      className=" underline text-gray-700 rounded-full inline-block py-1 px-1 mx-1 cursor-pointer"
                      onClick={() => {
                        handleCatgory(item);
                      }}
                    >
                      {item}
                    </span>
                  </>
                ))}
              </div>

              {/* Sub-images */}
              <div className="flex flex-row gap-2 mt-auto">
                {trip.photos.map(
                  (item, index) =>
                    index !== 0 && (
                      <img
                        key={index}
                        src={item}
                        alt={`ภาพที่ ${index + 1} ของ ${trip.title}`}
                        className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg"
                      />
                    )
                )}
              </div>
              <div
                className={`absolute  right-[0] bottom-[0] cursor-pointer text-white rounded-xl px-2 py-2 
                ${
                  copyLink === trip.eid
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-blue-500 hover:bg-blue-400"
                }`}
                onClick={() => copyToClipboard(trip.url, trip.eid)}
              >
                {copyLink === trip.eid ? <Check /> : <Link />}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Popup แจ้งเตือนคัดลอกลิงค์สำเร็จ */}
      {showPopup && (
        <div
          className="fixed bottom-5 right-5 bg-green-100 border border-green-400 text-green-700 
        px-4 py-3 rounded shadow-md z-50 animate-fade-in-out"
        >
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <p>คัดลอกลิงค์เรียบร้อยแล้ว</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
