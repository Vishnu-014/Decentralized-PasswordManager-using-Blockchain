import React, { useState, useRef, useEffect } from 'react';
import {
  useAddress,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useMetamask,
} from '@thirdweb-dev/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

import metamasklogo from '../assets/MetaMask.gif';

const Login = () => {
  const { contract } = useContract(
    '0x9454749cEB6f8BAcBe48C1c7660D1a6eEeb20EA6'
  );
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  const navigate = useNavigate();
  //const history = useHistory()
  const [userPassword, setUserPassword] = useState('');

  const { data: currentPassword, isLoading: currentPasswordLoading } =
    useContractRead(contract, 'currentPassword');

  const { data: timeRemaining, isLoading: timeRemainingLoading } =
    useContractRead(contract, 'timeRemainingForNextPassword');

  const { data: loginVerification, isLoading: loginVerificationL } =
    useContractRead(contract, 'login', [userPassword]);


  console.log(currentPassword);
  console.log('====================================');
  console.log(loginVerification);
  console.log('====================================');
  console.log(timeRemaining?.toNumber());

  const { mutateAsync: generateNewPassword, isLoading: generateNewPasswordL } =
    useContractWrite(contract, 'generateNewPassword');

  const generatePass = async () => {
    try {
      const data = await generateNewPassword({ args: [] });

      if (data) {
        var templateParams = {
          to_name: 'Vishnu',
          from_name: 'Web3 random Password',
          message: `Generated new Password ${data}`,
          userPass: userPassword,
        };

        emailjs
          .send(
            'service_uf5805x',
            'template_z2013ie',
            templateParams,
            'YUP-uWVUU0Zb5Ayx5'
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
      }

      console.info('contract call successs', data);
    } catch (err) {
      console.error('contract call failure', err);
    }
  };

  useEffect(() => {
    console.log('use');
    if (currentPassword) {
      var templateParams = {
        to_name: 'Vishnu',
        from_name: 'Web3 random Password',
        message: `Generated new Password ${currentPassword}`,
      };

      emailjs
        .send(
          'service_uf5805x',
          'template_z2013ie',
          templateParams,
          'YUP-uWVUU0Zb5Ayx5'
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  }, [generatePass]);

  const submitHandler = (e) => {
    e.preventDefault();
    const notification = toast.loading('Authenticating...');

    // var templateParams = {
    //   to_name: 'Vishnu',
    //   from_name: 'Web3 random Password',
    //   message: currentPassword,
    //   userPass: userPassword,
    // };

    // emailjs
    //   .send(
    //     'service_uf5805x',
    //     'template_z2013ie',
    //     templateParams,
    //     'YUP-uWVUU0Zb5Ayx5'
    //   )
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     }
    //   );

    if (timeRemaining?.toNumber() !== 0) {
      if (userPassword === currentPassword) {
        navigate('./home', { state: { isAuth: true } });
        toast.success('Login Successful', { id: notification });
      } else {
        navigate('/', { state: { isAuth: false } });
        toast.error('Password Incorrect', { id: notification });
      }
    } else {
      generatePass();
      toast.success('Password Changed', { id: notification });
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat relative"
      style={
        // "background-image:url('https://images.unsplash.com/photo-1499123785106-343e69e68db1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80')"
        {
          backgroundImage:
            "url('https://img.freepik.com/premium-vector/network-connection-background-abstract_23-2148875737.jpg?w=900')",
        }
      }
    >
      <div className="absolute top-14 right-14 flex flex-row gap-5">
        <div
          className="bg-[#fff] px-4 py-2 rounded-md flex flex-row gap-1 justify-center items-center"
          onClick={() => connect()}
        >
          <p className="font-semibold text-lg">
            {address ? 'Connected' : 'Connect'}
          </p>
          <img
            className="w-5 h-5 object-contain"
            src={metamasklogo}
            alt="metamask"
          />
        </div>
        <div
          className="bg-[#EA5455] text-white px-4 py-2 rounded-md flex flex-row gap-1 justify-center items-center"
          onClick={() => disconnect()}
        >
          <p className="font-semibold text-lg">Disconnect</p>
          <img
            className="w-5 h-5 object-contain"
            src={metamasklogo}
            alt="metamask"
          />
        </div>
      </div>

      <div className="absolute md:top-14 md:left-14 sm:top-36 sm:left-[50%] overflow-visible">
        <h3 className="text-white font-semibold">
          User:{' '}
          <span className="text-[#28DF99]">
            {address?.substring(0, 5)}...
            {address?.substring(address.length - 4, address.length)}
          </span>
        </h3>
      </div>

      <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
        <div className="text-white">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="https://seeklogo.com/images/F/fingerprint-logo-025BDD51E3-seeklogo.com.png"
              width="70"
              alt=""
              className="pb-2"
            />
            <h1 className="mb-2 text-2xl">Web3 Login</h1>
            <span className="text-gray-300">Enter Login Details</span>
          </div>
          <form onSubmit={submitHandler}>
            {/* <div className="mb-4 text-lg"> */}
            {/* <input
                className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                type="text"
                name="name"
                placeholder="id@email.com"
              />
            </div> */}
            <div className="mb-4 text-lg">
              <input
                className="rounded-3xl border-none bg-[#435B66] bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md animate-pulse"
                type="Password"
                name="name"
                placeholder="****"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div className="flex h-16 w-full flex-row items-center justify-center">
              <button className="animate-border inline-block rounded-md bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-1">
                <span className="block rounded-md bg-slate-900 px-7 py-2 font-bold text-white ">
                  {' '}
                  Login{' '}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
