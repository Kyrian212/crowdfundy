import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useCelo } from "@celo/react-celo";
const Crowdfunding = require("../../hardhat/deployments/alfajores/Crowdfunding.json");

export const Card = ({ name, description, goal }: any) => {
  const formatGoal = ethers.formatEther(goal);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 max-w-md">
      <div className="p-4">
        <h2 className="font-bold text-3xl mb-2">{name}</h2>
        <p className="text-gray-700 text-xl text-base">{description}</p>
        <p className="text-gray-700 text-base mt-2">Goal: {formatGoal} ETH</p>
      </div>
    </div>
  );
};

export default function Home() {
  const { address, kit } = useCelo();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [projects, setProjects] = useState<any>([]);

  const crowdfundingContract = new kit.connection.web3.eth.Contract(
    Crowdfunding.abi,
    Crowdfunding.address
  );

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Goal:", goal);
    console.log("Address:", crowdfundingContract);
    // TODO: Submit form data to backend

    const tx = await crowdfundingContract.methods
      .createProject(name, description, goal)
      .send({ from: address });

    console.log(tx);
  };

  useEffect(() => {
    async function fetchProjects() {
      const data = await crowdfundingContract.methods.getProjects().call();
      console.log("Data:", data);

      setProjects(data);
    }
    fetchProjects();
    console.log("Projects:", projects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-screen items-center  ">
      <div className="flex items-between">
        <div className="">
          <div className="flex-col mf:mr-10">
            <h1 className="text-gray-400 text-3xl sm:text-5xl text-gradient py-1">
              Pool Crypto <br /> solve real problems
            </h1>
            <p className="text-left mt-5  font-medium md:w-9/12 w-11/12 text-base">
              create and support campaigns to help towards a greener and
              sustainable enviroment for the future!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg py-4">
          <div className="px-4">
            <form onSubmit={handleSubmit} className="px-6 py-5">
              <div className="mb-4">
                <label
                  className="block text-gray-500 font-semibold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="border-2 rounded-md w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-500 font-semibold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="border-2 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-500 font-semibold mb-2"
                  htmlFor="goal"
                >
                  Goal
                </label>
                <input
                  className="border-2 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="goal"
                  type="number"
                  placeholder="Project funding goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <button
                className="bg-blue-500 my-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center my-24">
        {projects &&
          projects
            .map((project: any) => (
              <Card
                key={project.deadline}
                name={project.name}
                description={project.description}
                goal={project.goal}
              />
            ))
            .reverse()}
      </div>
    </div>
  );
}