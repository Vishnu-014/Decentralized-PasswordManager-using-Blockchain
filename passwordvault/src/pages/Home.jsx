import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import {
  useAddress,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useMetamask,
  useContractEvents,
} from '@thirdweb-dev/react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { SocialIcon } from 'react-social-icons';
import Add from './Add';
import pass from '../assets/password-svgrepo-com.svg';
import Modal from 'react-overlays/Modal';
import { toast } from 'react-hot-toast';
import { id } from 'ethers/lib/utils';

const Home = () => {
  const { state } = useLocation();
  const { isAuth } = state;

  const [credentials, setCredentials] = useState([]);
  const [clickedData, setClickedData] = useState(null);
  const [show, setShow] = useState(false);

  const renderBackdrop = (props) => (
    <div
      className="z-50 fixed top-0 bottom-0 left-0 right-0 bg-[#000] opacity-50"
      {...props}
    />
  );

  const { contract } = useContract(
    '0x9454749cEB6f8BAcBe48C1c7660D1a6eEeb20EA6'
  );

  const connect = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  const navigate = useNavigate();

  const { data: currentPassword, isLoading: currentPasswordLoading } =
    useContractRead(contract, 'currentPassword');

  const { data: getDataC, isLoading: currentLoading } = useContractRead(
    contract,
    'getCredentials'
  );

  const { data: event, isLoading: eventLoading } = useContractEvents(
    contract,
    'CredentialsStored'
  );

  

  const getData = () => {
    const notify = toast.loading('Credentials Loading ...');
    let allItemsC = [];
    for (let i = 0; i < event?.length; i++) {
      let item = event[i].data;
      allItemsC.push(item);
    }
    setCredentials(allItemsC.reverse());
    toast.success('Credentials Loaded', { id: notify });
  };

  useEffect(() => {
    getData();
  }, [event, eventLoading]);

  return (
    <div className="m-5 relative">
      <div className="absolute top-0 right-0 left-0 flex flow-row items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-3">
          <img
            src="https://seeklogo.com/images/F/fingerprint-logo-025BDD51E3-seeklogo.com.png"
            alt=""
            className="w-12 h-12 text-black"
          />
          <p className="font-semibold">
            User:{' '}
            <span className="text-purple-700">
              {address?.substring(0, 5)}...
              {address?.substring(address?.length - 4, address?.length)}
            </span>
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="w-96 max-w-xs border border-purple-600 py-2 px-4 rounded-md placeholder:text-purple-500"
          />
          <AiOutlineSearch size={34} className="text-purple-500" />
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <button
            onClick={() => getData()}
            className="bg-[#1D5D9B] px-4 py-2 rounded-md text-white"
          >
            Get Credentials
          </button>
          <button
            onClick={() => setShow(true)}
            className="bg-[#A459D1] px-4 py-2 rounded-md text-white"
          >
            Add New
          </button>
          <button
            onClick={() => connect()}
            className="bg-[#413543] px-4 py-2 rounded-md text-white"
          >
            {address ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>

      <div className="absolute top-24 flex flex-col gap-4 overflow-y-auto scroll-smooth h-[700px]">
        {credentials.map((item, index) => {
          return (
            <div
              onClick={() => setClickedData(item)}
              key={index}
              className="bg-[#F0F0F0] h-16 w-[450px] flex flex-row items-center justify-start py-4 px-1 rounded-lg relative"
            >
              <SocialIcon
                url={item.website.replace(/^www\./, '')}
                className="w-20 h-20 p-5"
              />
              <div className="flewx flex-col items-center justify-center pl-3">
                <h1>{item.website}</h1>
                <h1>{item.username}</h1>
              </div>
              <div>
                <IoIosArrowForward
                  size={30}
                  className="absolute right-2 bottom-4 text-gray-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      {clickedData && (
        <div className="absolute top-24 right-[5%] flex flex-col gap-4 bg-gradient-to-tl from-[#e3e3e3] to-[#efefef] w-[1000px] h-96 p-5 border-3 border-purple-500 drop-shadow-xl rounded-xl">
          <div className="font-medium space-y-2">
            <h1 className="font-bold">
              Username:{' '}
              <span className="font-medium pl-4">{clickedData?.username}</span>
            </h1>
            <h1 className="font-bold">
              Password:{' '}
              <span className="font-medium pl-4">{clickedData?.password}</span>
            </h1>
            <h1 className="font-bold">
              Website :{' '}
              <span className="font-medium pl-7">{clickedData?.website}</span>
            </h1>
            <div className="flex items-center w-96 justify-center gap-8">
              <h1 className="font-bold">Strength: </h1>
              <PasswordStrengthBar
                className="flex-1 h-5 p-1"
                scoreWordStyle={false}
                scoreWords={false}
                shortScoreWord={false}
                minLength={5}
                barColors={[
                  '#000000',
                  '#ef4836',
                  '#f6b44d',
                  '#2b90ef',
                  '#25c281',
                ]}
                password={clickedData?.password}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        renderBackdrop={renderBackdrop}
      >
        <Add />
      </Modal>
    </div>
  );
};

export default Home;
