import AuthLayout from "../components/layouts/AuthLayout";
import { Link } from "react-router-dom";


const Register = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col align-middle justify-center p-40 gap-5  ">
        <h1 className="text-5xl mb-2">Register Here</h1>
        <form className="flex flex-col align-middle items-baseline mt-3 ">
          <label className="mb-3 text-2xl">First Name</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="text"
            placeholder="First Name"
          /><label className="mb-3 text-2xl">Last Name</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="text"
            placeholder="Last Name"
          /><label className="mb-3 text-2xl">Email</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="text"
            placeholder="example@gmail.com"
          />
          <label className="mb-3 text-2xl">Password</label>
          <input
            className="p-3 w-full border mb-4 rounded-2xl"
            type="password"
            placeholder="password"
          />
        
          <button className="mt-2 w-full border bg-[#403942] hover:bg-[#534b56] transform transition-all duration-200 p-2 cursor-pointer rounded-3xl">
            Register
          </button>
        </form>
        <div>
          <p>Already have an account? <Link className="text-blue-700" to="/login">Login</Link></p>
          
        </div>
        
      </div>
    </AuthLayout>
  );
};

export default Register;
