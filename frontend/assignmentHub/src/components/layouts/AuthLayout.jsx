const AuthLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-2 bg-[#F7E3FF]">
      <div className=" h-240 p-5 ">
        <div className="container rounded-4xl grid grid-cols-1 ">
          <div>
            <h1 className="text-5xl p-5 font-bold text-[#403942]">
              Assignment Hub.
            </h1>
          </div>

         
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
