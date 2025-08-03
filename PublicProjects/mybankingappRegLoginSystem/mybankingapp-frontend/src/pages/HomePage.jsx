import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#242424] flex flex-col items-center justify-center text-center px-6">
      <p className="pclass text-white text-sm max-w-xl mb-8">
        <strong>Disclaimer:</strong> This website is a demonstration of a login and registration system, taken from one of my current fullstack projects. It serves purely as a frontend/backend template. No email verification is performed, and data is not intended for real use. Please use fake credentials for testing purposes only.
      </p>
      <p className="pclass text-white text-sm max-w-xl mb-8">
        First request to the server may take a minute, as the backend is hosted on Render and may need to wake up. Subsequent requests will be faster.
      </p>

      <button
        className="getStartedButton transform transition duration-200 active:scale-95"
        onClick={() => navigate('/loginOrRegister')}
      >
        Get Started
      </button>
    </div>
  );
}

export default HomePage;
