import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import { ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';

const BarContainer = styled.div`
  width: 100%;
  min-width: 240px;
  max-width: 420px;
  transform: rotate(90deg);
`;

const TokenInfo = (props) => {
  const { setupValues, PIECOLORS, getTokenInfo } = props;
  const [tokenInfo, setTokenInfo] = useState();
  const [tokenDistroInfo, setTokenDistroInfo] = useState();
  const [daoService] = useContext(DaoServiceContext);

  const pieDistroData = (info) => {
    const other =
      info.totalSupply -
      info.transSupply -
      info.trustSupply -
      info.minionSupply -
      info.daoSupply;
    const data = [
      {
        name: 'transmutation',
        transmutation: +daoService.web3.utils.fromWei(info.transSupply),
        trust: +daoService.web3.utils.fromWei(info.trustSupply),
        minion: +daoService.web3.utils.fromWei(info.minionSupply),
        dao: +daoService.web3.utils.fromWei(info.daoSupply),
        other: +other,
        amount: +daoService.web3.utils.fromWei(info.totalSupply),
      },
    ];
    return data;
  };

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo('getRequestToken', setupValues.giveToken);
      setTokenInfo(info);
      setTokenDistroInfo(pieDistroData(info));
    };

    tokens();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4>Token Info</h4>
      {tokenDistroInfo ? (
        <>
          <BarChart width={40} height={400} data={tokenDistroInfo}>
            <Bar dataKey="transmutation" fill="#0088FE" stackId="a" />
            <Bar dataKey="trust" fill="#00C49F" stackId="a" />
            <Bar dataKey="minion" fill="#FFBB28" stackId="a" />
            <Bar dataKey="dao" fill="#FF8042" stackId="a" />
            <Bar dataKey="other" fill="#8884d8" stackId="a" />
            {/* {tokenDistroInfo.map((entry, index) => (
            <Bar
              key={`cell-${index}`}
              fill={PIECOLORS[index % PIECOLORS.length]}
              stackId="a"
            />
          ))} */}
            <Legend />
          </BarChart>
        </>
      ) : null}
      <p>token address: {setupValues.giveToken}</p>
      <p>
        Total tokens:{' '}
        {tokenInfo && daoService.web3.utils.fromWei(tokenInfo.totalSupply)}
      </p>
      <p>link to token distro</p>
    </div>
  );
};

export default TokenInfo;
