import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const loginRedirect = ()=>{
      router.push('/login');
  } 

  return (
    <div className="reative h-full w-full bg-[url('')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full bg-opacity-30">
        <nav className="px-12 py-5">
          <img src="/images/fixerLogo.png" alt="Logo" className="h-12"/>
          <div className="flex justify-center">
            <h1>Fixer - The home of the professionals</h1>
            <h3>Looking for a solution for the problem?</h3>
            <h3>You came to the right place</h3>
            <button onClick={loginRedirect} className="bg-yellow-400 py-2 rounded-md w-full mt-6 transion">
                Login
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}


