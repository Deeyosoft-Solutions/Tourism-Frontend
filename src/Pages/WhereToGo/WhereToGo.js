import Destinations from "../../Component/WebContent/WhereToGo/Destinations";
import ExplorePanchpokhari from "../../Component/WebContent/WhereToGo/ExplorePanchpokhari";
import { Activities } from "../../Data/Activities";

const WhereToGo = () => {
  return (
    <>
      <div className="sm:my-[30px] items-center justify-center px-3">
        <Destinations />
      </div>
      <div className="sm:my-[30px] flex flex-col items-center justify-center py-3 px-auto bg-gray-50">
        <p className="font-Playfair text-xl font-medium text-center mb-2 md:mb-10">
          Things to do in Panchpokhari Lake
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center md:mb-8 gap-x-32">
          {Activities.map((a) => (
            <p key={a.id} className="font-Open text-base mb-2 md:mb-10 flex">
              <span className="px-2 rounded-full bg-red-700 text-white mr-2">
                {a.id}
              </span>
              {a.activity}
            </p>
          ))}
        </div>
        <img
          src="/assets/Images/yellow-line.png"
          alt="Panchpokhari Tourism"
          className=" w-full object-contain rounded-lg p-1 mx-auto"
        />
      </div>
      <div className="sm:my-[30px] items-center justify-center px-3">
        <ExplorePanchpokhari />
      </div>
    </>
  );
};

export default WhereToGo;
