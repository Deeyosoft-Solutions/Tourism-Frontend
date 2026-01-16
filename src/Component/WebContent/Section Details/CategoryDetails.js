import { MdSearch } from "react-icons/md";

const CategoryDetails = () => {
  return (
    <div className="absolute flex flex-col p-2 items-center justify-center w-auto h-auto xl:top-[230px] lg:top-[180px] md:top-[150px] top-[100px] left-1/3">
      <div className="flex items-center justify-between gap-1 px-4 mx-auto w-[120px] md:w-[220px] lg:w-[320px] xl:w-[420px] bg-gray-50 rounded-3xl overflow-hidden">
        <input
          type="text"
          placeholder="Search"
          className="w-[80%] md:p-2 bg-gray-50 text-black focus:outline-none placeholder-sm placeholder-black"
        />
        <button className="text-gray-700 px-2 py-2 rounded-2xl hover:bg-gray-600 transition-all">
          <MdSearch />
        </button>
      </div>
    </div>
  );
};

export default CategoryDetails;
