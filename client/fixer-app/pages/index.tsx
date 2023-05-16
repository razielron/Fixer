import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  const loginRedirect = ()=>{
      router.push('/login');
  }

  const registerRedirect = ()=>{
    router.push('/register');
} 

  const proffesionRedirect = () => {
    router.push('/ProfessionalRegister');
  }

  return (

    <div className="min-h-screen reative  h-full w-full bg-[url('/images/peakpx.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="w-full h-full">
        <nav className="px-12 py-5">
          <img src="/images/fixerLogo.png" alt="Logo" className="h-12"/>
        </nav>
        <button onClick={proffesionRedirect} className="py-1 px-10 absolute top-0 right-0 bg-yellow-400 rounded-md mt-2 mr-2 transion">
                JOIN AS A SERVICE PROVIDER
        </button>
        <button onClick={registerRedirect} className="py-1 px-10 absolute top-0 right-0 bg-yellow-400 rounded-md mt-12 mr-2 transion">
                JOIN AS A MEMBER
        </button>
          <div className="min-h-screen bg-black bg-opacity-10 flex justify-center">
            <div className="py-5 self-center lg:max-w-md rounded-md w-full">
            <h1 className="font-bold text-4xl text-white">Fixer - The home of the professionals</h1>
            <h1 className="text-white py-2 mt-2">Looking for a solution for the problem?
             You came to the right place</h1>
            <button onClick={loginRedirect} className="bg-yellow-400 py-1 px-10 rounded-md mt-6 transion">
                Login
            </button>

            </div>
          </div>
      </div>
    </div>
  )
}


