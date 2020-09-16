import React, { useEffect, useState, useContext } from 'react';

import { Legend, BarChart, Bar } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';

const TokenInfo = (props) => {
  const { setupValues, PIECOLORS, getTokenInfo } = props;
  const [tokenInfo, setTokenInfo] = useState();
  const [tokenDistroInfo, setTokenDistroInfo] = useState();
  const [daoService] = useContext(DaoServiceContext);

  const pieDistroData = (info) => {
    const data = [
      {
        name: 'transmutation',
        tm: +daoService.web3.utils.fromWei(info.transSupply),
        tr: +daoService.web3.utils.fromWei(info.trustSupply),
        mi: +daoService.web3.utils.fromWei(info.minionSupply),
        da: +daoService.web3.utils.fromWei(info.daoSupply),
        amt: +daoService.web3.utils.fromWei(info.totalSupply),
      },
    ];
    const other = daoService.web3.utils.fromWei(
      '' +
        (info.totalSupply -
          info.transSupply -
          info.trustSupply -
          info.minionSupply -
          info.daoSupply),
    );
    if (parseInt(other) > 0) {
      data.other = {
        name: 'other',
        value: other,
      };
    }
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
        <BarChart
          width={40}
          height={400}
          data={tokenDistroInfo}
          layout={'vertical'}
        >
          <Legend />
          <Bar dataKey="tm" fill="#888rd8" stackId="a" />
          <Bar dataKey="tr" fill="#888rd5" stackId="a" />
          <Bar dataKey="mi" fill="#888rd2" stackId="a" />
          <Bar dataKey="da" fill="#888rd0" stackId="a" />
          {tokenDistroInfo.map((entry, index) => (
            <Bar
              key={`cell-${index}`}
              fill={PIECOLORS[index % PIECOLORS.length]}
              stackId="a"
            />
          ))}
        </BarChart>
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
