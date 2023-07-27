import React, { useContext, useState } from 'react';
import pass from '../assets/password-svgrepo-com.svg';
import { useContract, useContractWrite } from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';

const Add = () => {
  const { contract } = useContract(
    '0x9454749cEB6f8BAcBe48C1c7660D1a6eEeb20EA6'
  );
  const { mutateAsync: storeCredentials, isLoading } = useContractWrite(
    contract,
    'storeCredentials'
  );

  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async () => {
    let notify = toast.loading('Storing Credential...');
    try {
      const data = await storeCredentials({
        args: [website, username, password],
      });
      console.info('contract call successs', data);
      toast.success('Credential Stored', { id: notify });
    } catch (err) {
      toast.error('Whoops, Something went wrong', { id: notify });
      console.error('contract call failure', err);
    }
  };

  return (
    <div className="h-[400px] w-[900px] bg-[#efefef] rounded-lg top-[25%] left-[23%] z-50 fixed p-5">
      <label
        htmlFor="input-group-1"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600"
      >
        Website
      </label>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 16"
          >
            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
          </svg>
        </div>
        <input
          type="text"
          id="input-group-1"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <label
        htmlFor="website-admin"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600"
      >
        Username
      </label>
      <div className="flex mb-6">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </span>
        <input
          type="text"
          id="website-admin"
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <label
        htmlFor="website-admin"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600"
      >
        Password
      </label>
      <div className="flex">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <img
            src={pass}
            alt=""
            className="w-5 h-10 text-gray-500 dark:text-gray-400"
          />
        </span>
        <input
          type="text"
          id="website-admin"
          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="**********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={() => submitHandler()}
          className="bg-[#9A208C] mt-6 w-24 h-10 flex justify-center items-center text-center rounded-md text-white uppercase tracking-widest"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Add;
